import { FastifyInstance } from 'fastify';
import { CreateMonthlyRevenueUseCase } from '@/application/use-cases/monthly-revenue/create-monthly-revenue.use-case';
import { GetMonthlyRevenuesUseCase } from '@/application/use-cases/monthly-revenue/get-monthly-revenues.use-case';
import { UpdateMonthlyRevenueUseCase } from '@/application/use-cases/monthly-revenue/update-monthly-revenue.use-case';
import { DeleteMonthlyRevenueUseCase } from '@/application/use-cases/monthly-revenue/delete-monthly-revenue.use-case';
import { PostgreSQLMonthlyRevenueRepository } from '@/infrastructure/repositories/postgres-monthly-revenue.repository';
import { createMonthlyRevenueSchema } from '@/application/dto/create-monthly-revenue.dto';
import { authMiddleware } from '../middleware/auth.middleware';
import { ValidationError } from '@/shared/errors/validation-error';

export async function monthlyRevenueRoutes(fastify: FastifyInstance) {
  const repository = new PostgreSQLMonthlyRevenueRepository();
  const createUseCase = new CreateMonthlyRevenueUseCase(repository);
  const getUseCase = new GetMonthlyRevenuesUseCase(repository);
  const updateUseCase = new UpdateMonthlyRevenueUseCase(repository);
  const deleteUseCase = new DeleteMonthlyRevenueUseCase(repository);

  fastify.post('/monthly-revenues', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const dto = createMonthlyRevenueSchema.parse(request.body);
      const monthlyRevenue = await createUseCase.execute(dto, request.userId!);

      return reply.status(201).send({
        id: monthlyRevenue.id,
        userId: monthlyRevenue.userId,
        name: monthlyRevenue.name,
        amount: monthlyRevenue.amount,
        dayOfMonth: monthlyRevenue.dayOfMonth,
        createdAt: monthlyRevenue.createdAt,
        updatedAt: monthlyRevenue.updatedAt,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new ValidationError('Validation failed', error.errors);
      }
      throw error;
    }
  });

  fastify.get('/monthly-revenues', { preHandler: [authMiddleware] }, async (request, reply) => {
    const monthlyRevenues = await getUseCase.execute(request.userId!);

    return reply.send({
      data: monthlyRevenues.map((r) => ({
        id: r.id,
        userId: r.userId,
        name: r.name,
        amount: r.amount,
        dayOfMonth: r.dayOfMonth,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      })),
    });
  });

  fastify.put('/monthly-revenues/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const dto = createMonthlyRevenueSchema.parse(request.body);
      const monthlyRevenue = await updateUseCase.execute(params.id, dto, request.userId!);

      return reply.send({
        id: monthlyRevenue.id,
        userId: monthlyRevenue.userId,
        name: monthlyRevenue.name,
        amount: monthlyRevenue.amount,
        dayOfMonth: monthlyRevenue.dayOfMonth,
        createdAt: monthlyRevenue.createdAt,
        updatedAt: monthlyRevenue.updatedAt,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new ValidationError('Validation failed', error.errors);
      }
      throw error;
    }
  });

  fastify.delete('/monthly-revenues/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    const params = request.params as { id: string };
    await deleteUseCase.execute(params.id, request.userId!);
    return reply.status(204).send();
  });
}





