import { ISimulationRevenueRepository } from '@/domain/repositories/simulation-revenue.repository.interface';
import { SimulationRevenue } from '@/domain/entities/simulation-revenue.entity';

export class GetSimulationRevenuesUseCase {
  constructor(private repository: ISimulationRevenueRepository) {}

  async execute(userId: string, year?: number, month?: number): Promise<SimulationRevenue[]> {
    if (year && month) {
      return await this.repository.findByUserIdAndMonth(userId, year, month);
    }
    return await this.repository.findByUserId(userId);
  }
}





