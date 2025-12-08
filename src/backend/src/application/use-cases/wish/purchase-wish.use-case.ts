import { IWishRepository } from '@/domain/repositories/wish.repository.interface';
import { IExpenseRepository } from '@/domain/repositories/expense.repository.interface';
import { ICategoryRepository } from '@/domain/repositories/category.repository.interface';
import { Expense } from '@/domain/entities/expense.entity';
import { NotFoundError } from '@/shared/errors/not-found-error';
import { generateUUID } from '@/shared/utils/uuid';

export interface PurchaseWishResult {
  expense: Expense;
  budgetExceeded: boolean;
  remaining: number;
}

export class PurchaseWishUseCase {
  constructor(
    private wishRepository: IWishRepository,
    private expenseRepository: IExpenseRepository,
    private categoryRepository: ICategoryRepository
  ) {}

  async execute(wishId: string, userId: string, amount?: number, date?: Date): Promise<PurchaseWishResult> {
    const wish = await this.wishRepository.findById(wishId);

    if (!wish) {
      throw new NotFoundError('Wish');
    }

    if (wish.userId !== userId) {
      throw new NotFoundError('Wish');
    }

    // Get final amount - use provided amount or wish amount, or throw error if neither exists
    const finalAmount = amount || wish.amount;
    if (!finalAmount || finalAmount <= 0) {
      throw new Error('Wish must have an amount to be purchased. Please provide an amount.');
    }

    // Category is optional - can be null
    let category = null;
    let budgetExceeded = false;
    let remaining = 0;

    if (wish.categoryId) {
      category = await this.categoryRepository.findById(wish.categoryId);
      if (!category) {
        throw new NotFoundError('Category');
      }

      // Check budget for current month only if category exists
      const now = date || new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      const totalSpentThisMonth = await this.expenseRepository.getTotalByCategoryIdAndMonth(
        wish.categoryId,
        year,
        month
      );

      remaining = category.budgetMax - totalSpentThisMonth;
      budgetExceeded = totalSpentThisMonth + finalAmount > category.budgetMax;
    }

    // Create expense
    const now = date || new Date();
    
    // Prepare notes with purchase link, truncating if necessary to fit 500 character limit
    let notes: string | undefined = undefined;
    if (wish.purchaseLink) {
      const linkPrefix = 'Link: ';
      const maxLinkLength = 500 - linkPrefix.length;
      const truncatedLink = wish.purchaseLink.length > maxLinkLength 
        ? wish.purchaseLink.substring(0, maxLinkLength) 
        : wish.purchaseLink;
      notes = `${linkPrefix}${truncatedLink}`;
    }
    
    const expense = new Expense(
      generateUUID(),
      userId,
      wish.categoryId || null, // Allow null category
      wish.name,
      finalAmount,
      now,
      notes,
      now,
      now
    );

    const createdExpense = await this.expenseRepository.create(expense);

    // Delete wish
    await this.wishRepository.delete(wishId);

    return {
      expense: createdExpense,
      budgetExceeded,
      remaining: remaining - finalAmount,
    };
  }
}



