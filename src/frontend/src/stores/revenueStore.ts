import { create } from 'zustand';
import type { Revenue } from '@/types/api';
import { apiService } from '@/services/api';

interface RevenueState {
  revenues: Revenue[];
  isLoading: boolean;
  error: string | null;
  fetchRevenues: () => Promise<void>;
  addRevenue: (revenue: Revenue) => void;
  updateRevenue: (id: string, revenue: Revenue) => void;
  removeRevenue: (id: string) => void;
  deleteRevenue: (id: string) => Promise<void>;
}

export const useRevenueStore = create<RevenueState>((set) => ({
  revenues: [],
  isLoading: false,
  error: null,
  fetchRevenues: async () => {
    set({ isLoading: true, error: null });
    try {
      const revenues = await apiService.getRevenues();
      set({ revenues: Array.isArray(revenues) ? revenues : [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, revenues: [], isLoading: false });
    }
  },
  addRevenue: (revenue) => {
    set((state) => ({ revenues: [revenue, ...state.revenues] }));
  },
  updateRevenue: (id, updatedRevenue) => {
    set((state) => ({
      revenues: state.revenues.map((r) => (r.id === id ? updatedRevenue : r)),
    }));
  },
  removeRevenue: (id) => {
    set((state) => ({
      revenues: state.revenues.filter((r) => r.id !== id),
    }));
  },
  deleteRevenue: async (id) => {
    try {
      await apiService.deleteRevenue(id);
      set((state) => ({
        revenues: state.revenues.filter((r) => r.id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
}));

