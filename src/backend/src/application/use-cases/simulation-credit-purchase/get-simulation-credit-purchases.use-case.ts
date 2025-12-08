import { ISimulationCreditPurchaseRepository } from '@/domain/repositories/simulation-credit-purchase.repository.interface';
import { SimulationCreditPurchase } from '@/domain/entities/simulation-credit-purchase.entity';

export class GetSimulationCreditPurchasesUseCase {
  constructor(private repository: ISimulationCreditPurchaseRepository) {}

  async execute(userId: string): Promise<SimulationCreditPurchase[]> {
    return await this.repository.findByUserId(userId);
  }
}





