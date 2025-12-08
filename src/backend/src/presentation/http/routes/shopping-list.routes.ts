import { FastifyInstance } from 'fastify';
import { CreateShoppingListItemUseCase } from '@/application/use-cases/shopping-list-item/create-shopping-list-item.use-case';
import { GetShoppingListItemsUseCase } from '@/application/use-cases/shopping-list-item/get-shopping-list-items.use-case';
import { GetShoppingListStatsUseCase } from '@/application/use-cases/shopping-list-item/get-shopping-list-stats.use-case';
import { UpdateShoppingListItemUseCase } from '@/application/use-cases/shopping-list-item/update-shopping-list-item.use-case';
import { ToggleShoppingListItemUseCase } from '@/application/use-cases/shopping-list-item/toggle-shopping-list-item.use-case';
import { DeleteShoppingListItemUseCase } from '@/application/use-cases/shopping-list-item/delete-shopping-list-item.use-case';
import { ClearShoppingListUseCase } from '@/application/use-cases/shopping-list-item/clear-shopping-list.use-case';
import { PostgreSQLShoppingListItemRepository } from '@/infrastructure/repositories/postgres-shopping-list-item.repository';
import { createShoppingListItemSchema } from '@/application/dto/create-shopping-list-item.dto';
import { authMiddleware } from '../middleware/auth.middleware';
import { ValidationError } from '@/shared/errors/validation-error';

export async function shoppingListRoutes(fastify: FastifyInstance) {
  const repository = new PostgreSQLShoppingListItemRepository();
  const createUseCase = new CreateShoppingListItemUseCase(repository);
  const getUseCase = new GetShoppingListItemsUseCase(repository);
  const getStatsUseCase = new GetShoppingListStatsUseCase(repository);
  const updateUseCase = new UpdateShoppingListItemUseCase(repository);
  const toggleUseCase = new ToggleShoppingListItemUseCase(repository);
  const deleteUseCase = new DeleteShoppingListItemUseCase(repository);
  const clearUseCase = new ClearShoppingListUseCase(repository);

  fastify.post('/shopping-list', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const dto = createShoppingListItemSchema.parse(request.body);
      const item = await createUseCase.execute(dto, request.userId!);

      return reply.status(201).send({
        id: item.id,
        userId: item.userId,
        name: item.name,
        price: item.price,
        isPurchased: item.isPurchased,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new ValidationError('Validation failed', error.errors);
      }
      throw error;
    }
  });

  fastify.get('/shopping-list', { preHandler: [authMiddleware] }, async (request, reply) => {
    const items = await getUseCase.execute(request.userId!);

    return reply.send({
      data: items.map((item) => ({
        id: item.id,
        userId: item.userId,
        name: item.name,
        price: item.price,
        isPurchased: item.isPurchased,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    });
  });

  fastify.get('/shopping-list/stats', { preHandler: [authMiddleware] }, async (request, reply) => {
    const stats = await getStatsUseCase.execute(request.userId!);

    return reply.send(stats);
  });

  fastify.put('/shopping-list/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const dto = createShoppingListItemSchema.parse(request.body);
      const item = await updateUseCase.execute(params.id, dto, request.userId!);

      return reply.send({
        id: item.id,
        userId: item.userId,
        name: item.name,
        price: item.price,
        isPurchased: item.isPurchased,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new ValidationError('Validation failed', error.errors);
      }
      throw error;
    }
  });

  fastify.patch('/shopping-list/:id/toggle', { preHandler: [authMiddleware] }, async (request, reply) => {
    const params = request.params as { id: string };
    const item = await toggleUseCase.execute(params.id, request.userId!);

    return reply.send({
      id: item.id,
      userId: item.userId,
      name: item.name,
      price: item.price,
      isPurchased: item.isPurchased,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    });
  });

  fastify.delete('/shopping-list/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    const params = request.params as { id: string };
    await deleteUseCase.execute(params.id, request.userId!);
    return reply.status(204).send();
  });

  fastify.delete('/shopping-list', { preHandler: [authMiddleware] }, async (request, reply) => {
    await clearUseCase.execute(request.userId!);
    return reply.status(204).send();
  });
}





