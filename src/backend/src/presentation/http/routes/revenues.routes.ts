import { FastifyInstance } from 'fastify';
import { CreateRevenueUseCase } from '@/application/use-cases/revenue/create-revenue.use-case';
import { GetRevenuesUseCase } from '@/application/use-cases/revenue/get-revenues.use-case';
import { GetRevenueUseCase } from '@/application/use-cases/revenue/get-revenue.use-case';
import { UpdateRevenueUseCase } from '@/application/use-cases/revenue/update-revenue.use-case';
import { DeleteRevenueUseCase } from '@/application/use-cases/revenue/delete-revenue.use-case';
import { PostgreSQLRevenueRepository } from '@/infrastructure/repositories/postgres-revenue.repository';
import { createRevenueSchema } from '@/application/dto/create-revenue.dto';
import { authMiddleware } from '../middleware/auth.middleware';
import { ValidationError } from '@/shared/errors/validation-error';

// Helper function to format date as YYYY-MM-DD
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function revenueRoutes(fastify: FastifyInstance) {
  const revenueRepository = new PostgreSQLRevenueRepository();
  const createUseCase = new CreateRevenueUseCase(revenueRepository);
  const getRevenuesUseCase = new GetRevenuesUseCase(revenueRepository);
  const getRevenueUseCase = new GetRevenueUseCase(revenueRepository);
  const updateUseCase = new UpdateRevenueUseCase(revenueRepository);
  const deleteUseCase = new DeleteRevenueUseCase(revenueRepository);

  fastify.post('/revenues', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const dto = createRevenueSchema.parse(request.body);
      const revenue = await createUseCase.execute(dto, request.userId!);

      return reply.status(201).send({
        id: revenue.id,
        userId: revenue.userId,
        name: revenue.name,
        amount: revenue.amount,
        date: formatDate(revenue.date),
        notes: revenue.notes,
        createdAt: revenue.createdAt,
        updatedAt: revenue.updatedAt,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new ValidationError('Validation failed', error.errors);
      }
      throw error;
    }
  });

  fastify.get('/revenues', { preHandler: [authMiddleware] }, async (request, reply) => {
    const query = request.query as { limit?: string; offset?: string };
    const limit = query.limit ? parseInt(query.limit) : undefined;
    const offset = query.offset ? parseInt(query.offset) : undefined;

    const revenues = await getRevenuesUseCase.execute(request.userId!, limit, offset);

    return reply.send({
      data: revenues.map((r) => ({
        id: r.id,
        userId: r.userId,
        name: r.name,
        amount: r.amount,
        date: formatDate(r.date),
        notes: r.notes,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      })),
    });
  });

  fastify.get('/revenues/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    const params = request.params as { id: string };
    const revenue = await getRevenueUseCase.execute(params.id, request.userId!);

    return reply.send({
      id: revenue.id,
      userId: revenue.userId,
      name: revenue.name,
      amount: revenue.amount,
      date: formatDate(revenue.date),
      notes: revenue.notes,
      createdAt: revenue.createdAt,
      updatedAt: revenue.updatedAt,
    });
  });

  fastify.put('/revenues/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const dto = createRevenueSchema.parse(request.body);
      const revenue = await updateUseCase.execute(params.id, dto, request.userId!);

      return reply.send({
        id: revenue.id,
        userId: revenue.userId,
        name: revenue.name,
        amount: revenue.amount,
        date: formatDate(revenue.date),
        notes: revenue.notes,
        createdAt: revenue.createdAt,
        updatedAt: revenue.updatedAt,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new ValidationError('Validation failed', error.errors);
      }
      throw error;
    }
  });

  fastify.delete('/revenues/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    const params = request.params as { id: string };
    await deleteUseCase.execute(params.id, request.userId!);
    return reply.status(204).send();
  });
}

