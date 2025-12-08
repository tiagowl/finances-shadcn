import { ISimulationCreditPurchaseRepository } from '@/domain/repositories/simulation-credit-purchase.repository.interface';
import { SimulationCreditPurchase } from '@/domain/entities/simulation-credit-purchase.entity';
import { db } from '../database/knex';

export class PostgreSQLSimulationCreditPurchaseRepository implements ISimulationCreditPurchaseRepository {
  async create(purchase: SimulationCreditPurchase): Promise<SimulationCreditPurchase> {
    const [created] = await db('simulation_credit_purchases')
      .insert({
        id: purchase.id,
        user_id: purchase.userId,
        name: purchase.name,
        amount: purchase.amount,
        installments: purchase.installments,
        purchase_date: purchase.purchaseDate,
        created_at: purchase.createdAt,
        updated_at: purchase.updatedAt,
      })
      .returning('*');

    return this.mapToEntity(created);
  }

  async findById(id: string): Promise<SimulationCreditPurchase | null> {
    const result = await db('simulation_credit_purchases').where({ id }).first();
    return result ? this.mapToEntity(result) : null;
  }

  async findByUserId(userId: string): Promise<SimulationCreditPurchase[]> {
    const results = await db('simulation_credit_purchases')
      .where({ user_id: userId })
      .orderBy('purchase_date', 'desc');

    return results.map((r) => this.mapToEntity(r));
  }

  async getMonthlyPaymentsByUserId(userId: string, year: number, month: number): Promise<number> {
    const purchases = await this.findByUserId(userId);
    let total = 0;

    for (const purchase of purchases) {
      const purchaseDate = new Date(purchase.purchaseDate);
      const monthlyPayment = purchase.amount / purchase.installments;

      for (let i = 0; i < purchase.installments; i++) {
        const paymentMonth = new Date(purchaseDate.getFullYear(), purchaseDate.getMonth() + i, 1);
        if (paymentMonth.getFullYear() === year && paymentMonth.getMonth() + 1 === month) {
          total += monthlyPayment;
        }
      }
    }

    return total;
  }

  async update(purchase: SimulationCreditPurchase): Promise<SimulationCreditPurchase> {
    const [updated] = await db('simulation_credit_purchases')
      .where({ id: purchase.id })
      .update({
        name: purchase.name,
        amount: purchase.amount,
        installments: purchase.installments,
        purchase_date: purchase.purchaseDate,
        updated_at: purchase.updatedAt,
      })
      .returning('*');

    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await db('simulation_credit_purchases').where({ id }).delete();
  }

  async getTotalByUserId(userId: string): Promise<number> {
    const result = await db('simulation_credit_purchases')
      .where({ user_id: userId })
      .sum('amount as total')
      .first();

    return result?.total ? Number(result.total) : 0;
  }

  private mapToEntity(row: any): SimulationCreditPurchase {
    return new SimulationCreditPurchase(
      row.id,
      row.user_id,
      row.name,
      Number(row.amount),
      row.installments,
      row.purchase_date,
      row.created_at,
      row.updated_at
    );
  }
}





