import { IShoppingListItemRepository } from '@/domain/repositories/shopping-list-item.repository.interface';
import { ShoppingListItem } from '@/domain/entities/shopping-list-item.entity';

export class GetShoppingListItemsUseCase {
  constructor(private repository: IShoppingListItemRepository) {}

  async execute(userId: string): Promise<ShoppingListItem[]> {
    return await this.repository.findByUserId(userId);
  }
}





