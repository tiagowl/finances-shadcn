import { create } from 'zustand';
import type { Expense } from '@/types/api';
import { apiService } from '@/services/api';

interface ExpenseState {
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
  fetchExpenses: () => Promise<void>;
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, expense: Expense) => void;
  removeExpense: (id: string) => void;
  deleteExpense: (id: string) => Promise<void>;
}

export const useExpenseStore = create<ExpenseState>((set) => ({
  expenses: [],
  isLoading: false,
  error: null,
  fetchExpenses: async () => {
    set({ isLoading: true, error: null });
    try {
      const expenses = await apiService.getExpenses();
      set({ expenses: Array.isArray(expenses) ? expenses : [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, expenses: [], isLoading: false });
    }
  },
  addExpense: (expense) => {
    set((state) => ({ expenses: [expense, ...state.expenses] }));
  },
  updateExpense: (id, updatedExpense) => {
    set((state) => ({
      expenses: state.expenses.map((e) => (e.id === id ? updatedExpense : e)),
    }));
  },
  removeExpense: (id) => {
    set((state) => ({
      expenses: state.expenses.filter((e) => e.id !== id),
    }));
  },
  deleteExpense: async (id) => {
    try {
      await apiService.deleteExpense(id);
      set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
}));

