import { ISimulationCreditPurchaseRepository } from '@/domain/repositories/simulation-credit-purchase.repository.interface';
import { NotFoundError } from '@/shared/errors/not-found-error';

export class DeleteSimulationCreditPurchaseUseCase {
  constructor(private repository: ISimulationCreditPurchaseRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    const purchase = await this.repository.findById(id);

    if (!purchase) {
      throw new NotFoundError('SimulationCreditPurchase');
    }

    if (purchase.userId !== userId) {
      throw new NotFoundError('SimulationCreditPurchase');
    }

    await this.repository.delete(id);
  }
}





