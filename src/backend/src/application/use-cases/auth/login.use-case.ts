import { IUserRepository } from '@/domain/repositories/user.repository.interface';
import { LoginDTO } from '@/application/dto/login.dto';
import { UnauthorizedError } from '@/shared/errors/unauthorized-error';
import bcrypt from 'bcrypt';
import { logger } from '@/shared/logger';

export class LoginUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(dto: LoginDTO): Promise<{ userId: string; email: string; name: string }> {
    // Email and password are already normalized by Zod schema
    logger.info('Login attempt', { email: dto.email });

    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      logger.warn('Login failed: user not found', { email: dto.email });
      throw new UnauthorizedError('Invalid credentials');
    }

    // Ensure passwordHash is clean and valid
    let passwordHash = user.passwordHash?.trim() || '';
    if (!passwordHash || passwordHash === '') {
      logger.error('Login failed: user has no password hash', { userId: user.id, email: dto.email });
      throw new UnauthorizedError('Invalid credentials');
    }

    // Validate bcrypt hash format (should start with $2a$, $2b$, or $2y$)
    if (!passwordHash.startsWith('$2')) {
      logger.error('Login failed: invalid password hash format', { 
        userId: user.id, 
        email: dto.email,
        hashStart: passwordHash.substring(0, 10)
      });
      throw new UnauthorizedError('Invalid credentials');
    }

    // Ensure password is not empty
    const password = dto.password?.trim() || '';
    if (!password || password === '') {
      logger.warn('Login failed: empty password', { email: dto.email });
      throw new UnauthorizedError('Invalid credentials');
    }

    try {
      // Log password hash info for debugging (without exposing the actual hash)
      logger.debug('Password comparison', {
        email: dto.email,
        userId: user.id,
        passwordHashLength: passwordHash.length,
        passwordHashStartsWith: passwordHash.substring(0, 7),
        passwordLength: password.length,
        passwordHashIsValid: passwordHash.startsWith('$2'),
      });

      // Compare password with trimmed hash
      // Note: bcrypt.compare handles the comparison and is safe to use
      const isPasswordValid = await bcrypt.compare(password, passwordHash);
      
      // Additional validation: if compare returns false, log more details
      if (!isPasswordValid) {
        logger.debug('Password comparison failed', {
          email: dto.email,
          userId: user.id,
          passwordHashLength: passwordHash.length,
          passwordLength: password.length,
          hashFormat: passwordHash.substring(0, 4),
        });
      }

      if (!isPasswordValid) {
        logger.warn('Login failed: invalid password', {
          email: dto.email,
          userId: user.id,
          passwordHashLength: user.passwordHash?.length || 0,
        });
        throw new UnauthorizedError('Invalid credentials');
      }

      logger.info('Login successful', { userId: user.id, email: dto.email });
      return {
        userId: user.id,
        email: user.email,
        name: user.name,
      };
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error;
      }
      logger.error('Login error during password comparison', {
        error,
        email: dto.email,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
      });
      throw new UnauthorizedError('Invalid credentials');
    }
  }
}





