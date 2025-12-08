import { Revenue } from '../entities/revenue.entity';

export interface IRevenueRepository {
  create(revenue: Revenue): Promise<Revenue>;
  findById(id: string): Promise<Revenue | null>;
  findByUserId(userId: string, limit?: number, offset?: number): Promise<Revenue[]>;
  update(revenue: Revenue): Promise<Revenue>;
  delete(id: string): Promise<void>;
  getTotalByUserId(userId: string): Promise<number>;
  getRecentByUserId(userId: string, limit: number): Promise<Revenue[]>;
}





