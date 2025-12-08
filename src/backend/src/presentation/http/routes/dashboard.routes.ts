import { FastifyInstance } from 'fastify';
import { GetDashboardStatsUseCase } from '@/application/use-cases/dashboard/get-dashboard-stats.use-case';
import { PostgreSQLRevenueRepository } from '@/infrastructure/repositories/postgres-revenue.repository';
import { PostgreSQLExpenseRepository } from '@/infrastructure/repositories/postgres-expense.repository';
import { authMiddleware } from '../middleware/auth.middleware';

// Helper function to format date as YYYY-MM-DD
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function dashboardRoutes(fastify: FastifyInstance) {
  const revenueRepository = new PostgreSQLRevenueRepository();
  const expenseRepository = new PostgreSQLExpenseRepository();
  const getDashboardStatsUseCase = new GetDashboardStatsUseCase(revenueRepository, expenseRepository);

  fastify.get('/dashboard/stats', { preHandler: [authMiddleware] }, async (request, reply) => {
    const stats = await getDashboardStatsUseCase.execute(request.userId!);

    return reply.send({
      totalRevenue: stats.totalRevenue,
      totalExpense: stats.totalExpense,
      balance: stats.balance,
      recentTransactions: stats.recentTransactions.map((t) => ({
        id: t.id,
        type: t.type,
        name: t.name,
        amount: t.amount,
        date: formatDate(t.date),
      })),
    });
  });
}

