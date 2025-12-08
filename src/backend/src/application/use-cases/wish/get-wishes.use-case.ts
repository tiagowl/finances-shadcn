import { IWishRepository } from '@/domain/repositories/wish.repository.interface';
import { Wish } from '@/domain/entities/wish.entity';

export class GetWishesUseCase {
  constructor(private repository: IWishRepository) {}

  async execute(userId: string): Promise<Wish[]> {
    return await this.repository.findByUserId(userId);
  }
}





