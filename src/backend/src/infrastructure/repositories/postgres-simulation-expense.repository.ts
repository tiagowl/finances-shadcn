import { ISimulationExpenseRepository } from '@/domain/repositories/simulation-expense.repository.interface';
import { SimulationExpense } from '@/domain/entities/simulation-expense.entity';
import { db } from '../database/knex';

export class PostgreSQLSimulationExpenseRepository implements ISimulationExpenseRepository {
  async create(expense: SimulationExpense): Promise<SimulationExpense> {
    const [created] = await db('simulation_expenses')
      .insert({
        id: expense.id,
        user_id: expense.userId,
        name: expense.name,
        amount: expense.amount,
        date: expense.date,
        created_at: expense.createdAt,
        updated_at: expense.updatedAt,
      })
      .returning('*');

    return this.mapToEntity(created);
  }

  async findById(id: string): Promise<SimulationExpense | null> {
    const result = await db('simulation_expenses').where({ id }).first();
    return result ? this.mapToEntity(result) : null;
  }

  async findByUserId(userId: string): Promise<SimulationExpense[]> {
    const results = await db('simulation_expenses')
      .where({ user_id: userId })
      .orderBy('date', 'asc');

    return results.map((r) => this.mapToEntity(r));
  }

  async findByUserIdAndMonth(userId: string, year: number, month: number): Promise<SimulationExpense[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const results = await db('simulation_expenses')
      .where({ user_id: userId })
      .whereBetween('date', [startDate, endDate])
      .orderBy('date', 'asc');

    return results.map((r) => this.mapToEntity(r));
  }

  async update(expense: SimulationExpense): Promise<SimulationExpense> {
    const [updated] = await db('simulation_expenses')
      .where({ id: expense.id })
      .update({
        name: expense.name,
        amount: expense.amount,
        date: expense.date,
        updated_at: expense.updatedAt,
      })
      .returning('*');

    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await db('simulation_expenses').where({ id }).delete();
  }

  async getTotalByUserId(userId: string): Promise<number> {
    const result = await db('simulation_expenses')
      .where({ user_id: userId })
      .sum('amount as total')
      .first();

    return result?.total ? Number(result.total) : 0;
  }

  private mapToEntity(row: any): SimulationExpense {
    return new SimulationExpense(
      row.id,
      row.user_id,
      row.name,
      Number(row.amount),
      row.date,
      row.created_at,
      row.updated_at
    );
  }
}





