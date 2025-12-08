import { ShoppingListItem } from '../entities/shopping-list-item.entity';

export interface IShoppingListItemRepository {
  create(item: ShoppingListItem): Promise<ShoppingListItem>;
  findById(id: string): Promise<ShoppingListItem | null>;
  findByUserId(userId: string): Promise<ShoppingListItem[]>;
  findPurchasedByUserIdAndDate(userId: string, date: Date): Promise<ShoppingListItem[]>;
  update(item: ShoppingListItem): Promise<ShoppingListItem>;
  delete(id: string): Promise<void>;
  deleteAllByUserId(userId: string): Promise<void>;
  getTotalByUserId(userId: string): Promise<number>;
  getPurchasedCountByUserId(userId: string): Promise<number>;
  getPendingCountByUserId(userId: string): Promise<number>;
}





