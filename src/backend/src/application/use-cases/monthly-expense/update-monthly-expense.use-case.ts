import { IMonthlyExpenseRepository } from '@/domain/repositories/monthly-expense.repository.interface';
import { MonthlyExpense } from '@/domain/entities/monthly-expense.entity';
import { CreateMonthlyExpenseDTO } from '@/application/dto/create-monthly-expense.dto';
import { NotFoundError } from '@/shared/errors/not-found-error';

export class UpdateMonthlyExpenseUseCase {
  constructor(private monthlyExpenseRepository: IMonthlyExpenseRepository) {}

  async execute(id: string, dto: CreateMonthlyExpenseDTO, userId: string): Promise<MonthlyExpense> {
    const existing = await this.monthlyExpenseRepository.findById(id);

    if (!existing) {
      throw new NotFoundError('MonthlyExpense');
    }

    if (existing.userId !== userId) {
      throw new NotFoundError('MonthlyExpense');
    }

    const updated = new MonthlyExpense(
      existing.id,
      existing.userId,
      dto.name,
      dto.amount,
      dto.dayOfMonth,
      dto.cancellationLink || null,
      existing.createdAt,
      new Date()
    );

    return await this.monthlyExpenseRepository.update(updated);
  }
}





