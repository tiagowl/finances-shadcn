import { ICategoryRepository } from '@/domain/repositories/category.repository.interface';
import { IExpenseRepository } from '@/domain/repositories/expense.repository.interface';
import { NotFoundError } from '@/shared/errors/not-found-error';
import { Expense } from '@/domain/entities/expense.entity';

export class DeleteCategoryUseCase {
  constructor(
    private categoryRepository: ICategoryRepository,
    private expenseRepository: IExpenseRepository
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundError('Category');
    }

    if (category.userId !== userId) {
      throw new NotFoundError('Category');
    }

    // Find all expenses associated with this category
    const expenses = await this.expenseRepository.findByCategoryId(id);

    // Update all expenses to set category_id to null
    for (const expense of expenses) {
      const updatedExpense = new Expense(
        expense.id,
        expense.userId,
        null, // Set category_id to null
        expense.name,
        expense.amount,
        expense.date,
        expense.notes,
        expense.createdAt,
        new Date()
      );
      await this.expenseRepository.update(updatedExpense);
    }

    // Now we can safely delete the category
    await this.categoryRepository.delete(id);
  }
}





