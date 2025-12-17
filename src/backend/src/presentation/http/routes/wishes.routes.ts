import { Hono } from 'hono';
import { CreateWishUseCase } from '@/application/use-cases/wish/create-wish.use-case';
import { GetWishesUseCase } from '@/application/use-cases/wish/get-wishes.use-case';
import { UpdateWishUseCase } from '@/application/use-cases/wish/update-wish.use-case';
import { DeleteWishUseCase } from '@/application/use-cases/wish/delete-wish.use-case';
import { PurchaseWishUseCase } from '@/application/use-cases/wish/purchase-wish.use-case';
import { PostgreSQLWishRepository } from '@/infrastructure/repositories/postgres-wish.repository';
import { PostgreSQLCategoryRepository } from '@/infrastructure/repositories/postgres-category.repository';
import { PostgreSQLExpenseRepository } from '@/infrastructure/repositories/postgres-expense.repository';
import { createWishSchema } from '@/application/dto/create-wish.dto';
import { authMiddleware, requireAuth } from '../middleware/auth.middleware';
import { ValidationError } from '@/shared/errors/validation-error';
import { z } from 'zod';

const purchaseWishSchema = z.object({
  amount: z.number().positive().optional(),
  date: z.coerce.date().optional(),
});

const wishRoutes = new Hono();

const repository = new PostgreSQLWishRepository();
const categoryRepository = new PostgreSQLCategoryRepository();
const expenseRepository = new PostgreSQLExpenseRepository();
const createUseCase = new CreateWishUseCase(repository, categoryRepository);
const getUseCase = new GetWishesUseCase(repository);
const updateUseCase = new UpdateWishUseCase(repository, categoryRepository);
const deleteUseCase = new DeleteWishUseCase(repository);
const purchaseUseCase = new PurchaseWishUseCase(repository, expenseRepository, categoryRepository);

wishRoutes.post('/wishes', authMiddleware, requireAuth, async (c) => {
  try {
    const body = await c.req.json();
    const dto = createWishSchema.parse(body);
    const userId = c.get('userId');
    const wish = await createUseCase.execute(dto, userId);

    return c.json(
      {
        id: wish.id,
        userId: wish.userId,
        name: wish.name,
        purchaseLink: wish.purchaseLink,
        categoryId: wish.categoryId,
        amount: wish.amount,
        createdAt: wish.createdAt,
        updatedAt: wish.updatedAt,
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

wishRoutes.get('/wishes', authMiddleware, requireAuth, async (c) => {
  const userId = c.get('userId');
  const wishes = await getUseCase.execute(userId);

  return c.json({
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

wishRoutes.put('/wishes/:id', authMiddleware, requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const dto = createWishSchema.parse(body);
    const userId = c.get('userId');
    const wish = await updateUseCase.execute(id, dto, userId);

    return c.json({
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

wishRoutes.delete('/wishes/:id', authMiddleware, requireAuth, async (c) => {
  const id = c.req.param('id');
  const userId = c.get('userId');
  await deleteUseCase.execute(id, userId);
  return c.body(null, 204);
});

wishRoutes.post('/wishes/:id/purchase', authMiddleware, requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json().catch(() => ({}));
    const purchaseData = purchaseWishSchema.parse(body);
    const userId = c.get('userId');

    const result = await purchaseUseCase.execute(id, userId, purchaseData.amount, purchaseData.date);

    return c.json(
      {
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

export { wishRoutes };
