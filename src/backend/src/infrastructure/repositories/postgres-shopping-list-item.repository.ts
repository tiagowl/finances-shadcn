import { IShoppingListItemRepository } from '@/domain/repositories/shopping-list-item.repository.interface';
import { ShoppingListItem } from '@/domain/entities/shopping-list-item.entity';
import { db } from '../database/knex';

export class PostgreSQLShoppingListItemRepository implements IShoppingListItemRepository {
  async create(item: ShoppingListItem): Promise<ShoppingListItem> {
    const [created] = await db('shopping_list_items')
      .insert({
        id: item.id,
        user_id: item.userId,
        name: item.name,
        price: item.price,
        is_purchased: item.isPurchased,
        created_at: item.createdAt,
        updated_at: item.updatedAt,
      })
      .returning('*');

    return this.mapToEntity(created);
  }

  async findById(id: string): Promise<ShoppingListItem | null> {
    const result = await db('shopping_list_items').where({ id }).first();
    return result ? this.mapToEntity(result) : null;
  }

  async findByUserId(userId: string): Promise<ShoppingListItem[]> {
    const results = await db('shopping_list_items')
      .where({ user_id: userId })
      .orderBy('is_purchased', 'asc')
      .orderBy('created_at', 'desc');

    return results.map((r) => this.mapToEntity(r));
  }

  async findPurchasedByUserIdAndDate(userId: string, date: Date): Promise<ShoppingListItem[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all purchased items that were updated today (marked as purchased today)
    // This includes items that were toggled to purchased=true today
    const results = await db('shopping_list_items')
      .where({ user_id: userId })
      .where({ is_purchased: true })
      .whereBetween('updated_at', [startOfDay, endOfDay])
      .orderBy('updated_at', 'desc');

    return results.map((r) => this.mapToEntity(r));
  }

  async update(item: ShoppingListItem): Promise<ShoppingListItem> {
    const [updated] = await db('shopping_list_items')
      .where({ id: item.id })
      .update({
        name: item.name,
        price: item.price,
        is_purchased: item.isPurchased,
        updated_at: item.updatedAt,
      })
      .returning('*');

    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await db('shopping_list_items').where({ id }).delete();
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await db('shopping_list_items').where({ user_id: userId }).delete();
  }

  async getTotalByUserId(userId: string): Promise<number> {
    const result = await db('shopping_list_items')
      .where({ user_id: userId })
      .sum('price as total')
      .first();

    return result?.total ? Number(result.total) : 0;
  }

  async getPurchasedCountByUserId(userId: string): Promise<number> {
    const result = await db('shopping_list_items')
      .where({ user_id: userId })
      .where({ is_purchased: true })
      .count('* as count')
      .first();

    return result?.count ? Number(result.count) : 0;
  }

  async getPendingCountByUserId(userId: string): Promise<number> {
    const result = await db('shopping_list_items')
      .where({ user_id: userId })
      .where({ is_purchased: false })
      .count('* as count')
      .first();

    return result?.count ? Number(result.count) : 0;
  }

  private mapToEntity(row: any): ShoppingListItem {
    return new ShoppingListItem(
      row.id,
      row.user_id,
      row.name,
      Number(row.price),
      row.is_purchased,
      row.created_at,
      row.updated_at
    );
  }
}





