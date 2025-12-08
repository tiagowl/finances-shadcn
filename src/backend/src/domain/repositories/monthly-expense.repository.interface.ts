import { MonthlyExpense } from '../entities/monthly-expense.entity';

export interface IMonthlyExpenseRepository {
  create(monthlyExpense: MonthlyExpense): Promise<MonthlyExpense>;
  findById(id: string): Promise<MonthlyExpense | null>;
  findByUserId(userId: string): Promise<MonthlyExpense[]>;
  update(monthlyExpense: MonthlyExpense): Promise<MonthlyExpense>;
  delete(id: string): Promise<void>;
  getTotalByUserId(userId: string): Promise<number>;
}





