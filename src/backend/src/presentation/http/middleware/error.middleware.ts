import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { AppError } from '@/shared/errors/app-error';
import { logger } from '@/shared/logger';

export function errorHandler(
  error: FastifyError | AppError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof AppError) {
    logger.error('Application error', { error: error.message, code: error.code });
    return reply.status(error.statusCode).send({
      error: {
        code: error.code,
        message: error.message,
        ...(error instanceof Error && 'errors' in error && { errors: (error as any).errors }),
      },
    });
  }

  logger.error('Internal server error', { error: error.message, stack: error.stack });

  return reply.status(500).send({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
    },
  });
}





