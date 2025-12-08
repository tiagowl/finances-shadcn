import { Category } from '../entities/category.entity';

export interface ICategoryRepository {
  create(category: Category): Promise<Category>;
  findById(id: string): Promise<Category | null>;
  findByUserId(userId: string): Promise<Category[]>;
  findByNameAndUserId(name: string, userId: string): Promise<Category | null>;
  update(category: Category): Promise<Category>;
  delete(id: string): Promise<void>;
}





