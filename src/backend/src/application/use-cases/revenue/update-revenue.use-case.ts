import { IRevenueRepository } from '@/domain/repositories/revenue.repository.interface';
import { Revenue } from '@/domain/entities/revenue.entity';
import { CreateRevenueDTO } from '@/application/dto/create-revenue.dto';
import { NotFoundError } from '@/shared/errors/not-found-error';

export class UpdateRevenueUseCase {
  constructor(private revenueRepository: IRevenueRepository) {}

  async execute(id: string, dto: CreateRevenueDTO, userId: string): Promise<Revenue> {
    const existingRevenue = await this.revenueRepository.findById(id);

    if (!existingRevenue) {
      throw new NotFoundError('Revenue');
    }

    if (existingRevenue.userId !== userId) {
      throw new NotFoundError('Revenue');
    }

    const updatedRevenue = new Revenue(
      existingRevenue.id,
      existingRevenue.userId,
      dto.name,
      dto.amount,
      dto.date,
      dto.notes,
      existingRevenue.createdAt,
      new Date()
    );

    return await this.revenueRepository.update(updatedRevenue);
  }
}





