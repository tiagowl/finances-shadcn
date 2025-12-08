import { FastifyInstance } from 'fastify';
import { RegisterUseCase } from '@/application/use-cases/auth/register.use-case';
import { LoginUseCase } from '@/application/use-cases/auth/login.use-case';
import { PostgreSQLUserRepository } from '@/infrastructure/repositories/postgres-user.repository';
import { createUserSchema } from '@/application/dto/create-user.dto';
import { loginSchema } from '@/application/dto/login.dto';
import { ValidationError } from '@/shared/errors/validation-error';

export async function authRoutes(fastify: FastifyInstance) {
  const userRepository = new PostgreSQLUserRepository();
  const registerUseCase = new RegisterUseCase(userRepository);
  const loginUseCase = new LoginUseCase(userRepository);

  fastify.post('/register', async (request, reply) => {
    try {
      const dto = createUserSchema.parse(request.body);
      const result = await registerUseCase.execute(dto);

      // Generate JWT token
      const token = fastify.jwt.sign({ userId: result.user.id }, { expiresIn: process.env.JWT_EXPIRES_IN || '24h' });

      return reply.status(201).send({
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          createdAt: result.user.createdAt,
          updatedAt: result.user.updatedAt,
        },
        token,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new ValidationError('Validation failed', error.errors);
      }
      throw error;
    }
  });

  fastify.post('/login', async (request, reply) => {
    try {
      const dto = loginSchema.parse(request.body);
      const result = await loginUseCase.execute(dto);

      // Generate JWT token
      const token = fastify.jwt.sign({ userId: result.userId }, { expiresIn: process.env.JWT_EXPIRES_IN || '24h' });

      return reply.send({
        user: {
          id: result.userId,
          email: result.email,
          name: result.name,
        },
        token,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new ValidationError('Validation failed', error.errors);
      }
      throw error;
    }
  });
}





