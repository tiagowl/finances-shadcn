import { Wish } from '../entities/wish.entity';

export interface IWishRepository {
  create(wish: Wish): Promise<Wish>;
  findById(id: string): Promise<Wish | null>;
  findByUserId(userId: string): Promise<Wish[]>;
  update(wish: Wish): Promise<Wish>;
  delete(id: string): Promise<void>;
}





