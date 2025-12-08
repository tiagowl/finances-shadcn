import { IMonthlyRevenueRepository } from '@/domain/repositories/monthly-revenue.repository.interface';
import { NotFoundError } from '@/shared/errors/not-found-error';

export class DeleteMonthlyRevenueUseCase {
  constructor(private monthlyRevenueRepository: IMonthlyRevenueRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    const monthlyRevenue = await this.monthlyRevenueRepository.findById(id);

    if (!monthlyRevenue) {
      throw new NotFoundError('MonthlyRevenue');
    }

    if (monthlyRevenue.userId !== userId) {
      throw new NotFoundError('MonthlyRevenue');
    }

    await this.monthlyRevenueRepository.delete(id);
  }
}





