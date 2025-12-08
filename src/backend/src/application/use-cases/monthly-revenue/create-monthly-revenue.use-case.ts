import { IMonthlyRevenueRepository } from '@/domain/repositories/monthly-revenue.repository.interface';
import { MonthlyRevenue } from '@/domain/entities/monthly-revenue.entity';
import { CreateMonthlyRevenueDTO } from '@/application/dto/create-monthly-revenue.dto';
import { generateUUID } from '@/shared/utils/uuid';

export class CreateMonthlyRevenueUseCase {
  constructor(private monthlyRevenueRepository: IMonthlyRevenueRepository) {}

  async execute(dto: CreateMonthlyRevenueDTO, userId: string): Promise<MonthlyRevenue> {
    const now = new Date();
    const monthlyRevenue = new MonthlyRevenue(
      generateUUID(),
      userId,
      dto.name,
      dto.amount,
      dto.dayOfMonth,
      now,
      now
    );

    return await this.monthlyRevenueRepository.create(monthlyRevenue);
  }
}





