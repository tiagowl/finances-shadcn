import { Context, StatusCode } from 'hono';
import { AppError } from '@/shared/errors/app-error';
import { logger } from '@/shared/logger';

export async function errorHandler(error: Error, c: Context) {
  if (error instanceof AppError) {
    logger.error('Application error', { error: error.message, code: error.code });
    return c.json(
      {
        error: {
          code: error.code,
          message: error.message,
          ...(error instanceof Error && 'errors' in error && { errors: (error as any).errors }),
        },
      },
      error.statusCode as StatusCode
    );
  }

  logger.error('Internal server error', { error: error.message, stack: error.stack });

  return c.json(
    {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      },
    },
    500 as StatusCode
  );
}





