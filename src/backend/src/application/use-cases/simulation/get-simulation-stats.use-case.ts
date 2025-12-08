import { ISimulationExpenseRepository } from '@/domain/repositories/simulation-expense.repository.interface';
import { ISimulationRevenueRepository } from '@/domain/repositories/simulation-revenue.repository.interface';
import { ISimulationCreditPurchaseRepository } from '@/domain/repositories/simulation-credit-purchase.repository.interface';

export interface SimulationStats {
  totalRevenue: number;
  totalCreditSpent: number;
  totalExpense: number;
  averageBalance: number;
}

export class GetSimulationStatsUseCase {
  constructor(
    private expenseRepository: ISimulationExpenseRepository,
    private revenueRepository: ISimulationRevenueRepository,
    private creditPurchaseRepository: ISimulationCreditPurchaseRepository
  ) {}

  async execute(userId: string): Promise<SimulationStats> {
    const totalRevenue = await this.revenueRepository.getTotalByUserId(userId);
    const totalExpense = await this.expenseRepository.getTotalByUserId(userId);
    const totalCreditSpent = await this.creditPurchaseRepository.getTotalByUserId(userId);
    const balance = totalRevenue - totalExpense - totalCreditSpent;

    return {
      totalRevenue,
      totalCreditSpent,
      totalExpense,
      averageBalance: balance,
    };
  }
}





