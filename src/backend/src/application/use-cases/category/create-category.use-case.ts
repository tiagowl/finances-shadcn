import { ICategoryRepository } from '@/domain/repositories/category.repository.interface';
import { Category } from '@/domain/entities/category.entity';
import { CreateCategoryDTO } from '@/application/dto/create-category.dto';
import { ValidationError } from '@/shared/errors/validation-error';
import { generateUUID } from '@/shared/utils/uuid';

export class CreateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(dto: CreateCategoryDTO, userId: string): Promise<Category> {
    // Check if category name already exists for this user
    const existingCategory = await this.categoryRepository.findByNameAndUserId(dto.name, userId);
    if (existingCategory) {
      throw new ValidationError('Category name already exists');
    }

    const now = new Date();
    const category = new Category(
      generateUUID(),
      userId,
      dto.name,
      dto.budgetMax,
      dto.color,
      now,
      now
    );

    return await this.categoryRepository.create(category);
  }
}

