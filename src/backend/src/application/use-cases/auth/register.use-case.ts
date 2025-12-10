import { IUserRepository } from '@/domain/repositories/user.repository.interface';
import { User } from '@/domain/entities/user.entity';
import { CreateUserDTO } from '@/application/dto/create-user.dto';
import { ValidationError } from '@/shared/errors/validation-error';
import bcrypt from 'bcrypt';
import { generateUUID } from '@/shared/utils/uuid';

export class RegisterUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(dto: CreateUserDTO): Promise<{ user: Omit<User, 'passwordHash'>; token: string }> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ValidationError('Email already registered');
    }

    // Ensure password is not empty and trimmed
    const password = dto.password?.trim() || '';
    if (!password || password === '') {
      throw new ValidationError('Password is required');
    }

    // Hash password with bcrypt (salt rounds: 10)
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Validate that hash was created successfully
    if (!passwordHash || !passwordHash.startsWith('$2')) {
      throw new Error('Failed to hash password');
    }

    // Create user (email is already normalized by Zod schema)
    const now = new Date();
    const user = new User(
      generateUUID(),
      dto.email, // Already normalized by Zod
      dto.name, // Already trimmed by Zod
      passwordHash,
      now,
      now
    );

    const createdUser = await this.userRepository.create(user);

    // Generate JWT token (will be done in the route handler)
    const { passwordHash: _, ...userWithoutPassword } = createdUser;

    return {
      user: userWithoutPassword,
      token: '', // Will be set in route handler
    };
  }
}

