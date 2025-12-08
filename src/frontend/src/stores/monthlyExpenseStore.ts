import { create } from 'zustand';
import type { MonthlyExpense } from '@/types/api';
import { apiService } from '@/services/api';

interface MonthlyExpenseState {
  monthlyExpenses: MonthlyExpense[];
  isLoading: boolean;
  error: string | null;
  fetchMonthlyExpenses: () => Promise<void>;
  addMonthlyExpense: (expense: MonthlyExpense) => void;
  updateMonthlyExpense: (id: string, expense: MonthlyExpense) => void;
  removeMonthlyExpense: (id: string) => void;
  deleteMonthlyExpense: (id: string) => Promise<void>;
}

export const useMonthlyExpenseStore = create<MonthlyExpenseState>((set) => ({
  monthlyExpenses: [],
  isLoading: false,
  error: null,
  fetchMonthlyExpenses: async () => {
    set({ isLoading: true, error: null });
    try {
      const expenses = await apiService.getMonthlyExpenses();
      set({ monthlyExpenses: Array.isArray(expenses) ? expenses : [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, monthlyExpenses: [], isLoading: false });
    }
  },
  addMonthlyExpense: (expense) => {
    set((state) => ({ monthlyExpenses: [expense, ...state.monthlyExpenses] }));
  },
  updateMonthlyExpense: (id, updatedExpense) => {
    set((state) => ({
      monthlyExpenses: state.monthlyExpenses.map((e) => (e.id === id ? updatedExpense : e)),
    }));
  },
  removeMonthlyExpense: (id) => {
    set((state) => ({
      monthlyExpenses: state.monthlyExpenses.filter((e) => e.id !== id),
    }));
  },
  deleteMonthlyExpense: async (id) => {
    try {
      await apiService.deleteMonthlyExpense(id);
      set((state) => ({
        monthlyExpenses: state.monthlyExpenses.filter((e) => e.id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
}));





