import { ISimulationCreditPurchaseRepository } from '@/domain/repositories/simulation-credit-purchase.repository.interface';
import { SimulationCreditPurchase } from '@/domain/entities/simulation-credit-purchase.entity';
import { CreateSimulationCreditPurchaseDTO } from '@/application/dto/create-simulation-credit-purchase.dto';
import { NotFoundError } from '@/shared/errors/not-found-error';

export class UpdateSimulationCreditPurchaseUseCase {
  constructor(private repository: ISimulationCreditPurchaseRepository) {}

  async execute(id: string, dto: CreateSimulationCreditPurchaseDTO, userId: string): Promise<SimulationCreditPurchase> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundError('SimulationCreditPurchase');
    }

    if (existing.userId !== userId) {
      throw new NotFoundError('SimulationCreditPurchase');
    }

    const updated = new SimulationCreditPurchase(
      existing.id,
      existing.userId,
      dto.name,
      dto.amount,
      dto.installments,
      new Date(dto.purchaseDate),
      existing.createdAt,
      new Date()
    );

    return await this.repository.update(updated);
  }
}





