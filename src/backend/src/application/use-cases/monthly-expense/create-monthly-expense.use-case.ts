import { IMonthlyExpenseRepository } from '@/domain/repositories/monthly-expense.repository.interface';
import { MonthlyExpense } from '@/domain/entities/monthly-expense.entity';
import { CreateMonthlyExpenseDTO } from '@/application/dto/create-monthly-expense.dto';
import { generateUUID } from '@/shared/utils/uuid';

export class CreateMonthlyExpenseUseCase {
  constructor(private monthlyExpenseRepository: IMonthlyExpenseRepository) {}

  async execute(dto: CreateMonthlyExpenseDTO, userId: string): Promise<MonthlyExpense> {
    const now = new Date();
    const monthlyExpense = new MonthlyExpense(
      generateUUID(),
      userId,
      dto.name,
      dto.amount,
      dto.dayOfMonth,
      dto.cancellationLink || null,
      now,
      now
    );

    return await this.monthlyExpenseRepository.create(monthlyExpense);
  }
}





