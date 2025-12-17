import { Context } from 'hono';
import { AppError } from '@/shared/errors/app-error';
import { logger } from '@/shared/logger';

export async function errorHandler(error: Error, c: Context) {
  if (error instanceof AppError) {
    logger.error('Application error', { error: error.message, code: error.code });
    c.status(error.statusCode);
    return c.json({
      error: {
        code: error.code,
        message: error.message,
        ...(error instanceof Error && 'errors' in error && { errors: (error as any).errors }),
      },
    });
  }

  logger.error('Internal server error', { error: error.message, stack: error.stack });

  c.status(500);
  return c.json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
    },
  });
}





