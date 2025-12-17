import { Hono } from 'hono';
import { CreateMonthlyExpenseUseCase } from '@/application/use-cases/monthly-expense/create-monthly-expense.use-case';
import { GetMonthlyExpensesUseCase } from '@/application/use-cases/monthly-expense/get-monthly-expenses.use-case';
import { UpdateMonthlyExpenseUseCase } from '@/application/use-cases/monthly-expense/update-monthly-expense.use-case';
import { DeleteMonthlyExpenseUseCase } from '@/application/use-cases/monthly-expense/delete-monthly-expense.use-case';
import { PostgreSQLMonthlyExpenseRepository } from '@/infrastructure/repositories/postgres-monthly-expense.repository';
import { createMonthlyExpenseSchema } from '@/application/dto/create-monthly-expense.dto';
import { authMiddleware } from '../middleware/auth.middleware';
import { ValidationError } from '@/shared/errors/validation-error';

const monthlyExpenseRoutes = new Hono();

const repository = new PostgreSQLMonthlyExpenseRepository();
const createUseCase = new CreateMonthlyExpenseUseCase(repository);
const getUseCase = new GetMonthlyExpensesUseCase(repository);
const updateUseCase = new UpdateMonthlyExpenseUseCase(repository);
const deleteUseCase = new DeleteMonthlyExpenseUseCase(repository);

monthlyExpenseRoutes.post('/monthly-expenses', authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const dto = createMonthlyExpenseSchema.parse(body);
    const userId = c.get('userId');
    const monthlyExpense = await createUseCase.execute(dto, userId);

    return c.json(
      {
        id: monthlyExpense.id,
        userId: monthlyExpense.userId,
        name: monthlyExpense.name,
        amount: monthlyExpense.amount,
        dayOfMonth: monthlyExpense.dayOfMonth,
        cancellationLink: monthlyExpense.cancellationLink,
        createdAt: monthlyExpense.createdAt,
        updatedAt: monthlyExpense.updatedAt,
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

monthlyExpenseRoutes.get('/monthly-expenses', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const monthlyExpenses = await getUseCase.execute(userId);

  return c.json({
    data: monthlyExpenses.map((e) => ({
      id: e.id,
      userId: e.userId,
      name: e.name,
      amount: e.amount,
      dayOfMonth: e.dayOfMonth,
      cancellationLink: e.cancellationLink,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    })),
  });
});

monthlyExpenseRoutes.put('/monthly-expenses/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const dto = createMonthlyExpenseSchema.parse(body);
    const userId = c.get('userId');
    const monthlyExpense = await updateUseCase.execute(id, dto, userId);

    return c.json({
      id: monthlyExpense.id,
      userId: monthlyExpense.userId,
      name: monthlyExpense.name,
      amount: monthlyExpense.amount,
      dayOfMonth: monthlyExpense.dayOfMonth,
      cancellationLink: monthlyExpense.cancellationLink,
      createdAt: monthlyExpense.createdAt,
      updatedAt: monthlyExpense.updatedAt,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      throw new ValidationError('Validation failed', error.errors);
    }
    throw error;
  }
});

monthlyExpenseRoutes.delete('/monthly-expenses/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');
  const userId = c.get('userId');
  await deleteUseCase.execute(id, userId);
  return c.body(null, 204);
});

export { monthlyExpenseRoutes };





