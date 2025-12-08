import { IMonthlyRevenueRepository } from '@/domain/repositories/monthly-revenue.repository.interface';
import { MonthlyRevenue } from '@/domain/entities/monthly-revenue.entity';
import { db } from '../database/knex';

export class PostgreSQLMonthlyRevenueRepository implements IMonthlyRevenueRepository {
  async create(monthlyRevenue: MonthlyRevenue): Promise<MonthlyRevenue> {
    const [created] = await db('monthly_revenues')
      .insert({
        id: monthlyRevenue.id,
        user_id: monthlyRevenue.userId,
        name: monthlyRevenue.name,
        amount: monthlyRevenue.amount,
        day_of_month: monthlyRevenue.dayOfMonth,
        created_at: monthlyRevenue.createdAt,
        updated_at: monthlyRevenue.updatedAt,
      })
      .returning('*');

    return this.mapToEntity(created);
  }

  async findById(id: string): Promise<MonthlyRevenue | null> {
    const result = await db('monthly_revenues').where({ id }).first();
    return result ? this.mapToEntity(result) : null;
  }

  async findByUserId(userId: string): Promise<MonthlyRevenue[]> {
    const results = await db('monthly_revenues')
      .where({ user_id: userId })
      .orderBy('day_of_month', 'asc');

    return results.map((r) => this.mapToEntity(r));
  }

  async update(monthlyRevenue: MonthlyRevenue): Promise<MonthlyRevenue> {
    const [updated] = await db('monthly_revenues')
      .where({ id: monthlyRevenue.id })
      .update({
        name: monthlyRevenue.name,
        amount: monthlyRevenue.amount,
        day_of_month: monthlyRevenue.dayOfMonth,
        updated_at: monthlyRevenue.updatedAt,
      })
      .returning('*');

    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await db('monthly_revenues').where({ id }).delete();
  }

  async getTotalByUserId(userId: string): Promise<number> {
    const result = await db('monthly_revenues')
      .where({ user_id: userId })
      .sum('amount as total')
      .first();

    return result?.total ? Number(result.total) : 0;
  }

  private mapToEntity(row: any): MonthlyRevenue {
    return new MonthlyRevenue(
      row.id,
      row.user_id,
      row.name,
      Number(row.amount),
      row.day_of_month,
      row.created_at,
      row.updated_at
    );
  }
}

