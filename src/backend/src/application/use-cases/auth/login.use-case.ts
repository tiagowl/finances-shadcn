import { IUserRepository } from '@/domain/repositories/user.repository.interface';
import { LoginDTO } from '@/application/dto/login.dto';
import { UnauthorizedError } from '@/shared/errors/unauthorized-error';
import bcrypt from 'bcrypt';

export class LoginUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(dto: LoginDTO): Promise<{ userId: string; email: string; name: string }> {
    const user = await this.userRepository.findByEmail(dto.email.toLowerCase());

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
    };
  }
}





