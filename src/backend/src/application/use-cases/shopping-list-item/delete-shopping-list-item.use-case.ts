import { IShoppingListItemRepository } from '@/domain/repositories/shopping-list-item.repository.interface';
import { NotFoundError } from '@/shared/errors/not-found-error';

export class DeleteShoppingListItemUseCase {
  constructor(private repository: IShoppingListItemRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    const item = await this.repository.findById(id);

    if (!item) {
      throw new NotFoundError('ShoppingListItem');
    }

    if (item.userId !== userId) {
      throw new NotFoundError('ShoppingListItem');
    }

    await this.repository.delete(id);
  }
}





