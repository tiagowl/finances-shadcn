import { IShoppingListItemRepository } from '@/domain/repositories/shopping-list-item.repository.interface';
import { ShoppingListItem } from '@/domain/entities/shopping-list-item.entity';
import { CreateShoppingListItemDTO } from '@/application/dto/create-shopping-list-item.dto';
import { NotFoundError } from '@/shared/errors/not-found-error';

export class UpdateShoppingListItemUseCase {
  constructor(private repository: IShoppingListItemRepository) {}

  async execute(id: string, dto: CreateShoppingListItemDTO, userId: string): Promise<ShoppingListItem> {
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
      dto.name,
      dto.price,
      existing.isPurchased,
      existing.createdAt,
      new Date()
    );

    return await this.repository.update(updated);
  }
}





