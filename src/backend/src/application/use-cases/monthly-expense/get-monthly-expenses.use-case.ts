import { IMonthlyExpenseRepository } from '@/domain/repositories/monthly-expense.repository.interface';
import { MonthlyExpense } from '@/domain/entities/monthly-expense.entity';

export class GetMonthlyExpensesUseCase {
  constructor(private monthlyExpenseRepository: IMonthlyExpenseRepository) {}

  async execute(userId: string): Promise<MonthlyExpense[]> {
    return await this.monthlyExpenseRepository.findByUserId(userId);
  }
}





