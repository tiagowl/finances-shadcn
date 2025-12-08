import { ISimulationRevenueRepository } from '@/domain/repositories/simulation-revenue.repository.interface';
import { NotFoundError } from '@/shared/errors/not-found-error';

export class DeleteSimulationRevenueUseCase {
  constructor(private repository: ISimulationRevenueRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    const revenue = await this.repository.findById(id);

    if (!revenue) {
      throw new NotFoundError('SimulationRevenue');
    }

    if (revenue.userId !== userId) {
      throw new NotFoundError('SimulationRevenue');
    }

    await this.repository.delete(id);
  }
}





