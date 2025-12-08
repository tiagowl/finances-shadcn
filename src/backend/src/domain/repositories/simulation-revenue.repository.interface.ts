import { SimulationRevenue } from '../entities/simulation-revenue.entity';

export interface ISimulationRevenueRepository {
  create(revenue: SimulationRevenue): Promise<SimulationRevenue>;
  findById(id: string): Promise<SimulationRevenue | null>;
  findByUserId(userId: string): Promise<SimulationRevenue[]>;
  findByUserIdAndMonth(userId: string, year: number, month: number): Promise<SimulationRevenue[]>;
  update(revenue: SimulationRevenue): Promise<SimulationRevenue>;
  delete(id: string): Promise<void>;
  getTotalByUserId(userId: string): Promise<number>;
}





