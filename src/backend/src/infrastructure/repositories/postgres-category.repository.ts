import { ICategoryRepository } from '@/domain/repositories/category.repository.interface';
import { Category } from '@/domain/entities/category.entity';
import { db } from '../database/knex';

export class PostgreSQLCategoryRepository implements ICategoryRepository {
  async create(category: Category): Promise<Category> {
    const [created] = await db('categories')
      .insert({
        id: category.id,
        user_id: category.userId,
        name: category.name,
        budget_max: category.budgetMax,
        color: category.color,
        created_at: category.createdAt || new Date(),
        updated_at: category.updatedAt || new Date(),
      })
      .returning('*');

    return this.toEntity(created);
  }

  async findById(id: string): Promise<Category | null> {
    const category = await db('categories').where({ id }).first();
    return category ? this.toEntity(category) : null;
  }

  async findByUserId(userId: string): Promise<Category[]> {
    const categories = await db('categories')
      .where({ user_id: userId })
      .orderBy('name', 'asc');

    return categories.map((c: any) => this.toEntity(c));
  }

  async findByNameAndUserId(name: string, userId: string): Promise<Category | null> {
    const category = await db('categories')
      .where({ name, user_id: userId })
      .first();

    return category ? this.toEntity(category) : null;
  }

  async update(category: Category): Promise<Category> {
    const [updated] = await db('categories')
      .where({ id: category.id })
      .update({
        name: category.name,
        budget_max: category.budgetMax,
        color: category.color,
        updated_at: new Date(),
      })
      .returning('*');

    return this.toEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await db('categories').where({ id }).delete();
  }

  private toEntity(row: any): Category {
    return new Category(
      row.id,
      row.user_id,
      row.name,
      parseFloat(row.budget_max),
      row.color,
      row.created_at ? new Date(row.created_at) : undefined,
      row.updated_at ? new Date(row.updated_at) : undefined
    );
  }
}

