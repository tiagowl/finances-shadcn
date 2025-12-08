import { IShoppingListItemRepository } from '@/domain/repositories/shopping-list-item.repository.interface';
import { ShoppingListItem } from '@/domain/entities/shopping-list-item.entity';
import { NotFoundError } from '@/shared/errors/not-found-error';

export class ToggleShoppingListItemUseCase {
  constructor(
    private repository: IShoppingListItemRepository
  ) {}

  async execute(id: string, userId: string): Promise<ShoppingListItem> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundError('ShoppingListItem');
    }

    if (existing.userId !== userId) {
      throw new NotFoundError('ShoppingListItem');
    }

    const updated = new ShoppingListItem(
      existing.id,
      existing.userId,
      existing.name,
      existing.price,
      !existing.isPurchased,
      existing.createdAt,
      new Date()
    );

    const result = await this.repository.update(updated);

    return result;
  }
}





