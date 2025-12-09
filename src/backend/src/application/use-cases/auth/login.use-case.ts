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

    if (!user.passwordHash || user.passwordHash.trim() === '') {
      logger.error('Login failed: user has no password hash', { userId: user.id, email: dto.email });
      throw new UnauthorizedError('Invalid credentials');
    }

    try {
      // Log password hash info for debugging (without exposing the actual hash)
      logger.debug('Password comparison', {
        email: dto.email,
        userId: user.id,
        passwordHashLength: user.passwordHash?.length || 0,
        passwordHashStartsWith: user.passwordHash?.substring(0, 7) || 'null',
        passwordLength: dto.password.length,
      });

      const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

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





