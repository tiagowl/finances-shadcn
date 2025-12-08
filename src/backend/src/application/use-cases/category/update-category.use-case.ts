import { ICategoryRepository } from '@/domain/repositories/category.repository.interface';
import { Category } from '@/domain/entities/category.entity';
import { CreateCategoryDTO } from '@/application/dto/create-category.dto';
import { NotFoundError } from '@/shared/errors/not-found-error';

export class UpdateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(id: string, dto: CreateCategoryDTO, userId: string): Promise<Category> {
    const existingCategory = await this.categoryRepository.findById(id);

    if (!existingCategory) {
      throw new NotFoundError('Category');
    }

    if (existingCategory.userId !== userId) {
      throw new NotFoundError('Category');
    }

    const updatedCategory = new Category(
      existingCategory.id,
      existingCategory.userId,
      dto.name,
      dto.budgetMax,
      dto.color,
      existingCategory.createdAt,
      new Date()
    );

    return await this.categoryRepository.update(updatedCategory);
  }
}





