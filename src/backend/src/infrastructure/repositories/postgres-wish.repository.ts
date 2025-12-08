import { IWishRepository } from '@/domain/repositories/wish.repository.interface';
import { Wish } from '@/domain/entities/wish.entity';
import { db } from '../database/knex';

export class PostgreSQLWishRepository implements IWishRepository {
  async create(wish: Wish): Promise<Wish> {
    const [created] = await db('wishes')
      .insert({
        id: wish.id,
        user_id: wish.userId,
        name: wish.name,
        purchase_link: wish.purchaseLink,
        category_id: wish.categoryId,
        amount: wish.amount,
        created_at: wish.createdAt,
        updated_at: wish.updatedAt,
      })
      .returning('*');

    return this.mapToEntity(created);
  }

  async findById(id: string): Promise<Wish | null> {
    const result = await db('wishes').where({ id }).first();
    return result ? this.mapToEntity(result) : null;
  }

  async findByUserId(userId: string): Promise<Wish[]> {
    const results = await db('wishes')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc');

    return results.map((r) => this.mapToEntity(r));
  }

  async update(wish: Wish): Promise<Wish> {
    const [updated] = await db('wishes')
      .where({ id: wish.id })
      .update({
        name: wish.name,
        purchase_link: wish.purchaseLink,
        category_id: wish.categoryId,
        amount: wish.amount,
        updated_at: wish.updatedAt,
      })
      .returning('*');

    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await db('wishes').where({ id }).delete();
  }

  private mapToEntity(row: any): Wish {
    return new Wish(
      row.id,
      row.user_id,
      row.name,
      row.purchase_link,
      row.category_id,
      row.amount ? parseFloat(row.amount) : null,
      row.created_at,
      row.updated_at
    );
  }
}



