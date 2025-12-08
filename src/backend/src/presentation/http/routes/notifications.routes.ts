import { FastifyInstance } from 'fastify';
import { PostgreSQLCategoryRepository } from '@/infrastructure/repositories/postgres-category.repository';
import { PostgreSQLExpenseRepository } from '@/infrastructure/repositories/postgres-expense.repository';
import { PostgreSQLMonthlyExpenseRepository } from '@/infrastructure/repositories/postgres-monthly-expense.repository';
import { authMiddleware } from '../middleware/auth.middleware';

export async function notificationRoutes(fastify: FastifyInstance) {
  const categoryRepository = new PostgreSQLCategoryRepository();
  const expenseRepository = new PostgreSQLExpenseRepository();
  const monthlyExpenseRepository = new PostgreSQLMonthlyExpenseRepository();

  fastify.get('/notifications', { preHandler: [authMiddleware] }, async (request, reply) => {
    const userId = request.userId!;
    const notifications: Array<{
      id: string;
      type: 'budget_warning' | 'budget_exceeded' | 'monthly_expense_coming';
      title: string;
      message: string;
      categoryId?: string;
      monthlyExpenseId?: string;
      severity: 'warning' | 'error' | 'info';
      createdAt: Date;
    }> = [];

    // Get all categories with expenses
    const categories = await categoryRepository.findByUserId(userId);
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    // Check category budgets
    for (const category of categories) {
      if (category.budgetMax > 0) {
        const totalSpent = await expenseRepository.getTotalByCategoryIdAndMonth(
          category.id,
          currentYear,
          currentMonth
        );
        const percentage = (totalSpent / category.budgetMax) * 100;

        // Budget exceeded
        if (totalSpent >= category.budgetMax) {
          notifications.push({
            id: `budget-exceeded-${category.id}`,
            type: 'budget_exceeded',
            title: 'Orçamento Excedido',
            message: `A categoria "${category.name}" excedeu o orçamento máximo de R$ ${category.budgetMax.toFixed(2)}. Total gasto: R$ ${totalSpent.toFixed(2)}`,
            categoryId: category.id,
            severity: 'error',
            createdAt: new Date(),
          });
        }
        // Budget warning (80% or more)
        else if (percentage >= 80) {
          notifications.push({
            id: `budget-warning-${category.id}`,
            type: 'budget_warning',
            title: 'Orçamento Próximo do Limite',
            message: `A categoria "${category.name}" está com ${percentage.toFixed(1)}% do orçamento utilizado (R$ ${totalSpent.toFixed(2)} de R$ ${category.budgetMax.toFixed(2)})`,
            categoryId: category.id,
            severity: 'warning',
            createdAt: new Date(),
          });
        }
      }
    }

    // Check monthly expenses
    const monthlyExpenses = await monthlyExpenseRepository.findByUserId(userId);
    const currentDay = today.getDate();
    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    for (const monthlyExpense of monthlyExpenses) {
      let targetDate = new Date(currentYear, currentMonth - 1, monthlyExpense.dayOfMonth);
      
      // Normalize target date (remove time)
      targetDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

      // If the day has passed this month, check next month
      if (targetDate < todayNormalized) {
        const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
        const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
        targetDate = new Date(nextYear, nextMonth - 1, monthlyExpense.dayOfMonth);
        
        // Handle months with fewer days (e.g., Feb 30 -> Feb 28/29)
        if (targetDate.getDate() !== monthlyExpense.dayOfMonth) {
          targetDate = new Date(nextYear, nextMonth, 0); // Last day of next month
        }
      }

      const daysUntil = Math.ceil((targetDate.getTime() - todayNormalized.getTime()) / (1000 * 60 * 60 * 24));

      // Notify if within 3 days
      if (daysUntil >= 0 && daysUntil <= 3) {
        const dayText = daysUntil === 0 ? 'hoje' : daysUntil === 1 ? 'amanhã' : `em ${daysUntil} dias`;
        notifications.push({
          id: `monthly-expense-${monthlyExpense.id}`,
          type: 'monthly_expense_coming',
          title: 'Despesa Mensal Próxima',
          message: `A despesa "${monthlyExpense.name}" (R$ ${monthlyExpense.amount.toFixed(2)}) vence ${dayText} (dia ${monthlyExpense.dayOfMonth})`,
          monthlyExpenseId: monthlyExpense.id,
          severity: daysUntil === 0 ? 'error' : 'warning',
          createdAt: new Date(),
        });
      }
    }

    // Sort by severity (error > warning > info) and then by date
    notifications.sort((a, b) => {
      const severityOrder = { error: 0, warning: 1, info: 2 };
      const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
      if (severityDiff !== 0) return severityDiff;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    return reply.send({
      data: notifications,
      count: notifications.length,
    });
  });
}

