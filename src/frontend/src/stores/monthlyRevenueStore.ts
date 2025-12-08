import { create } from 'zustand';
import type { MonthlyRevenue } from '@/types/api';
import { apiService } from '@/services/api';

interface MonthlyRevenueState {
  monthlyRevenues: MonthlyRevenue[];
  isLoading: boolean;
  error: string | null;
  fetchMonthlyRevenues: () => Promise<void>;
  addMonthlyRevenue: (revenue: MonthlyRevenue) => void;
  updateMonthlyRevenue: (id: string, revenue: MonthlyRevenue) => void;
  removeMonthlyRevenue: (id: string) => void;
  deleteMonthlyRevenue: (id: string) => Promise<void>;
}

export const useMonthlyRevenueStore = create<MonthlyRevenueState>((set) => ({
  monthlyRevenues: [],
  isLoading: false,
  error: null,
  fetchMonthlyRevenues: async () => {
    set({ isLoading: true, error: null });
    try {
      const revenues = await apiService.getMonthlyRevenues();
      set({ monthlyRevenues: Array.isArray(revenues) ? revenues : [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, monthlyRevenues: [], isLoading: false });
    }
  },
  addMonthlyRevenue: (revenue) => {
    set((state) => ({ monthlyRevenues: [revenue, ...state.monthlyRevenues] }));
  },
  updateMonthlyRevenue: (id, updatedRevenue) => {
    set((state) => ({
      monthlyRevenues: state.monthlyRevenues.map((r) => (r.id === id ? updatedRevenue : r)),
    }));
  },
  removeMonthlyRevenue: (id) => {
    set((state) => ({
      monthlyRevenues: state.monthlyRevenues.filter((r) => r.id !== id),
    }));
  },
  deleteMonthlyRevenue: async (id) => {
    try {
      await apiService.deleteMonthlyRevenue(id);
      set((state) => ({
        monthlyRevenues: state.monthlyRevenues.filter((r) => r.id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
}));





