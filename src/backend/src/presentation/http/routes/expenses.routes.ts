import { Hono } from 'hono';
import { CreateExpenseUseCase } from '@/application/use-cases/expense/create-expense.use-case';
import { UpdateExpenseUseCase } from '@/application/use-cases/expense/update-expense.use-case';
import { DeleteExpenseUseCase } from '@/application/use-cases/expense/delete-expense.use-case';
import { PostgreSQLExpenseRepository } from '@/infrastructure/repositories/postgres-expense.repository';
import { PostgreSQLCategoryRepository } from '@/infrastructure/repositories/postgres-category.repository';
import { createExpenseSchema } from '@/application/dto/create-expense.dto';
import { authMiddleware } from '../middleware/auth.middleware';
import { ValidationError } from '@/shared/errors/validation-error';

// Helper function to format date as YYYY-MM-DD
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const expenseRoutes = new Hono();

const expenseRepository = new PostgreSQLExpenseRepository();
const categoryRepository = new PostgreSQLCategoryRepository();
const createUseCase = new CreateExpenseUseCase(expenseRepository, categoryRepository);
const updateUseCase = new UpdateExpenseUseCase(expenseRepository, categoryRepository);
const deleteUseCase = new DeleteExpenseUseCase(expenseRepository);

expenseRoutes.post('/expenses', authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const dto = createExpenseSchema.parse(body);
    const userId = c.get('userId');
    const expense = await createUseCase.execute(dto, userId);

    return c.json(
      {
        id: expense.id,
        userId: expense.userId,
        categoryId: expense.categoryId,
        name: expense.name,
        amount: expense.amount,
        date: formatDate(expense.date),
        notes: expense.notes,
        createdAt: expense.createdAt,
        updatedAt: expense.updatedAt,
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

expenseRoutes.get('/expenses', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : undefined;
  const offset = c.req.query('offset') ? parseInt(c.req.query('offset')!) : undefined;

  const expenses = await expenseRepository.findByUserId(userId, limit, offset);

  return c.json({
    data: expenses.map((e) => ({
      id: e.id,
      userId: e.userId,
      categoryId: e.categoryId,
      name: e.name,
      amount: e.amount,
      date: formatDate(e.date),
      notes: e.notes,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    })),
  });
});

expenseRoutes.put('/expenses/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const dto = createExpenseSchema.parse(body);
    const userId = c.get('userId');
    const expense = await updateUseCase.execute(id, dto, userId);

    return c.json({
      id: expense.id,
      userId: expense.userId,
      categoryId: expense.categoryId,
      name: expense.name,
      amount: expense.amount,
      date: formatDate(expense.date),
      notes: expense.notes,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      throw new ValidationError('Validation failed', error.errors);
    }
    throw error;
  }
});

expenseRoutes.delete('/expenses/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');
  const userId = c.get('userId');
  await deleteUseCase.execute(id, userId);
  return c.body(null, 204);
});

export { expenseRoutes };

