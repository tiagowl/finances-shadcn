import { FastifyInstance } from 'fastify';
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

export async function simulationRoutes(fastify: FastifyInstance) {
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
  fastify.post('/simulation/expenses', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const dto = createSimulationExpenseSchema.parse(request.body);
      const expense = await createExpenseUseCase.execute(dto, request.userId!);

      return reply.status(201).send({
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

  fastify.get('/simulation/expenses', { preHandler: [authMiddleware] }, async (request, reply) => {
    const query = request.query as { year?: string; month?: string };
    const year = query.year ? parseInt(query.year) : undefined;
    const month = query.month ? parseInt(query.month) : undefined;

    const expenses = await getExpensesUseCase.execute(request.userId!, year, month);

    return reply.send({
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

  fastify.put('/simulation/expenses/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const dto = createSimulationExpenseSchema.parse(request.body);
      const expense = await updateExpenseUseCase.execute(params.id, dto, request.userId!);

      return reply.send({
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

  fastify.delete('/simulation/expenses/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    const params = request.params as { id: string };
    await deleteExpenseUseCase.execute(params.id, request.userId!);
    return reply.status(204).send();
  });

  // Simulation Revenues
  fastify.post('/simulation/revenues', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const dto = createSimulationRevenueSchema.parse(request.body);
      const revenue = await createRevenueUseCase.execute(dto, request.userId!);

      return reply.status(201).send({
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

  fastify.get('/simulation/revenues', { preHandler: [authMiddleware] }, async (request, reply) => {
    const query = request.query as { year?: string; month?: string };
    const year = query.year ? parseInt(query.year) : undefined;
    const month = query.month ? parseInt(query.month) : undefined;

    const revenues = await getRevenuesUseCase.execute(request.userId!, year, month);

    return reply.send({
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

  fastify.put('/simulation/revenues/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const dto = createSimulationRevenueSchema.parse(request.body);
      const revenue = await updateRevenueUseCase.execute(params.id, dto, request.userId!);

      return reply.send({
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

  fastify.delete('/simulation/revenues/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    const params = request.params as { id: string };
    await deleteRevenueUseCase.execute(params.id, request.userId!);
    return reply.status(204).send();
  });

  // Simulation Credit Purchases
  fastify.post('/simulation/credit-purchases', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const dto = createSimulationCreditPurchaseSchema.parse(request.body);
      const purchase = await createCreditPurchaseUseCase.execute(dto, request.userId!);

      return reply.status(201).send({
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

  fastify.get('/simulation/credit-purchases', { preHandler: [authMiddleware] }, async (request, reply) => {
    const purchases = await getCreditPurchasesUseCase.execute(request.userId!);

    return reply.send({
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

  fastify.put('/simulation/credit-purchases/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const dto = createSimulationCreditPurchaseSchema.parse(request.body);
      const purchase = await updateCreditPurchaseUseCase.execute(params.id, dto, request.userId!);

      return reply.send({
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

  fastify.delete('/simulation/credit-purchases/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    const params = request.params as { id: string };
    await deleteCreditPurchaseUseCase.execute(params.id, request.userId!);
    return reply.status(204).send();
  });

  // Simulation Stats
  fastify.get('/simulation/stats', { preHandler: [authMiddleware] }, async (request, reply) => {
    const stats = await getStatsUseCase.execute(request.userId!);

    return reply.send(stats);
  });

  // Simulation Projection
  fastify.get('/simulation/projection', { preHandler: [authMiddleware] }, async (request, reply) => {
    const query = request.query as { months?: string };
    const months = query.months ? parseInt(query.months) : 12;

    const projection = await getProjectionUseCase.execute(request.userId!, months);

    return reply.send({ data: projection });
  });

  // Get all expenses for simulation (regular + monthly)
  fastify.get('/simulation/all-expenses', { preHandler: [authMiddleware] }, async (request, reply) => {
    const [regularExpenses, monthlyExpenses, simulationExpenses] = await Promise.all([
      expenseRepo.findByUserId(request.userId!),
      monthlyExpenseRepo.findByUserId(request.userId!),
      simulationExpenseRepo.findByUserId(request.userId!),
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

    return reply.send({
      data: [...formattedRegularExpenses, ...formattedMonthlyExpenses, ...formattedSimulationExpenses],
    });
  });

  // Get all revenues for simulation (regular + monthly)
  fastify.get('/simulation/all-revenues', { preHandler: [authMiddleware] }, async (request, reply) => {
    const [regularRevenues, monthlyRevenues, simulationRevenues] = await Promise.all([
      revenueRepo.findByUserId(request.userId!),
      monthlyRevenueRepo.findByUserId(request.userId!),
      simulationRevenueRepo.findByUserId(request.userId!),
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

    return reply.send({
      data: [...formattedRegularRevenues, ...formattedMonthlyRevenues, ...formattedSimulationRevenues],
    });
  });
}





