import { IMonthlyExpenseRepository } from '@/domain/repositories/monthly-expense.repository.interface';
import { NotFoundError } from '@/shared/errors/not-found-error';

export class DeleteMonthlyExpenseUseCase {
  constructor(private monthlyExpenseRepository: IMonthlyExpenseRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    const monthlyExpense = await this.monthlyExpenseRepository.findById(id);

    if (!monthlyExpense) {
      throw new NotFoundError('MonthlyExpense');
    }

    if (monthlyExpense.userId !== userId) {
      throw new NotFoundError('MonthlyExpense');
    }

    await this.monthlyExpenseRepository.delete(id);
  }
}





