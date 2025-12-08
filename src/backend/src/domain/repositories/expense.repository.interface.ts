import { Expense } from '../entities/expense.entity';

export interface IExpenseRepository {
  create(expense: Expense): Promise<Expense>;
  findById(id: string): Promise<Expense | null>;
  findByUserId(userId: string, limit?: number, offset?: number): Promise<Expense[]>;
  findByCategoryId(categoryId: string): Promise<Expense[]>;
  findByNameAndDate(userId: string, name: string, date: Date): Promise<Expense | null>;
  update(expense: Expense): Promise<Expense>;
  delete(id: string): Promise<void>;
  getTotalByUserId(userId: string): Promise<number>;
  getTotalByCategoryId(categoryId: string): Promise<number>;
  getTotalByCategoryIdAndMonth(categoryId: string, year: number, month: number): Promise<number>;
  getRecentByUserId(userId: string, limit: number): Promise<Expense[]>;
}



