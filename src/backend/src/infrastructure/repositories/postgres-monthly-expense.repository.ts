import { IMonthlyExpenseRepository } from '@/domain/repositories/monthly-expense.repository.interface';
import { MonthlyExpense } from '@/domain/entities/monthly-expense.entity';
import { db } from '../database/knex';

export class PostgreSQLMonthlyExpenseRepository implements IMonthlyExpenseRepository {
  async create(monthlyExpense: MonthlyExpense): Promise<MonthlyExpense> {
    const [created] = await db('monthly_expenses')
      .insert({
        id: monthlyExpense.id,
        user_id: monthlyExpense.userId,
        name: monthlyExpense.name,
        amount: monthlyExpense.amount,
        day_of_month: monthlyExpense.dayOfMonth,
        cancellation_link: monthlyExpense.cancellationLink,
        created_at: monthlyExpense.createdAt,
        updated_at: monthlyExpense.updatedAt,
      })
      .returning('*');

    return this.mapToEntity(created);
  }

  async findById(id: string): Promise<MonthlyExpense | null> {
    const result = await db('monthly_expenses').where({ id }).first();
    return result ? this.mapToEntity(result) : null;
  }

  async findByUserId(userId: string): Promise<MonthlyExpense[]> {
    const results = await db('monthly_expenses')
      .where({ user_id: userId })
      .orderBy('day_of_month', 'asc');

    return results.map((r) => this.mapToEntity(r));
  }

  async update(monthlyExpense: MonthlyExpense): Promise<MonthlyExpense> {
    const [updated] = await db('monthly_expenses')
      .where({ id: monthlyExpense.id })
      .update({
        name: monthlyExpense.name,
        amount: monthlyExpense.amount,
        day_of_month: monthlyExpense.dayOfMonth,
        cancellation_link: monthlyExpense.cancellationLink,
        updated_at: monthlyExpense.updatedAt,
      })
      .returning('*');

    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await db('monthly_expenses').where({ id }).delete();
  }

  async getTotalByUserId(userId: string): Promise<number> {
    const result = await db('monthly_expenses')
      .where({ user_id: userId })
      .sum('amount as total')
      .first();

    return result?.total ? Number(result.total) : 0;
  }

  private mapToEntity(row: any): MonthlyExpense {
    return new MonthlyExpense(
      row.id,
      row.user_id,
      row.name,
      Number(row.amount),
      row.day_of_month,
      row.cancellation_link,
      row.created_at,
      row.updated_at
    );
  }
}

