import { IRevenueRepository } from '@/domain/repositories/revenue.repository.interface';
import { NotFoundError } from '@/shared/errors/not-found-error';

export class DeleteRevenueUseCase {
  constructor(private revenueRepository: IRevenueRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    const revenue = await this.revenueRepository.findById(id);

    if (!revenue) {
      throw new NotFoundError('Revenue');
    }

    if (revenue.userId !== userId) {
      throw new NotFoundError('Revenue');
    }

    await this.revenueRepository.delete(id);
  }
}





