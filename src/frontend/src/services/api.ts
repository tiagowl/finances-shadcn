import axios, { AxiosError, AxiosInstance } from 'axios';
import type {
  AuthResponse,
  CreateCategoryRequest,
  CreateExpenseRequest,
  CreateRevenueRequest,
  DashboardStats,
  Expense,
  Revenue,
  Category,
  CategoriesResponse,
  LoginRequest,
  RegisterRequest,
  ApiError,
  MonthlyExpense,
  MonthlyRevenue,
  SimulationExpense,
  SimulationRevenue,
  SimulationCreditPurchase,
  SimulationStats,
  MonthProjection,
  Wish,
  ShoppingListItem,
  ShoppingListStats,
  CreateMonthlyExpenseRequest,
  CreateMonthlyRevenueRequest,
  CreateSimulationExpenseRequest,
  CreateSimulationRevenueRequest,
  CreateSimulationCreditPurchaseRequest,
  CreateWishRequest,
  CreateShoppingListItemRequest,
  NotificationsResponse,
} from '@/types/api';

// Import Firebase service instead of API service
import { firebaseService } from './firebaseService';

// Export firebaseService as apiService for backward compatibility
export const apiService = firebaseService;

