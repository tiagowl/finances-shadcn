import { IShoppingListItemRepository } from '@/domain/repositories/shopping-list-item.repository.interface';
import { ShoppingListItem } from '@/domain/entities/shopping-list-item.entity';
import { CreateShoppingListItemDTO } from '@/application/dto/create-shopping-list-item.dto';
import { generateUUID } from '@/shared/utils/uuid';

export class CreateShoppingListItemUseCase {
  constructor(private repository: IShoppingListItemRepository) {}

  async execute(dto: CreateShoppingListItemDTO, userId: string): Promise<ShoppingListItem> {
    const now = new Date();
    const item = new ShoppingListItem(
      generateUUID(),
      userId,
      dto.name,
      dto.price,
      false,
      now,
      now
    );

    return await this.repository.create(item);
  }
}





