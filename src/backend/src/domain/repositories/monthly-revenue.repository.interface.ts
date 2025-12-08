import { MonthlyRevenue } from '../entities/monthly-revenue.entity';

export interface IMonthlyRevenueRepository {
  create(monthlyRevenue: MonthlyRevenue): Promise<MonthlyRevenue>;
  findById(id: string): Promise<MonthlyRevenue | null>;
  findByUserId(userId: string): Promise<MonthlyRevenue[]>;
  update(monthlyRevenue: MonthlyRevenue): Promise<MonthlyRevenue>;
  delete(id: string): Promise<void>;
  getTotalByUserId(userId: string): Promise<number>;
}





