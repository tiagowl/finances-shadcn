import { ISimulationRevenueRepository } from '@/domain/repositories/simulation-revenue.repository.interface';
import { SimulationRevenue } from '@/domain/entities/simulation-revenue.entity';
import { db } from '../database/knex';

export class PostgreSQLSimulationRevenueRepository implements ISimulationRevenueRepository {
  async create(revenue: SimulationRevenue): Promise<SimulationRevenue> {
    const [created] = await db('simulation_revenues')
      .insert({
        id: revenue.id,
        user_id: revenue.userId,
        name: revenue.name,
        amount: revenue.amount,
        date: revenue.date,
        created_at: revenue.createdAt,
        updated_at: revenue.updatedAt,
      })
      .returning('*');

    return this.mapToEntity(created);
  }

  async findById(id: string): Promise<SimulationRevenue | null> {
    const result = await db('simulation_revenues').where({ id }).first();
    return result ? this.mapToEntity(result) : null;
  }

  async findByUserId(userId: string): Promise<SimulationRevenue[]> {
    const results = await db('simulation_revenues')
      .where({ user_id: userId })
      .orderBy('date', 'asc');

    return results.map((r) => this.mapToEntity(r));
  }

  async findByUserIdAndMonth(userId: string, year: number, month: number): Promise<SimulationRevenue[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const results = await db('simulation_revenues')
      .where({ user_id: userId })
      .whereBetween('date', [startDate, endDate])
      .orderBy('date', 'asc');

    return results.map((r) => this.mapToEntity(r));
  }

  async update(revenue: SimulationRevenue): Promise<SimulationRevenue> {
    const [updated] = await db('simulation_revenues')
      .where({ id: revenue.id })
      .update({
        name: revenue.name,
        amount: revenue.amount,
        date: revenue.date,
        updated_at: revenue.updatedAt,
      })
      .returning('*');

    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await db('simulation_revenues').where({ id }).delete();
  }

  async getTotalByUserId(userId: string): Promise<number> {
    const result = await db('simulation_revenues')
      .where({ user_id: userId })
      .sum('amount as total')
      .first();

    return result?.total ? Number(result.total) : 0;
  }

  private mapToEntity(row: any): SimulationRevenue {
    return new SimulationRevenue(
      row.id,
      row.user_id,
      row.name,
      Number(row.amount),
      row.date,
      row.created_at,
      row.updated_at
    );
  }
}





