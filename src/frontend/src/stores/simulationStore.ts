import { create } from 'zustand';
import type {
  SimulationExpense,
  SimulationRevenue,
  SimulationCreditPurchase,
  SimulationStats,
  MonthProjection,
} from '@/types/api';
import { apiService } from '@/services/api';

interface SimulationItem {
  id: string;
  type: 'expense' | 'revenue';
  name: string;
  amount: number;
  date: string;
  isMonthly?: boolean;
  isSimulation?: boolean;
}

interface SimulationState {
  expenses: SimulationExpense[];
  revenues: SimulationRevenue[];
  allExpenses: SimulationItem[];
  allRevenues: SimulationItem[];
  creditPurchases: SimulationCreditPurchase[];
  stats: SimulationStats | null;
  projection: MonthProjection[];
  isLoading: boolean;
  error: string | null;
  fetchExpenses: (year?: number, month?: number) => Promise<void>;
  fetchRevenues: (year?: number, month?: number) => Promise<void>;
  fetchAllExpenses: () => Promise<void>;
  fetchAllRevenues: () => Promise<void>;
  fetchCreditPurchases: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchProjection: (months?: number) => Promise<void>;
  addExpense: (expense: SimulationExpense) => void;
  addRevenue: (revenue: SimulationRevenue) => void;
  addCreditPurchase: (purchase: SimulationCreditPurchase) => void;
  updateExpense: (id: string, expense: SimulationExpense) => void;
  updateRevenue: (id: string, revenue: SimulationRevenue) => void;
  updateCreditPurchase: (id: string, purchase: SimulationCreditPurchase) => void;
  removeExpense: (id: string) => void;
  removeRevenue: (id: string) => void;
  removeCreditPurchase: (id: string) => void;
  deleteExpense: (id: string) => Promise<void>;
  deleteRevenue: (id: string) => Promise<void>;
  deleteCreditPurchase: (id: string) => Promise<void>;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  expenses: [],
  revenues: [],
  allExpenses: [],
  allRevenues: [],
  creditPurchases: [],
  stats: null,
  projection: [],
  isLoading: false,
  error: null,
  fetchExpenses: async (year?, month?) => {
    set({ isLoading: true, error: null });
    try {
      const expenses = await apiService.getSimulationExpenses(year, month);
      set({ expenses: Array.isArray(expenses) ? expenses : [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, expenses: [], isLoading: false });
    }
  },
  fetchRevenues: async (year?, month?) => {
    set({ isLoading: true, error: null });
    try {
      const revenues = await apiService.getSimulationRevenues(year, month);
      set({ revenues: Array.isArray(revenues) ? revenues : [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, revenues: [], isLoading: false });
    }
  },
  fetchAllExpenses: async () => {
    set({ isLoading: true, error: null });
    try {
      const expenses = await apiService.getAllSimulationExpenses();
      const formattedExpenses: SimulationItem[] = expenses.map((e) => ({
        id: e.id,
        type: 'expense' as const,
        name: e.name,
        amount: e.amount,
        date: e.date,
        isMonthly: e.isMonthly,
        isSimulation: e.isSimulation,
      }));
      set({ allExpenses: formattedExpenses, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, allExpenses: [], isLoading: false });
    }
  },
  fetchAllRevenues: async () => {
    set({ isLoading: true, error: null });
    try {
      const revenues = await apiService.getAllSimulationRevenues();
      const formattedRevenues: SimulationItem[] = revenues.map((r) => ({
        id: r.id,
        type: 'revenue' as const,
        name: r.name,
        amount: r.amount,
        date: r.date,
        isMonthly: r.isMonthly,
        isSimulation: r.isSimulation,
      }));
      set({ allRevenues: formattedRevenues, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, allRevenues: [], isLoading: false });
    }
  },
  fetchCreditPurchases: async () => {
    set({ isLoading: true, error: null });
    try {
      const purchases = await apiService.getSimulationCreditPurchases();
      set({ creditPurchases: Array.isArray(purchases) ? purchases : [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, creditPurchases: [], isLoading: false });
    }
  },
  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const stats = await apiService.getSimulationStats();
      set({ stats, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  fetchProjection: async (months = 12) => {
    set({ isLoading: true, error: null });
    try {
      const projection = await apiService.getSimulationProjection(months);
      set({ projection: Array.isArray(projection) ? projection : [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, projection: [], isLoading: false });
    }
  },
  addExpense: (expense) => {
    set((state) => ({ expenses: [expense, ...state.expenses] }));
  },
  addRevenue: (revenue) => {
    set((state) => ({ revenues: [revenue, ...state.revenues] }));
  },
  addCreditPurchase: (purchase) => {
    set((state) => ({ creditPurchases: [purchase, ...state.creditPurchases] }));
  },
  updateExpense: (id, updatedExpense) => {
    set((state) => ({
      expenses: state.expenses.map((e) => (e.id === id ? updatedExpense : e)),
    }));
  },
  updateRevenue: (id, updatedRevenue) => {
    set((state) => ({
      revenues: state.revenues.map((r) => (r.id === id ? updatedRevenue : r)),
    }));
  },
  updateCreditPurchase: (id, updatedPurchase) => {
    set((state) => ({
      creditPurchases: state.creditPurchases.map((p) => (p.id === id ? updatedPurchase : p)),
    }));
  },
  removeExpense: (id) => {
    set((state) => ({
      expenses: state.expenses.filter((e) => e.id !== id),
    }));
  },
  removeRevenue: (id) => {
    set((state) => ({
      revenues: state.revenues.filter((r) => r.id !== id),
    }));
  },
  removeCreditPurchase: (id) => {
    set((state) => ({
      creditPurchases: state.creditPurchases.filter((p) => p.id !== id),
    }));
  },
  deleteExpense: async (id) => {
    try {
      await apiService.deleteSimulationExpense(id);
      set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== id),
        allExpenses: state.allExpenses.filter((e) => e.id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
  deleteRevenue: async (id) => {
    try {
      await apiService.deleteSimulationRevenue(id);
      set((state) => ({
        revenues: state.revenues.filter((r) => r.id !== id),
        allRevenues: state.allRevenues.filter((r) => r.id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
  deleteCreditPurchase: async (id) => {
    try {
      await apiService.deleteSimulationCreditPurchase(id);
      set((state) => ({
        creditPurchases: state.creditPurchases.filter((p) => p.id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
}));





