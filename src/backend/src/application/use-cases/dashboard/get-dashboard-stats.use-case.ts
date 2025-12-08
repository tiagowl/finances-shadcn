import { IRevenueRepository } from '@/domain/repositories/revenue.repository.interface';
import { IExpenseRepository } from '@/domain/repositories/expense.repository.interface';

export interface DashboardStats {
  totalRevenue: number;
  totalExpense: number;
  balance: number;
  recentTransactions: Array<{
    id: string;
    type: 'revenue' | 'expense';
    name: string;
    amount: number;
    date: Date;
  }>;
}

export class GetDashboardStatsUseCase {
  constructor(
    private revenueRepository: IRevenueRepository,
    private expenseRepository: IExpenseRepository
  ) {}

  async execute(userId: string): Promise<DashboardStats> {
    const [totalRevenue, totalExpense, recentRevenues, recentExpenses] = await Promise.all([
      this.revenueRepository.getTotalByUserId(userId),
      this.expenseRepository.getTotalByUserId(userId),
      this.revenueRepository.getRecentByUserId(userId, 5),
      this.expenseRepository.getRecentByUserId(userId, 5),
    ]);

    const recentTransactions = [
      ...recentRevenues.map((r) => ({
        id: r.id,
        type: 'revenue' as const,
        name: r.name,
        amount: r.amount,
        date: r.date,
      })),
      ...recentExpenses.map((e) => ({
        id: e.id,
        type: 'expense' as const,
        name: e.name,
        amount: e.amount,
        date: e.date,
      })),
    ]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10);

    return {
      totalRevenue,
      totalExpense,
      balance: totalRevenue - totalExpense,
      recentTransactions,
    };
  }
}





