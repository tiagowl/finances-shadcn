import { SimulationCreditPurchase } from '../entities/simulation-credit-purchase.entity';

export interface ISimulationCreditPurchaseRepository {
  create(purchase: SimulationCreditPurchase): Promise<SimulationCreditPurchase>;
  findById(id: string): Promise<SimulationCreditPurchase | null>;
  findByUserId(userId: string): Promise<SimulationCreditPurchase[]>;
  getMonthlyPaymentsByUserId(userId: string, year: number, month: number): Promise<number>;
  update(purchase: SimulationCreditPurchase): Promise<SimulationCreditPurchase>;
  delete(id: string): Promise<void>;
  getTotalByUserId(userId: string): Promise<number>;
}





