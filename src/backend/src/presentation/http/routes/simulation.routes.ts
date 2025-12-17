import { Hono } from 'hono';
import { CreateSimulationExpenseUseCase } from '@/application/use-cases/simulation-expense/create-simulation-expense.use-case';
import { GetSimulationExpensesUseCase } from '@/application/use-cases/simulation-expense/get-simulation-expenses.use-case';
import { UpdateSimulationExpenseUseCase } from '@/application/use-cases/simulation-expense/update-simulation-expense.use-case';
import { DeleteSimulationExpenseUseCase } from '@/application/use-cases/simulation-expense/delete-simulation-expense.use-case';
import { CreateSimulationRevenueUseCase } from '@/application/use-cases/simulation-revenue/create-simulation-revenue.use-case';
import { GetSimulationRevenuesUseCase } from '@/application/use-cases/simulation-revenue/get-simulation-revenues.use-case';
import { UpdateSimulationRevenueUseCase } from '@/application/use-cases/simulation-revenue/update-simulation-revenue.use-case';
import { DeleteSimulationRevenueUseCase } from '@/application/use-cases/simulation-revenue/delete-simulation-revenue.use-case';
import { CreateSimulationCreditPurchaseUseCase } from '@/application/use-cases/simulation-credit-purchase/create-simulation-credit-purchase.use-case';
import { GetSimulationCreditPurchasesUseCase } from '@/application/use-cases/simulation-credit-purchase/get-simulation-credit-purchases.use-case';
import { UpdateSimulationCreditPurchaseUseCase } from '@/application/use-cases/simulation-credit-purchase/update-simulation-credit-purchase.use-case';
import { DeleteSimulationCreditPurchaseUseCase } from '@/application/use-cases/simulation-credit-purchase/delete-simulation-credit-purchase.use-case';
import { GetSimulationStatsUseCase } from '@/application/use-cases/simulation/get-simulation-stats.use-case';
import { GetSimulationProjectionUseCase } from '@/application/use-cases/simulation/get-simulation-projection.use-case';
import { PostgreSQLSimulationExpenseRepository } from '@/infrastructure/repositories/postgres-simulation-expense.repository';
import { PostgreSQLSimulationRevenueRepository } from '@/infrastructure/repositories/postgres-simulation-revenue.repository';
import { PostgreSQLSimulationCreditPurchaseRepository } from '@/infrastructure/repositories/postgres-simulation-credit-purchase.repository';
import { PostgreSQLExpenseRepository } from '@/infrastructure/repositories/postgres-expense.repository';
import { PostgreSQLRevenueRepository } from '@/infrastructure/repositories/postgres-revenue.repository';
import { PostgreSQLMonthlyExpenseRepository } from '@/infrastructure/repositories/postgres-monthly-expense.repository';
import { PostgreSQLMonthlyRevenueRepository } from '@/infrastructure/repositories/postgres-monthly-revenue.repository';
import { createSimulationExpenseSchema } from '@/application/dto/create-simulation-expense.dto';
import { createSimulationRevenueSchema } from '@/application/dto/create-simulation-revenue.dto';
import { createSimulationCreditPurchaseSchema } from '@/application/dto/create-simulation-credit-purchase.dto';
import { authMiddleware } from '../middleware/auth.middleware';
import { ValidationError } from '@/shared/errors/validation-error';

// Helper function to format date as YYYY-MM-DD
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const simulationRoutes = new Hono();

const simulationExpenseRepo = new PostgreSQLSimulationExpenseRepository();
const simulationRevenueRepo = new PostgreSQLSimulationRevenueRepository();
const creditPurchaseRepo = new PostgreSQLSimulationCreditPurchaseRepository();
const expenseRepo = new PostgreSQLExpenseRepository();
const revenueRepo = new PostgreSQLRevenueRepository();
const monthlyExpenseRepo = new PostgreSQLMonthlyExpenseRepository();
const monthlyRevenueRepo = new PostgreSQLMonthlyRevenueRepository();

const createExpenseUseCase = new CreateSimulationExpenseUseCase(simulationExpenseRepo);
const getExpensesUseCase = new GetSimulationExpensesUseCase(simulationExpenseRepo);
const updateExpenseUseCase = new UpdateSimulationExpenseUseCase(simulationExpenseRepo);
const deleteExpenseUseCase = new DeleteSimulationExpenseUseCase(simulationExpenseRepo);

const createRevenueUseCase = new CreateSimulationRevenueUseCase(simulationRevenueRepo);
const getRevenuesUseCase = new GetSimulationRevenuesUseCase(simulationRevenueRepo);
const updateRevenueUseCase = new UpdateSimulationRevenueUseCase(simulationRevenueRepo);
const deleteRevenueUseCase = new DeleteSimulationRevenueUseCase(simulationRevenueRepo);

