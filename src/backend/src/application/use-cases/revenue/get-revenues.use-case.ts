import { IRevenueRepository } from '@/domain/repositories/revenue.repository.interface';
import { Revenue } from '@/domain/entities/revenue.entity';

export class GetRevenuesUseCase {
  constructor(private revenueRepository: IRevenueRepository) {}

  async execute(userId: string, limit?: number, offset?: number): Promise<Revenue[]> {
    return await this.revenueRepository.findByUserId(userId, limit, offset);
  }
}





