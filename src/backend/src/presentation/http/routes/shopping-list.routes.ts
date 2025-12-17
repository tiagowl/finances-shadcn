import { Hono } from 'hono';
import { CreateShoppingListItemUseCase } from '@/application/use-cases/shopping-list-item/create-shopping-list-item.use-case';
import { GetShoppingListItemsUseCase } from '@/application/use-cases/shopping-list-item/get-shopping-list-items.use-case';
import { GetShoppingListStatsUseCase } from '@/application/use-cases/shopping-list-item/get-shopping-list-stats.use-case';
import { UpdateShoppingListItemUseCase } from '@/application/use-cases/shopping-list-item/update-shopping-list-item.use-case';
import { ToggleShoppingListItemUseCase } from '@/application/use-cases/shopping-list-item/toggle-shopping-list-item.use-case';
import { DeleteShoppingListItemUseCase } from '@/application/use-cases/shopping-list-item/delete-shopping-list-item.use-case';
import { ClearShoppingListUseCase } from '@/application/use-cases/shopping-list-item/clear-shopping-list.use-case';
import { PostgreSQLShoppingListItemRepository } from '@/infrastructure/repositories/postgres-shopping-list-item.repository';
import { createShoppingListItemSchema } from '@/application/dto/create-shopping-list-item.dto';
import { authMiddleware, requireAuth } from '../middleware/auth.middleware';
import { ValidationError } from '@/shared/errors/validation-error';

const shoppingListRoutes = new Hono();

const repository = new PostgreSQLShoppingListItemRepository();
const createUseCase = new CreateShoppingListItemUseCase(repository);
const getUseCase = new GetShoppingListItemsUseCase(repository);
const getStatsUseCase = new GetShoppingListStatsUseCase(repository);
const updateUseCase = new UpdateShoppingListItemUseCase(repository);
const toggleUseCase = new ToggleShoppingListItemUseCase(repository);
const deleteUseCase = new DeleteShoppingListItemUseCase(repository);
const clearUseCase = new ClearShoppingListUseCase(repository);

shoppingListRoutes.post('/shopping-list', authMiddleware, requireAuth, async (c) => {
  try {
    const body = await c.req.json();
    const dto = createShoppingListItemSchema.parse(body);
    const userId = c.get('userId');
    const item = await createUseCase.execute(dto, userId);

    return c.json(
      {
        id: item.id,
        userId: item.userId,
        name: item.name,
        price: item.price,
        isPurchased: item.isPurchased,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
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

shoppingListRoutes.get('/shopping-list', authMiddleware, requireAuth, async (c) => {
  const userId = c.get('userId');
  const items = await getUseCase.execute(userId);

  return c.json({
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

shoppingListRoutes.get('/shopping-list/stats', authMiddleware, requireAuth, async (c) => {
  const userId = c.get('userId');
  const stats = await getStatsUseCase.execute(userId);

  return c.json(stats);
});

shoppingListRoutes.put('/shopping-list/:id', authMiddleware, requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const dto = createShoppingListItemSchema.parse(body);
    const userId = c.get('userId');
    const item = await updateUseCase.execute(id, dto, userId);

    return c.json({
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

shoppingListRoutes.patch('/shopping-list/:id/toggle', authMiddleware, requireAuth, async (c) => {
  const id = c.req.param('id');
  const userId = c.get('userId');
  const item = await toggleUseCase.execute(id, userId);

  return c.json({
    id: item.id,
    userId: item.userId,
    name: item.name,
    price: item.price,
    isPurchased: item.isPurchased,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  });
});

shoppingListRoutes.delete('/shopping-list/:id', authMiddleware, requireAuth, async (c) => {
  const id = c.req.param('id');
  const userId = c.get('userId');
  await deleteUseCase.execute(id, userId);
  return c.body(null, 204);
});

shoppingListRoutes.delete('/shopping-list', authMiddleware, requireAuth, async (c) => {
  const userId = c.get('userId');
  await clearUseCase.execute(userId);
  return c.body(null, 204);
});

export { shoppingListRoutes };
