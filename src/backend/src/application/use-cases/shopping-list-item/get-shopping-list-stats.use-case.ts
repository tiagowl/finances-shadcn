import { IShoppingListItemRepository } from '@/domain/repositories/shopping-list-item.repository.interface';

export interface ShoppingListStats {
  totalItems: number;
  purchasedItems: number;
  pendingItems: number;
  totalPrice: number;
}

export class GetShoppingListStatsUseCase {
  constructor(private repository: IShoppingListItemRepository) {}

  async execute(userId: string): Promise<ShoppingListStats> {
    const items = await this.repository.findByUserId(userId);
    const totalPrice = await this.repository.getTotalByUserId(userId);
    const purchasedItems = await this.repository.getPurchasedCountByUserId(userId);
    const pendingItems = await this.repository.getPendingCountByUserId(userId);

    return {
      totalItems: items.length,
      purchasedItems,
      pendingItems,
      totalPrice,
    };
  }
}





