import { IRevenueRepository } from '@/domain/repositories/revenue.repository.interface';
import { Revenue } from '@/domain/entities/revenue.entity';
import { db } from '../database/knex';

export class PostgreSQLRevenueRepository implements IRevenueRepository {
  async create(revenue: Revenue): Promise<Revenue> {
    const [created] = await db('revenues')
      .insert({
        id: revenue.id,
        user_id: revenue.userId,
        name: revenue.name,
        amount: revenue.amount,
        date: revenue.date,
        notes: revenue.notes,
        created_at: revenue.createdAt || new Date(),
        updated_at: revenue.updatedAt || new Date(),
      })
      .returning('*');

    return this.toEntity(created);
  }

  async findById(id: string): Promise<Revenue | null> {
    const revenue = await db('revenues').where({ id }).first();
    return revenue ? this.toEntity(revenue) : null;
  }

  async findByUserId(userId: string, limit = 100, offset = 0): Promise<Revenue[]> {
    const revenues = await db('revenues')
      .where({ user_id: userId })
      .orderBy('date', 'desc')
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    return revenues.map((r) => this.toEntity(r));
  }

  async update(revenue: Revenue): Promise<Revenue> {
    const [updated] = await db('revenues')
      .where({ id: revenue.id })
      .update({
        name: revenue.name,
        amount: revenue.amount,
        date: revenue.date,
        notes: revenue.notes,
        updated_at: new Date(),
      })
      .returning('*');

    return this.toEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await db('revenues').where({ id }).delete();
  }

  async getTotalByUserId(userId: string): Promise<number> {
    const result = await db('revenues')
      .where({ user_id: userId })
      .sum('amount as total')
      .first();

    return parseFloat(result?.total || '0');
  }

  async getRecentByUserId(userId: string, limit: number): Promise<Revenue[]> {
    const revenues = await db('revenues')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc')
      .limit(limit);

    return revenues.map((r) => this.toEntity(r));
  }

  private toEntity(row: any): Revenue {
    return new Revenue(
      row.id,
      row.user_id,
      row.name,
      parseFloat(row.amount),
      new Date(row.date),
      row.notes,
      row.created_at ? new Date(row.created_at) : undefined,
      row.updated_at ? new Date(row.updated_at) : undefined
    );
  }
}





