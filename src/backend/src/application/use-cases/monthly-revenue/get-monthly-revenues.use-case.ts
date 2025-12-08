import { IMonthlyRevenueRepository } from '@/domain/repositories/monthly-revenue.repository.interface';
import { MonthlyRevenue } from '@/domain/entities/monthly-revenue.entity';

export class GetMonthlyRevenuesUseCase {
  constructor(private monthlyRevenueRepository: IMonthlyRevenueRepository) {}

  async execute(userId: string): Promise<MonthlyRevenue[]> {
    return await this.monthlyRevenueRepository.findByUserId(userId);
  }
}





