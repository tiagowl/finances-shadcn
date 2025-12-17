import { Hono } from 'hono';
import { CreateCategoryUseCase } from '@/application/use-cases/category/create-category.use-case';
import { UpdateCategoryUseCase } from '@/application/use-cases/category/update-category.use-case';
import { DeleteCategoryUseCase } from '@/application/use-cases/category/delete-category.use-case';
import { PostgreSQLCategoryRepository } from '@/infrastructure/repositories/postgres-category.repository';
import { PostgreSQLExpenseRepository } from '@/infrastructure/repositories/postgres-expense.repository';
import { createCategorySchema } from '@/application/dto/create-category.dto';
import { authMiddleware } from '../middleware/auth.middleware';
import { ValidationError } from '@/shared/errors/validation-error';

const categoryRoutes = new Hono();

const categoryRepository = new PostgreSQLCategoryRepository();
const expenseRepository = new PostgreSQLExpenseRepository();
const createUseCase = new CreateCategoryUseCase(categoryRepository);
const updateUseCase = new UpdateCategoryUseCase(categoryRepository);
const deleteUseCase = new DeleteCategoryUseCase(categoryRepository, expenseRepository);

categoryRoutes.post('/categories', authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const dto = createCategorySchema.parse(body);
    const userId = c.get('userId');
    const category = await createUseCase.execute(dto, userId);

    return c.json(
      {
        id: category.id,
        userId: category.userId,
        name: category.name,
        budgetMax: category.budgetMax,
        color: category.color,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
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

categoryRoutes.get('/categories', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const categories = await categoryRepository.findByUserId(userId);

  // Get total spent for each category
  const categoriesWithStats = await Promise.all(
    categories.map(async (category) => {
      const totalSpent = await expenseRepository.getTotalByCategoryId(category.id);
      const remaining = category.budgetMax - totalSpent;

      return {
        id: category.id,
        userId: category.userId,
        name: category.name,
        budgetMax: category.budgetMax,
        totalSpent,
        remaining,
        color: category.color,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      };
    })
  );

  // Calculate total statistics
  const totalBudgetMax = categoriesWithStats.reduce((sum, cat) => sum + cat.budgetMax, 0);
  const totalSpent = categoriesWithStats.reduce((sum, cat) => sum + cat.totalSpent, 0);

  return c.json({
    data: categoriesWithStats,
    stats: {
      totalBudgetMax,
      totalSpent,
    },
  });
});

categoryRoutes.put('/categories/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const dto = createCategorySchema.parse(body);
    const userId = c.get('userId');
    const category = await updateUseCase.execute(id, dto, userId);

    return c.json({
      id: category.id,
      userId: category.userId,
      name: category.name,
      budgetMax: category.budgetMax,
      color: category.color,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      throw new ValidationError('Validation failed', error.errors);
    }
    throw error;
  }
});

categoryRoutes.delete('/categories/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const userId = c.get('userId');
    await deleteUseCase.execute(id, userId);
    return c.body(null, 204);
  } catch (error: any) {
    // Re-throw known errors (NotFoundError, etc.)
    if (error.name === 'NotFoundError' || error.statusCode) {
      throw error;
    }
    // Handle database constraint errors
    if (error.code === '23503' || error.message?.includes('foreign key')) {
      throw new ValidationError('Cannot delete category. It is associated with existing expenses.');
    }
    throw error;
  }
});

export { categoryRoutes };

