import type { Category as ApiCategory } from './api';

export type TransactionType = 'revenue' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  name: string;
  amount: number;
  date: string;
  notes?: string;
  categoryId?: string;
  categoryName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryWithStats extends ApiCategory {
  totalSpent: number;
  remaining: number;
  percentageUsed: number;
}

export type Category = ApiCategory;

