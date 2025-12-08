import { FastifyRequest, FastifyReply } from 'fastify';
import { UnauthorizedError } from '@/shared/errors/unauthorized-error';

declare module 'fastify' {
  interface FastifyRequest {
    userId?: string;
  }
}

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
    const payload = request.user as { userId: string };
    request.userId = payload.userId;
  } catch (error) {
    throw new UnauthorizedError('Invalid or missing token');
  }
}





