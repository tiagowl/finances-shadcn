import { Hono } from 'hono';
import jwt from 'jsonwebtoken';
import { RegisterUseCase } from '@/application/use-cases/auth/register.use-case';
import { LoginUseCase } from '@/application/use-cases/auth/login.use-case';
import { PostgreSQLUserRepository } from '@/infrastructure/repositories/postgres-user.repository';
import { createUserSchema } from '@/application/dto/create-user.dto';
import { loginSchema } from '@/application/dto/login.dto';
import { ValidationError } from '@/shared/errors/validation-error';

const authRoutes = new Hono();

const userRepository = new PostgreSQLUserRepository();
const registerUseCase = new RegisterUseCase(userRepository);
const loginUseCase = new LoginUseCase(userRepository);

authRoutes.post('/register', async (c) => {
  try {
    const body = await c.req.json();
    const dto = createUserSchema.parse(body);
    const result = await registerUseCase.execute(dto);

    // Generate JWT token
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const expiresIn: string | number | undefined = process.env.JWT_EXPIRES_IN || '24h';
    const token = jwt.sign(
      { userId: result.user.id },
      secret,
      { expiresIn } as jwt.SignOptions
    );

    return c.json(
      {
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          createdAt: result.user.createdAt,
          updatedAt: result.user.updatedAt,
        },
        token,
      },
      201
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      throw new ValidationError('Validation failed', error.errors);
    }
    throw error;
  }
});

authRoutes.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const dto = loginSchema.parse(body);
    const result = await loginUseCase.execute(dto);

    // Generate JWT token
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const expiresIn: string | number | undefined = process.env.JWT_EXPIRES_IN || '24h';
    const token = jwt.sign(
      { userId: result.userId },
      secret,
      { expiresIn } as jwt.SignOptions
    );

    return c.json({
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

export { authRoutes };





