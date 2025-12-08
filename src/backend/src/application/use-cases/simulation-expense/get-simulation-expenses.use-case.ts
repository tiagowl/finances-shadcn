import { ISimulationExpenseRepository } from '@/domain/repositories/simulation-expense.repository.interface';
import { SimulationExpense } from '@/domain/entities/simulation-expense.entity';

export class GetSimulationExpensesUseCase {
  constructor(private repository: ISimulationExpenseRepository) {}

  async execute(userId: string, year?: number, month?: number): Promise<SimulationExpense[]> {
    if (year && month) {
      return await this.repository.findByUserIdAndMonth(userId, year, month);
    }
    return await this.repository.findByUserId(userId);
  }
}





