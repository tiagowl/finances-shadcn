import { create } from 'zustand';
import type { Wish } from '@/types/api';
import { apiService } from '@/services/api';

interface WishState {
  wishes: Wish[];
  isLoading: boolean;
  error: string | null;
  fetchWishes: () => Promise<void>;
  addWish: (wish: Wish) => void;
  updateWish: (id: string, wish: Wish) => void;
  removeWish: (id: string) => void;
  deleteWish: (id: string) => Promise<void>;
}

export const useWishStore = create<WishState>((set) => ({
  wishes: [],
  isLoading: false,
  error: null,
  fetchWishes: async () => {
    set({ isLoading: true, error: null });
    try {
      const wishes = await apiService.getWishes();
      set({ wishes: Array.isArray(wishes) ? wishes : [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, wishes: [], isLoading: false });
    }
  },
  addWish: (wish) => {
    set((state) => ({ wishes: [wish, ...state.wishes] }));
  },
  updateWish: (id, updatedWish) => {
    set((state) => ({
      wishes: state.wishes.map((w) => (w.id === id ? updatedWish : w)),
    }));
  },
  removeWish: (id) => {
    set((state) => ({
      wishes: state.wishes.filter((w) => w.id !== id),
    }));
  },
  deleteWish: async (id) => {
    try {
      await apiService.deleteWish(id);
      set((state) => ({
        wishes: state.wishes.filter((w) => w.id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
}));





