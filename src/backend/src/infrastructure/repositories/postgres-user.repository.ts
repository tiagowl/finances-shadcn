import { IUserRepository } from '@/domain/repositories/user.repository.interface';
import { User } from '@/domain/entities/user.entity';
import { db } from '../database/knex';

export class PostgreSQLUserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    const [created] = await db('users')
      .insert({
        id: user.id,
        email: user.email,
        name: user.name,
        password_hash: user.passwordHash,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      })
      .returning('*');

    return this.toEntity(created);
  }

  async findById(id: string): Promise<User | null> {
    const user = await db('users').where({ id }).first();
    return user ? this.toEntity(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    // Normalize email: lowercase and trim
    const normalizedEmail = email.toLowerCase().trim();
    // Use LOWER() in database query to ensure case-insensitive comparison
    // This handles cases where emails in DB might not be normalized
    const user = await db('users')
      .whereRaw('LOWER(TRIM(email)) = ?', [normalizedEmail])
      .first();
    return user ? this.toEntity(user) : null;
  }

  async update(user: User): Promise<User> {
    const [updated] = await db('users')
      .where({ id: user.id })
      .update({
        email: user.email,
        name: user.name,
        password_hash: user.passwordHash,
        updated_at: new Date(),
      })
      .returning('*');

    return this.toEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await db('users').where({ id }).delete();
  }

  private toEntity(row: any): User {
    // Ensure password_hash is properly mapped
    const passwordHash = row.password_hash || row.passwordHash;
    if (!passwordHash) {
      throw new Error(`User entity missing password_hash for user ${row.id}`);
    }
    
    return new User(
      row.id,
      row.email,
      row.name,
      passwordHash,
      row.created_at,
      row.updated_at
    );
  }
}





