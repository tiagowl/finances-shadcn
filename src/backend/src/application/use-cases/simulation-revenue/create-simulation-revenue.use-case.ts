import { ISimulationRevenueRepository } from '@/domain/repositories/simulation-revenue.repository.interface';
import { SimulationRevenue } from '@/domain/entities/simulation-revenue.entity';
import { CreateSimulationRevenueDTO } from '@/application/dto/create-simulation-revenue.dto';
import { generateUUID } from '@/shared/utils/uuid';

export class CreateSimulationRevenueUseCase {
  constructor(private repository: ISimulationRevenueRepository) {}

  async execute(dto: CreateSimulationRevenueDTO, userId: string): Promise<SimulationRevenue> {
    const now = new Date();
    const revenue = new SimulationRevenue(
      generateUUID(),
      userId,
      dto.name,
      dto.amount,
      new Date(dto.date),
      now,
      now
    );

    return await this.repository.create(revenue);
  }
}





