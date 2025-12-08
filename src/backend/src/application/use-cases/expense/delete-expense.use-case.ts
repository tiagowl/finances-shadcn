import { IExpenseRepository } from '@/domain/repositories/expense.repository.interface';
import { NotFoundError } from '@/shared/errors/not-found-error';

export class DeleteExpenseUseCase {
  constructor(private expenseRepository: IExpenseRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    const expense = await this.expenseRepository.findById(id);

    if (!expense) {
      throw new NotFoundError('Expense');
    }

    if (expense.userId !== userId) {
      throw new NotFoundError('Expense');
    }

    await this.expenseRepository.delete(id);
  }
}





