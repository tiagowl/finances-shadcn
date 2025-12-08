import { IWishRepository } from '@/domain/repositories/wish.repository.interface';
import { ICategoryRepository } from '@/domain/repositories/category.repository.interface';
import { Wish } from '@/domain/entities/wish.entity';
import { CreateWishDTO } from '@/application/dto/create-wish.dto';
import { NotFoundError } from '@/shared/errors/not-found-error';
import { generateUUID } from '@/shared/utils/uuid';

export class CreateWishUseCase {
  constructor(
    private repository: IWishRepository,
    private categoryRepository: ICategoryRepository
  ) {}

  async execute(dto: CreateWishDTO, userId: string): Promise<Wish> {
    // Verify category exists and belongs to user if provided
    if (dto.categoryId) {
      const category = await this.categoryRepository.findById(dto.categoryId);
      if (!category) {
        throw new NotFoundError('Category');
      }
      if (category.userId !== userId) {
        throw new NotFoundError('Category');
      }
    }

    const now = new Date();
    const wish = new Wish(
      generateUUID(),
      userId,
      dto.name,
      dto.purchaseLink || null,
      dto.categoryId || null,
      dto.amount || null,
      now,
      now
    );

    return await this.repository.create(wish);
  }
}



