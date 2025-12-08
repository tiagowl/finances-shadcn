import { IRevenueRepository } from '@/domain/repositories/revenue.repository.interface';
import { Revenue } from '@/domain/entities/revenue.entity';
import { CreateRevenueDTO } from '@/application/dto/create-revenue.dto';
import { generateUUID } from '@/shared/utils/uuid';

export class CreateRevenueUseCase {
  constructor(private revenueRepository: IRevenueRepository) {}

  async execute(dto: CreateRevenueDTO, userId: string): Promise<Revenue> {
    const now = new Date();
    const revenue = new Revenue(
      generateUUID(),
      userId,
      dto.name,
      dto.amount,
      dto.date,
      dto.notes,
      now,
      now
    );

    return await this.revenueRepository.create(revenue);
  }
}

