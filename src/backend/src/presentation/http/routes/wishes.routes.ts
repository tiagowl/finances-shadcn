import { FastifyInstance } from 'fastify';
import { CreateWishUseCase } from '@/application/use-cases/wish/create-wish.use-case';
import { GetWishesUseCase } from '@/application/use-cases/wish/get-wishes.use-case';
import { UpdateWishUseCase } from '@/application/use-cases/wish/update-wish.use-case';
import { DeleteWishUseCase } from '@/application/use-cases/wish/delete-wish.use-case';
import { PurchaseWishUseCase } from '@/application/use-cases/wish/purchase-wish.use-case';
import { PostgreSQLWishRepository } from '@/infrastructure/repositories/postgres-wish.repository';
import { PostgreSQLCategoryRepository } from '@/infrastructure/repositories/postgres-category.repository';
import { PostgreSQLExpenseRepository } from '@/infrastructure/repositories/postgres-expense.repository';
import { createWishSchema } from '@/application/dto/create-wish.dto';
import { authMiddleware } from '../middleware/auth.middleware';
import { ValidationError } from '@/shared/errors/validation-error';
import { z } from 'zod';

const purchaseWishSchema = z.object({
  amount: z.number().positive().optional(),
  date: z.coerce.date().optional(),
});

export async function wishRoutes(fastify: FastifyInstance) {
  const repository = new PostgreSQLWishRepository();
  const categoryRepository = new PostgreSQLCategoryRepository();
  const expenseRepository = new PostgreSQLExpenseRepository();
  const createUseCase = new CreateWishUseCase(repository, categoryRepository);
  const getUseCase = new GetWishesUseCase(repository);
  const updateUseCase = new UpdateWishUseCase(repository, categoryRepository);
  const deleteUseCase = new DeleteWishUseCase(repository);
  const purchaseUseCase = new PurchaseWishUseCase(repository, expenseRepository, categoryRepository);

  fastify.post('/wishes', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const dto = createWishSchema.parse(request.body);
      const wish = await createUseCase.execute(dto, request.userId!);

      return reply.status(201).send({
        id: wish.id,
        userId: wish.userId,
        name: wish.name,
        purchaseLink: wish.purchaseLink,
        categoryId: wish.categoryId,
        amount: wish.amount,
        createdAt: wish.createdAt,
        updatedAt: wish.updatedAt,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new ValidationError('Validation failed', error.errors);
      }
      throw error;
    }
  });

  fastify.get('/wishes', { preHandler: [authMiddleware] }, async (request, reply) => {
    const wishes = await getUseCase.execute(request.userId!);

      return reply.send({
        data: wishes.map((w) => ({
          id: w.id,
          userId: w.userId,
          name: w.name,
          purchaseLink: w.purchaseLink,
          categoryId: w.categoryId,
          amount: w.amount,
          createdAt: w.createdAt,
          updatedAt: w.updatedAt,
        })),
      });
  });

  fastify.put('/wishes/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const dto = createWishSchema.parse(request.body);
      const wish = await updateUseCase.execute(params.id, dto, request.userId!);

      return reply.send({
        id: wish.id,
        userId: wish.userId,
        name: wish.name,
        purchaseLink: wish.purchaseLink,
        categoryId: wish.categoryId,
        amount: wish.amount,
        createdAt: wish.createdAt,
        updatedAt: wish.updatedAt,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new ValidationError('Validation failed', error.errors);
      }
      throw error;
    }
  });

  fastify.delete('/wishes/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    const params = request.params as { id: string };
    await deleteUseCase.execute(params.id, request.userId!);
    return reply.status(204).send();
  });

  fastify.post('/wishes/:id/purchase', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const body = purchaseWishSchema.parse(request.body || {});
      
      const result = await purchaseUseCase.execute(
        params.id,
        request.userId!,
        body.amount,
        body.date
      );

      return reply.status(201).send({
        expense: {
          id: result.expense.id,
          userId: result.expense.userId,
          categoryId: result.expense.categoryId,
          name: result.expense.name,
          amount: result.expense.amount,
          date: result.expense.date,
          notes: result.expense.notes,
          createdAt: result.expense.createdAt,
          updatedAt: result.expense.updatedAt,
        },
        budgetExceeded: result.budgetExceeded,
        remaining: result.remaining,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new ValidationError('Validation failed', error.errors);
      }
      throw error;
    }
  });
}



