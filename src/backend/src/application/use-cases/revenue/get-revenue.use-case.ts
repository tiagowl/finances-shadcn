import { IRevenueRepository } from '@/domain/repositories/revenue.repository.interface';
import { Revenue } from '@/domain/entities/revenue.entity';
import { NotFoundError } from '@/shared/errors/not-found-error';

export class GetRevenueUseCase {
  constructor(private revenueRepository: IRevenueRepository) {}

  async execute(id: string, userId: string): Promise<Revenue> {
    const revenue = await this.revenueRepository.findById(id);

    if (!revenue) {
      throw new NotFoundError('Revenue');
    }

    if (revenue.userId !== userId) {
      throw new NotFoundError('Revenue');
    }

    return revenue;
  }
}





