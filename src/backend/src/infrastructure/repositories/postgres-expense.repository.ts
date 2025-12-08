import { IExpenseRepository } from '@/domain/repositories/expense.repository.interface';
import { Expense } from '@/domain/entities/expense.entity';
import { db } from '../database/knex';

export class PostgreSQLExpenseRepository implements IExpenseRepository {
  async create(expense: Expense): Promise<Expense> {
    const [created] = await db('expenses')
      .insert({
        id: expense.id,
        user_id: expense.userId,
        category_id: expense.categoryId,
        name: expense.name,
        amount: expense.amount,
        date: expense.date,
        notes: expense.notes,
        created_at: expense.createdAt || new Date(),
        updated_at: expense.updatedAt || new Date(),
      })
      .returning('*');

    return this.toEntity(created);
  }

  async findById(id: string): Promise<Expense | null> {
    const expense = await db('expenses').where({ id }).first();
    return expense ? this.toEntity(expense) : null;
  }

  async findByUserId(userId: string, limit = 100, offset = 0): Promise<Expense[]> {
    const expenses = await db('expenses')
      .where({ user_id: userId })
      .orderBy('date', 'desc')
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    return expenses.map((e) => this.toEntity(e));
  }

  async findByCategoryId(categoryId: string): Promise<Expense[]> {
    const expenses = await db('expenses')
      .where({ category_id: categoryId })
      .orderBy('date', 'desc');

    return expenses.map((e) => this.toEntity(e));
  }

  async findByNameAndDate(userId: string, name: string, date: Date): Promise<Expense | null> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const expense = await db('expenses')
      .where({ user_id: userId })
      .where({ name })
      .whereBetween('date', [startOfDay, endOfDay])
      .first();

    return expense ? this.toEntity(expense) : null;
  }

  async update(expense: Expense): Promise<Expense> {
    const [updated] = await db('expenses')
      .where({ id: expense.id })
      .update({
        category_id: expense.categoryId,
        name: expense.name,
        amount: expense.amount,
        date: expense.date,
        notes: expense.notes,
        updated_at: new Date(),
      })
      .returning('*');

    return this.toEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await db('expenses').where({ id }).delete();
  }

  async getTotalByUserId(userId: string): Promise<number> {
    const result = await db('expenses')
      .where({ user_id: userId })
      .sum('amount as total')
      .first();

    return parseFloat(result?.total || '0');
  }

  async getTotalByCategoryId(categoryId: string): Promise<number> {
    const result = await db('expenses')
      .where({ category_id: categoryId })
      .sum('amount as total')
      .first();

    return parseFloat(result?.total || '0');
  }

  async getTotalByCategoryIdAndMonth(categoryId: string, year: number, month: number): Promise<number> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const result = await db('expenses')
      .where({ category_id: categoryId })
      .whereBetween('date', [startDate, endDate])
      .sum('amount as total')
      .first();

    return parseFloat(result?.total || '0');
  }

  async getRecentByUserId(userId: string, limit: number): Promise<Expense[]> {
    const expenses = await db('expenses')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc')
      .limit(limit);

    return expenses.map((e) => this.toEntity(e));
  }

  private toEntity(row: any): Expense {
    return new Expense(
      row.id,
      row.user_id,
      row.category_id,
      row.name,
      parseFloat(row.amount),
      new Date(row.date),
      row.notes,
      row.created_at ? new Date(row.created_at) : undefined,
      row.updated_at ? new Date(row.updated_at) : undefined
    );
  }
}



