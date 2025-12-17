import { Hono } from 'hono';
import { CreateRevenueUseCase } from '@/application/use-cases/revenue/create-revenue.use-case';
import { GetRevenuesUseCase } from '@/application/use-cases/revenue/get-revenues.use-case';
import { GetRevenueUseCase } from '@/application/use-cases/revenue/get-revenue.use-case';
import { UpdateRevenueUseCase } from '@/application/use-cases/revenue/update-revenue.use-case';
import { DeleteRevenueUseCase } from '@/application/use-cases/revenue/delete-revenue.use-case';
import { PostgreSQLRevenueRepository } from '@/infrastructure/repositories/postgres-revenue.repository';
import { createRevenueSchema } from '@/application/dto/create-revenue.dto';
import { authMiddleware, requireAuth } from '../middleware/auth.middleware';
import { ValidationError } from '@/shared/errors/validation-error';

// Helper function to format date as YYYY-MM-DD
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const revenueRoutes = new Hono();

const revenueRepository = new PostgreSQLRevenueRepository();
const createUseCase = new CreateRevenueUseCase(revenueRepository);
const getRevenuesUseCase = new GetRevenuesUseCase(revenueRepository);
const getRevenueUseCase = new GetRevenueUseCase(revenueRepository);
const updateUseCase = new UpdateRevenueUseCase(revenueRepository);
const deleteUseCase = new DeleteRevenueUseCase(revenueRepository);

revenueRoutes.post('/revenues', authMiddleware, requireAuth, async (c) => {
  try {
    const body = await c.req.json();
    const dto = createRevenueSchema.parse(body);
    const userId = c.get('userId');
    const revenue = await createUseCase.execute(dto, userId);

    return c.json(
      {
        id: revenue.id,
        userId: revenue.userId,
        name: revenue.name,
        amount: revenue.amount,
        date: formatDate(revenue.date),
        notes: revenue.notes,
        createdAt: revenue.createdAt,
        updatedAt: revenue.updatedAt,
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

revenueRoutes.get('/revenues', authMiddleware, requireAuth, async (c) => {
  const userId = c.get('userId');
  const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : undefined;
  const offset = c.req.query('offset') ? parseInt(c.req.query('offset')!) : undefined;

  const revenues = await getRevenuesUseCase.execute(userId, limit, offset);

  return c.json({
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

revenueRoutes.get('/revenues/:id', authMiddleware, requireAuth, async (c) => {
  const id = c.req.param('id');
  const userId = c.get('userId');
  const revenue = await getRevenueUseCase.execute(id, userId);

  return c.json({
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

revenueRoutes.put('/revenues/:id', authMiddleware, requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const dto = createRevenueSchema.parse(body);
    const userId = c.get('userId');
    const revenue = await updateUseCase.execute(id, dto, userId);

    return c.json({
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

revenueRoutes.delete('/revenues/:id', authMiddleware, requireAuth, async (c) => {
  const id = c.req.param('id');
  const userId = c.get('userId');
  await deleteUseCase.execute(id, userId);
  return c.body(null, 204);
});

export { revenueRoutes };

