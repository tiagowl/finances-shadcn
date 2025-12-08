import { IExpenseRepository } from '@/domain/repositories/expense.repository.interface';
import { ICategoryRepository } from '@/domain/repositories/category.repository.interface';
import { Expense } from '@/domain/entities/expense.entity';
import { CreateExpenseDTO } from '@/application/dto/create-expense.dto';
import { NotFoundError } from '@/shared/errors/not-found-error';
import { generateUUID } from '@/shared/utils/uuid';

export class CreateExpenseUseCase {
  constructor(
    private expenseRepository: IExpenseRepository,
    private categoryRepository: ICategoryRepository
  ) {}

  async execute(dto: CreateExpenseDTO, userId: string): Promise<Expense> {
    // Verify category exists and belongs to user if categoryId is provided
    if (dto.categoryId) {
      const category = await this.categoryRepository.findById(dto.categoryId);
      if (!category) {
        throw new NotFoundError('Category');
      }
      if (category.userId !== userId) {
        throw new NotFoundError('Category');
      }
    }

    // Ensure date is interpreted as local time, not UTC
    // When Zod converts "YYYY-MM-DD" string to Date, it creates a UTC date at midnight
    // We need to extract UTC components (which represent the intended date) and create a local Date
    let expenseDate: Date;
    if (dto.date instanceof Date) {
      // Extract UTC components (which represent the intended date from "YYYY-MM-DD")
      // and create a new Date in local timezone
      const year = dto.date.getUTCFullYear();
      const month = dto.date.getUTCMonth();
      const day = dto.date.getUTCDate();
      expenseDate = new Date(year, month, day);
    } else {
      expenseDate = dto.date;
    }

    const now = new Date();
    const expense = new Expense(
      generateUUID(),
      userId,
      dto.categoryId || null,
      dto.name,
      dto.amount,
      expenseDate,
      dto.notes,
      now,
      now
    );

    return await this.expenseRepository.create(expense);
  }
}

