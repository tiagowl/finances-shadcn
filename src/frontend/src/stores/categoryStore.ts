import { create } from 'zustand';
import type { Category, CategoryStats } from '@/types/api';
import { apiService } from '@/services/api';

interface CategoryState {
  categories: Category[];
  stats: CategoryStats | null;
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, category: Category) => void;
  removeCategory: (id: string) => void;
  deleteCategory: (id: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  stats: null,
  isLoading: false,
  error: null,
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getCategories();
      set({
        categories: Array.isArray(response.data) ? response.data : [],
        stats: response.stats || null,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, categories: [], stats: null, isLoading: false });
    }
  },
  addCategory: (category) => {
    set((state) => ({ categories: [...state.categories, category] }));
  },
  updateCategory: (id, updatedCategory) => {
    set((state) => ({
      categories: state.categories.map((c) => (c.id === id ? updatedCategory : c)),
    }));
  },
  removeCategory: (id) => {
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    }));
  },
  deleteCategory: async (id) => {
    try {
      await apiService.deleteCategory(id);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
}));

