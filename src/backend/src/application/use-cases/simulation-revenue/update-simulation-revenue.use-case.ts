import { ISimulationRevenueRepository } from '@/domain/repositories/simulation-revenue.repository.interface';
import { SimulationRevenue } from '@/domain/entities/simulation-revenue.entity';
import { CreateSimulationRevenueDTO } from '@/application/dto/create-simulation-revenue.dto';
import { NotFoundError } from '@/shared/errors/not-found-error';

export class UpdateSimulationRevenueUseCase {
  constructor(private repository: ISimulationRevenueRepository) {}

  async execute(id: string, dto: CreateSimulationRevenueDTO, userId: string): Promise<SimulationRevenue> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundError('SimulationRevenue');
    }

    if (existing.userId !== userId) {
      throw new NotFoundError('SimulationRevenue');
    }

    const updated = new SimulationRevenue(
      existing.id,
      existing.userId,
      dto.name,
      dto.amount,
      new Date(dto.date),
      existing.createdAt,
      new Date()
    );

    return await this.repository.update(updated);
  }
}





