import { create } from 'zustand';
import type { ShoppingListItem, ShoppingListStats } from '@/types/api';
import { apiService } from '@/services/api';

interface ShoppingListState {
  items: ShoppingListItem[];
  stats: ShoppingListStats | null;
  isLoading: boolean;
  error: string | null;
  fetchItems: () => Promise<void>;
  fetchStats: () => Promise<void>;
  addItem: (item: ShoppingListItem) => void;
  updateItem: (id: string, item: ShoppingListItem) => void;
  toggleItem: (id: string) => Promise<void>;
  removeItem: (id: string) => void;
  deleteItem: (id: string) => Promise<void>;
  clearList: () => Promise<void>;
}

export const useShoppingListStore = create<ShoppingListState>((set) => ({
  items: [],
  stats: null,
  isLoading: false,
  error: null,
  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await apiService.getShoppingListItems();
      set({ items: Array.isArray(items) ? items : [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, items: [], isLoading: false });
    }
  },
  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const stats = await apiService.getShoppingListStats();
      set({ stats, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  addItem: (item) => {
    set((state) => ({ items: [item, ...state.items] }));
  },
  updateItem: (id, updatedItem) => {
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? updatedItem : item)),
    }));
  },
  toggleItem: async (id) => {
    try {
      const updatedItem = await apiService.toggleShoppingListItem(id);
      set((state) => ({
        items: state.items.map((item) => (item.id === id ? updatedItem : item)),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },
  deleteItem: async (id) => {
    try {
      await apiService.deleteShoppingListItem(id);
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
  clearList: async () => {
    try {
      await apiService.clearShoppingList();
      set({ items: [] });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
}));





