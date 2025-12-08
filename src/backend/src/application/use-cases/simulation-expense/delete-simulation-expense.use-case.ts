import { ISimulationExpenseRepository } from '@/domain/repositories/simulation-expense.repository.interface';
import { NotFoundError } from '@/shared/errors/not-found-error';

export class DeleteSimulationExpenseUseCase {
  constructor(private repository: ISimulationExpenseRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    const expense = await this.repository.findById(id);

    if (!expense) {
      throw new NotFoundError('SimulationExpense');
    }

    if (expense.userId !== userId) {
      throw new NotFoundError('SimulationExpense');
    }

    await this.repository.delete(id);
  }
}





