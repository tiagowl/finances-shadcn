import { Hono } from 'hono';
import { CreateMonthlyRevenueUseCase } from '@/application/use-cases/monthly-revenue/create-monthly-revenue.use-case';
import { GetMonthlyRevenuesUseCase } from '@/application/use-cases/monthly-revenue/get-monthly-revenues.use-case';
import { UpdateMonthlyRevenueUseCase } from '@/application/use-cases/monthly-revenue/update-monthly-revenue.use-case';
import { DeleteMonthlyRevenueUseCase } from '@/application/use-cases/monthly-revenue/delete-monthly-revenue.use-case';
import { PostgreSQLMonthlyRevenueRepository } from '@/infrastructure/repositories/postgres-monthly-revenue.repository';
import { createMonthlyRevenueSchema } from '@/application/dto/create-monthly-revenue.dto';
import { authMiddleware, requireAuth } from '../middleware/auth.middleware';
import { ValidationError } from '@/shared/errors/validation-error';

const monthlyRevenueRoutes = new Hono();

const repository = new PostgreSQLMonthlyRevenueRepository();
const createUseCase = new CreateMonthlyRevenueUseCase(repository);
const getUseCase = new GetMonthlyRevenuesUseCase(repository);
const updateUseCase = new UpdateMonthlyRevenueUseCase(repository);
const deleteUseCase = new DeleteMonthlyRevenueUseCase(repository);

monthlyRevenueRoutes.post('/monthly-revenues', authMiddleware, requireAuth, async (c) => {
  try {
    const body = await c.req.json();
    const dto = createMonthlyRevenueSchema.parse(body);
    const userId = c.get('userId');
    const monthlyRevenue = await createUseCase.execute(dto, userId);

    return c.json(
      {
        id: monthlyRevenue.id,
        userId: monthlyRevenue.userId,
        name: monthlyRevenue.name,
        amount: monthlyRevenue.amount,
        dayOfMonth: monthlyRevenue.dayOfMonth,
        createdAt: monthlyRevenue.createdAt,
        updatedAt: monthlyRevenue.updatedAt,
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

monthlyRevenueRoutes.get('/monthly-revenues', authMiddleware, requireAuth, async (c) => {
  const userId = c.get('userId');
  const monthlyRevenues = await getUseCase.execute(userId);

  return c.json({
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

monthlyRevenueRoutes.put('/monthly-revenues/:id', authMiddleware, requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const dto = createMonthlyRevenueSchema.parse(body);
    const userId = c.get('userId');
    const monthlyRevenue = await updateUseCase.execute(id, dto, userId);

    return c.json({
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

monthlyRevenueRoutes.delete('/monthly-revenues/:id', authMiddleware, requireAuth, async (c) => {
  const id = c.req.param('id');
  const userId = c.get('userId');
  await deleteUseCase.execute(id, userId);
  return c.body(null, 204);
});

export { monthlyRevenueRoutes };





