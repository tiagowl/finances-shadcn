import { IWishRepository } from '@/domain/repositories/wish.repository.interface';
import { NotFoundError } from '@/shared/errors/not-found-error';

export class DeleteWishUseCase {
  constructor(private repository: IWishRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    const wish = await this.repository.findById(id);

    if (!wish) {
      throw new NotFoundError('Wish');
    }

    if (wish.userId !== userId) {
      throw new NotFoundError('Wish');
    }

    await this.repository.delete(id);
  }
}





