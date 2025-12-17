import { Hono } from 'hono';
import { GetDashboardStatsUseCase } from '@/application/use-cases/dashboard/get-dashboard-stats.use-case';
import { PostgreSQLRevenueRepository } from '@/infrastructure/repositories/postgres-revenue.repository';
import { PostgreSQLExpenseRepository } from '@/infrastructure/repositories/postgres-expense.repository';
import { authMiddleware, requireAuth } from '../middleware/auth.middleware';

// Helper function to format date as YYYY-MM-DD
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const dashboardRoutes = new Hono();

const revenueRepository = new PostgreSQLRevenueRepository();
const expenseRepository = new PostgreSQLExpenseRepository();
const getDashboardStatsUseCase = new GetDashboardStatsUseCase(revenueRepository, expenseRepository);

dashboardRoutes.get('/dashboard/stats', authMiddleware, requireAuth, async (c) => {
  const userId = c.get('userId');
  const stats = await getDashboardStatsUseCase.execute(userId);

  return c.json({
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

export { dashboardRoutes };

