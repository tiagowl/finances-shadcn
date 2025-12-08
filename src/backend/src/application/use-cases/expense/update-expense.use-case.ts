import { IExpenseRepository } from '@/domain/repositories/expense.repository.interface';
import { ICategoryRepository } from '@/domain/repositories/category.repository.interface';
import { Expense } from '@/domain/entities/expense.entity';
import { CreateExpenseDTO } from '@/application/dto/create-expense.dto';
import { NotFoundError } from '@/shared/errors/not-found-error';

export class UpdateExpenseUseCase {
  constructor(
    private expenseRepository: IExpenseRepository,
    private categoryRepository: ICategoryRepository
  ) {}

  async execute(id: string, dto: CreateExpenseDTO, userId: string): Promise<Expense> {
    const existingExpense = await this.expenseRepository.findById(id);

    if (!existingExpense) {
      throw new NotFoundError('Expense');
    }

    if (existingExpense.userId !== userId) {
      throw new NotFoundError('Expense');
    }

    // Verify category exists and belongs to user if categoryId is provided
    if (dto.categoryId) {
      const category = await this.categoryRepository.findById(dto.categoryId);
      if (!category || category.userId !== userId) {
        throw new NotFoundError('Category');
      }
    }

    const updatedExpense = new Expense(
      existingExpense.id,
      existingExpense.userId,
      dto.categoryId || null,
      dto.name,
      dto.amount,
      dto.date,
      dto.notes,
      existingExpense.createdAt,
      new Date()
    );

    return await this.expenseRepository.update(updatedExpense);
  }
}





