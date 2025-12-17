import { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '@/shared/errors/unauthorized-error';

// Extend Hono context to include userId
declare module 'hono' {
  interface ContextVariableMap {
    userId: string;
  }
}

export async function authMiddleware(c: Context, next: Next) {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Invalid or missing token');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    
    const payload = jwt.verify(token, secret) as { userId: string };
    
    if (!payload || !payload.userId) {
      throw new UnauthorizedError('Invalid or missing token');
    }
    
    c.set('userId', payload.userId);
    await next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    throw new UnauthorizedError('Invalid or missing token');
  }
}






