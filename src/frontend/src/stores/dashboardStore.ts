import { create } from 'zustand';
import type { DashboardStats } from '@/types/api';
import { apiService } from '@/services/api';

interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  isLoading: false,
  error: null,
  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const stats = await apiService.getDashboardStats();
      set({ stats, isLoading: false });
    } catch (error: any) {
      // Even on error, set default stats to show empty state
      set({
        stats: {
          totalRevenue: 0,
          totalExpense: 0,
          balance: 0,
          recentTransactions: [],
        },
        error: error.message,
        isLoading: false,
      });
    }
  },
}));





