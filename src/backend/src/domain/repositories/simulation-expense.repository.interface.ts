import { SimulationExpense } from '../entities/simulation-expense.entity';

export interface ISimulationExpenseRepository {
  create(expense: SimulationExpense): Promise<SimulationExpense>;
  findById(id: string): Promise<SimulationExpense | null>;
  findByUserId(userId: string): Promise<SimulationExpense[]>;
  findByUserIdAndMonth(userId: string, year: number, month: number): Promise<SimulationExpense[]>;
  update(expense: SimulationExpense): Promise<SimulationExpense>;
  delete(id: string): Promise<void>;
  getTotalByUserId(userId: string): Promise<number>;
}





