import { ISimulationCreditPurchaseRepository } from '@/domain/repositories/simulation-credit-purchase.repository.interface';
import { SimulationCreditPurchase } from '@/domain/entities/simulation-credit-purchase.entity';
import { CreateSimulationCreditPurchaseDTO } from '@/application/dto/create-simulation-credit-purchase.dto';
import { generateUUID } from '@/shared/utils/uuid';

export class CreateSimulationCreditPurchaseUseCase {
  constructor(private repository: ISimulationCreditPurchaseRepository) {}

  async execute(dto: CreateSimulationCreditPurchaseDTO, userId: string): Promise<SimulationCreditPurchase> {
    const now = new Date();
    const purchase = new SimulationCreditPurchase(
      generateUUID(),
      userId,
      dto.name,
      dto.amount,
      dto.installments,
      new Date(dto.purchaseDate),
      now,
      now
    );

    return await this.repository.create(purchase);
  }
}





