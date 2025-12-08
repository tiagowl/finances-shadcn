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
    const user = await db('users').where({ email }).first();
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
    return new User(
      row.id,
      row.email,
      row.name,
      row.password_hash,
      row.created_at,
      row.updated_at
    );
  }
}





