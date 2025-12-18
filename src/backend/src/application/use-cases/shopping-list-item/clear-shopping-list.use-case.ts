import { IShoppingListItemRepository } from '@/domain/repositories/shopping-list-item.repository.interface';

export class ClearShoppingListUseCase {
  constructor(private repository: IShoppingListItemRepository) {}

  async execute(userId: string): Promise<void> {
    await this.repository.deleteAllByUserId(userId);
  }
}






