import { IWishRepository } from '@/domain/repositories/wish.repository.interface';
import { ICategoryRepository } from '@/domain/repositories/category.repository.interface';
import { Wish } from '@/domain/entities/wish.entity';
import { CreateWishDTO } from '@/application/dto/create-wish.dto';
import { NotFoundError } from '@/shared/errors/not-found-error';

export class UpdateWishUseCase {
  constructor(
    private repository: IWishRepository,
    private categoryRepository: ICategoryRepository
  ) {}

  async execute(id: string, dto: CreateWishDTO, userId: string): Promise<Wish> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundError('Wish');
    }

    if (existing.userId !== userId) {
      throw new NotFoundError('Wish');
    }

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

    const updated = new Wish(
      existing.id,
      existing.userId,
      dto.name,
      dto.purchaseLink || null,
      dto.categoryId || null,
      dto.amount || null,
      existing.createdAt,
      new Date()
    );

    return await this.repository.update(updated);
  }
}