const createCreditPurchaseUseCase = new CreateSimulationCreditPurchaseUseCase(creditPurchaseRepo);
const getCreditPurchasesUseCase = new GetSimulationCreditPurchasesUseCase(creditPurchaseRepo);
const updateCreditPurchaseUseCase = new UpdateSimulationCreditPurchaseUseCase(creditPurchaseRepo);
const deleteCreditPurchaseUseCase = new DeleteSimulationCreditPurchaseUseCase(creditPurchaseRepo);

const getStatsUseCase = new GetSimulationStatsUseCase(simulationExpenseRepo, simulationRevenueRepo, creditPurchaseRepo);
const getProjectionUseCase = new GetSimulationProjectionUseCase(
  simulationExpenseRepo,
  simulationRevenueRepo,
  creditPurchaseRepo,
  expenseRepo,
  revenueRepo,
  monthlyExpenseRepo,
  monthlyRevenueRepo
);

// Simulation Expenses
simulationRoutes.post('/simulation/expenses', authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const dto = createSimulationExpenseSchema.parse(body);
    const userId = c.get('userId');
    const expense = await createExpenseUseCase.execute(dto, userId);

    return c.json(
      {
        id: expense.id,
        userId: expense.userId,
        name: expense.name,
        amount: expense.amount,
        date: formatDate(expense.date),
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

simulationRoutes.get('/simulation/expenses', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const year = c.req.query('year') ? parseInt(c.req.query('year')!) : undefined;
  const month = c.req.query('month') ? parseInt(c.req.query('month')!) : undefined;

  const expenses = await getExpensesUseCase.execute(userId, year, month);

  return c.json({
    data: expenses.map((e) => ({
      id: e.id,
      userId: e.userId,
      name: e.name,
      amount: e.amount,
      date: formatDate(e.date),
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    })),
  });
});

simulationRoutes.put('/simulation/expenses/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const dto = createSimulationExpenseSchema.parse(body);
    const userId = c.get('userId');
    const expense = await updateExpenseUseCase.execute(id, dto, userId);

    return c.json({
      id: expense.id,
      userId: expense.userId,
      name: expense.name,
      amount: expense.amount,
      date: formatDate(expense.date),
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

simulationRoutes.delete('/simulation/expenses/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');
  const userId = c.get('userId');
  await deleteExpenseUseCase.execute(id, userId);
  return c.body(null, 204);
});

// Simulation Revenues
simulationRoutes.post('/simulation/revenues', authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const dto = createSimulationRevenueSchema.parse(body);
    const userId = c.get('userId');
    const revenue = await createRevenueUseCase.execute(dto, userId);

    return c.json(
      {
        id: revenue.id,
        userId: revenue.userId,
        name: revenue.name,
        amount: revenue.amount,
        date: formatDate(revenue.date),
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

simulationRoutes.get('/simulation/revenues', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const year = c.req.query('year') ? parseInt(c.req.query('year')!) : undefined;
  const month = c.req.query('month') ? parseInt(c.req.query('month')!) : undefined;

  const revenues = await getRevenuesUseCase.execute(userId, year, month);

  return c.json({
    data: revenues.map((r) => ({
      id: r.id,
      userId: r.userId,
      name: r.name,
      amount: r.amount,
      date: formatDate(r.date),
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    })),
  });
});

simulationRoutes.put('/simulation/revenues/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const dto = createSimulationRevenueSchema.parse(body);
    const userId = c.get('userId');
    const revenue = await updateRevenueUseCase.execute(id, dto, userId);

    return c.json({
      id: revenue.id,
      userId: revenue.userId,
      name: revenue.name,
      amount: revenue.amount,
      date: formatDate(revenue.date),
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

simulationRoutes.delete('/simulation/revenues/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');
  const userId = c.get('userId');
  await deleteRevenueUseCase.execute(id, userId);
  return c.body(null, 204);
});

// Simulation Credit Purchases
simulationRoutes.post('/simulation/credit-purchases', authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const dto = createSimulationCreditPurchaseSchema.parse(body);
    const userId = c.get('userId');
    const purchase = await createCreditPurchaseUseCase.execute(dto, userId);

    return c.json(
      {
        id: purchase.id,
        userId: purchase.userId,
        name: purchase.name,
        amount: purchase.amount,
        installments: purchase.installments,
        purchaseDate: formatDate(purchase.purchaseDate),
        createdAt: purchase.createdAt,
        updatedAt: purchase.updatedAt,
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

simulationRoutes.get('/simulation/credit-purchases', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const purchases = await getCreditPurchasesUseCase.execute(userId);

  return c.json({
    data: purchases.map((p) => ({
      id: p.id,
      userId: p.userId,
      name: p.name,
      amount: p.amount,
      installments: p.installments,
      purchaseDate: formatDate(p.purchaseDate),
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    })),
  });
});

simulationRoutes.put('/simulation/credit-purchases/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const dto = createSimulationCreditPurchaseSchema.parse(body);
    const userId = c.get('userId');
    const purchase = await updateCreditPurchaseUseCase.execute(id, dto, userId);

    return c.json({
      id: purchase.id,
      userId: purchase.userId,
      name: purchase.name,
      amount: purchase.amount,
      installments: purchase.installments,
      purchaseDate: formatDate(purchase.purchaseDate),
      createdAt: purchase.createdAt,
      updatedAt: purchase.updatedAt,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      throw new ValidationError('Validation failed', error.errors);
    }
    throw error;
  }
});

simulationRoutes.delete('/simulation/credit-purchases/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');
  const userId = c.get('userId');
  await deleteCreditPurchaseUseCase.execute(id, userId);
  return c.body(null, 204);
});

// Simulation Stats
simulationRoutes.get('/simulation/stats', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const stats = await getStatsUseCase.execute(userId);

  return c.json(stats);
});

// Simulation Projection
simulationRoutes.get('/simulation/projection', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const months = c.req.query('months') ? parseInt(c.req.query('months')!) : 12;

  const projection = await getProjectionUseCase.execute(userId, months);

  return c.json({ data: projection });
});

// Get all expenses for simulation (regular + monthly)
simulationRoutes.get('/simulation/all-expenses', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const [regularExpenses, monthlyExpenses, simulationExpenses] = await Promise.all([
    expenseRepo.findByUserId(userId),
    monthlyExpenseRepo.findByUserId(userId),
    simulationExpenseRepo.findByUserId(userId),
  ]);

  // Format regular expenses
  const formattedRegularExpenses = regularExpenses.map((e) => ({
    id: e.id,
    type: 'expense' as const,
    name: e.name,
    amount: e.amount,
    date: formatDate(e.date),
    isMonthly: false,
    isSimulation: false,
  }));

  // Format monthly expenses (show once as they are recurring)
  const today = new Date();
  const formattedMonthlyExpenses = monthlyExpenses.map((me) => {
    const expenseDate = new Date(today.getFullYear(), today.getMonth(), Math.min(me.dayOfMonth, new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()));
    return {
      id: me.id,
      type: 'expense' as const,
      name: me.name,
      amount: me.amount,
      date: formatDate(expenseDate),
      isMonthly: true,
      isSimulation: false,
    };
  });

  // Format simulation expenses
  const formattedSimulationExpenses = simulationExpenses.map((e) => ({
    id: e.id,
    type: 'expense' as const,
    name: e.name,
    amount: e.amount,
    date: formatDate(e.date),
    isMonthly: false,
    isSimulation: true,
  }));

  return c.json({
    data: [...formattedRegularExpenses, ...formattedMonthlyExpenses, ...formattedSimulationExpenses],
  });
});

// Get all revenues for simulation (regular + monthly)
simulationRoutes.get('/simulation/all-revenues', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const [regularRevenues, monthlyRevenues, simulationRevenues] = await Promise.all([
    revenueRepo.findByUserId(userId),
    monthlyRevenueRepo.findByUserId(userId),
    simulationRevenueRepo.findByUserId(userId),
  ]);

  // Format regular revenues
  const formattedRegularRevenues = regularRevenues.map((r) => ({
    id: r.id,
    type: 'revenue' as const,
    name: r.name,
    amount: r.amount,
    date: formatDate(r.date),
    isMonthly: false,
    isSimulation: false,
  }));

  // Format monthly revenues (show once as they are recurring)
  const today = new Date();
  const formattedMonthlyRevenues = monthlyRevenues.map((mr) => {
    const revenueDate = new Date(today.getFullYear(), today.getMonth(), Math.min(mr.dayOfMonth, new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()));
    return {
      id: mr.id,
      type: 'revenue' as const,
      name: mr.name,
      amount: mr.amount,
      date: formatDate(revenueDate),
      isMonthly: true,
      isSimulation: false,
    };
  });

  // Format simulation revenues
  const formattedSimulationRevenues = simulationRevenues.map((r) => ({
    id: r.id,
    type: 'revenue' as const,
    name: r.name,
    amount: r.amount,
    date: formatDate(r.date),
    isMonthly: false,
    isSimulation: true,
  }));

  return c.json({
    data: [...formattedRegularRevenues, ...formattedMonthlyRevenues, ...formattedSimulationRevenues],
  });
});

export { simulationRoutes };
