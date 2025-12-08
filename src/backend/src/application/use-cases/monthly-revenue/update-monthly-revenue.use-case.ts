import { IMonthlyRevenueRepository } from '@/domain/repositories/monthly-revenue.repository.interface';
import { MonthlyRevenue } from '@/domain/entities/monthly-revenue.entity';
import { CreateMonthlyRevenueDTO } from '@/application/dto/create-monthly-revenue.dto';
import { NotFoundError } from '@/shared/errors/not-found-error';

export class UpdateMonthlyRevenueUseCase {
  constructor(private monthlyRevenueRepository: IMonthlyRevenueRepository) {}

  async execute(id: string, dto: CreateMonthlyRevenueDTO, userId: string): Promise<MonthlyRevenue> {
    const existing = await this.monthlyRevenueRepository.findById(id);

    if (!existing) {
      throw new NotFoundError('MonthlyRevenue');
    }

    if (existing.userId !== userId) {
      throw new NotFoundError('MonthlyRevenue');
    }

    const updated = new MonthlyRevenue(
      existing.id,
      existing.userId,
      dto.name,
      dto.amount,
      dto.dayOfMonth,
      existing.createdAt,
      new Date()
    );

    return await this.monthlyRevenueRepository.update(updated);
  }
}





