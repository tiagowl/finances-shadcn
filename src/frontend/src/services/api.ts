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

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: '/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor para tratar erros
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login', data);
    return response.data;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/register', data);
    return response.data;
  }

  // Revenues
  async getRevenues(): Promise<Revenue[]> {
    const response = await this.api.get<{ data: Revenue[] }>('/revenues');
    // A API retorna { data: [...] }, então extraímos a propriedade 'data'
    return response.data.data || [];
  }

  async getRevenue(id: string): Promise<Revenue> {
    const response = await this.api.get<Revenue>(`/revenues/${id}`);
    return response.data;
  }

  async createRevenue(data: CreateRevenueRequest): Promise<Revenue> {
    const response = await this.api.post<Revenue>('/revenues', data);
    return response.data;
  }

  async updateRevenue(id: string, data: CreateRevenueRequest): Promise<Revenue> {
    const response = await this.api.put<Revenue>(`/revenues/${id}`, data);
    return response.data;
  }

  async deleteRevenue(id: string): Promise<void> {
    await this.api.delete(`/revenues/${id}`);
  }

  // Expenses
  async getExpenses(): Promise<Expense[]> {
    const response = await this.api.get<{ data: Expense[] }>('/expenses');
    // A API retorna { data: [...] }, então extraímos a propriedade 'data'
    return response.data.data || [];
  }

  async createExpense(data: CreateExpenseRequest): Promise<Expense> {
    const response = await this.api.post<Expense>('/expenses', data);
    return response.data;
  }

  async updateExpense(id: string, data: CreateExpenseRequest): Promise<Expense> {
    const response = await this.api.put<Expense>(`/expenses/${id}`, data);
    return response.data;
  }

  async deleteExpense(id: string): Promise<void> {
    await this.api.delete(`/expenses/${id}`);
  }

  // Categories
  async getCategories(): Promise<CategoriesResponse> {
    const response = await this.api.get<CategoriesResponse>('/categories');
    return response.data;
  }

  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    const response = await this.api.post<Category>('/categories', data);
    return response.data;
  }

  async updateCategory(id: string, data: CreateCategoryRequest): Promise<Category> {
    const response = await this.api.put<Category>(`/categories/${id}`, data);
    return response.data;
  }

  async deleteCategory(id: string): Promise<void> {
    await this.api.delete(`/categories/${id}`);
  }

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.api.get<DashboardStats>('/dashboard/stats');
    return response.data;
  }

  // Monthly Expenses
  async getMonthlyExpenses(): Promise<MonthlyExpense[]> {
    const response = await this.api.get<{ data: MonthlyExpense[] }>('/monthly-expenses');
    return response.data.data || [];
  }

  async createMonthlyExpense(data: CreateMonthlyExpenseRequest): Promise<MonthlyExpense> {
    const response = await this.api.post<MonthlyExpense>('/monthly-expenses', data);
    return response.data;
  }

  async updateMonthlyExpense(id: string, data: CreateMonthlyExpenseRequest): Promise<MonthlyExpense> {
    const response = await this.api.put<MonthlyExpense>(`/monthly-expenses/${id}`, data);
    return response.data;
  }

  async deleteMonthlyExpense(id: string): Promise<void> {
    await this.api.delete(`/monthly-expenses/${id}`);
  }

  // Monthly Revenues
  async getMonthlyRevenues(): Promise<MonthlyRevenue[]> {
    const response = await this.api.get<{ data: MonthlyRevenue[] }>('/monthly-revenues');
    return response.data.data || [];
  }

  async createMonthlyRevenue(data: CreateMonthlyRevenueRequest): Promise<MonthlyRevenue> {
    const response = await this.api.post<MonthlyRevenue>('/monthly-revenues', data);
    return response.data;
  }

  async updateMonthlyRevenue(id: string, data: CreateMonthlyRevenueRequest): Promise<MonthlyRevenue> {
    const response = await this.api.put<MonthlyRevenue>(`/monthly-revenues/${id}`, data);
    return response.data;
  }

  async deleteMonthlyRevenue(id: string): Promise<void> {
    await this.api.delete(`/monthly-revenues/${id}`);
  }

  // Simulation
  async getSimulationExpenses(year?: number, month?: number): Promise<SimulationExpense[]> {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    const query = params.toString();
    const response = await this.api.get<{ data: SimulationExpense[] }>(
      `/simulation/expenses${query ? `?${query}` : ''}`
    );
    return response.data.data || [];
  }

  async createSimulationExpense(data: CreateSimulationExpenseRequest): Promise<SimulationExpense> {
    const response = await this.api.post<SimulationExpense>('/simulation/expenses', data);
    return response.data;
  }

  async updateSimulationExpense(id: string, data: CreateSimulationExpenseRequest): Promise<SimulationExpense> {
    const response = await this.api.put<SimulationExpense>(`/simulation/expenses/${id}`, data);
    return response.data;
  }

  async deleteSimulationExpense(id: string): Promise<void> {
    await this.api.delete(`/simulation/expenses/${id}`);
  }

  async getSimulationRevenues(year?: number, month?: number): Promise<SimulationRevenue[]> {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    const query = params.toString();
    const response = await this.api.get<{ data: SimulationRevenue[] }>(
      `/simulation/revenues${query ? `?${query}` : ''}`
    );
    return response.data.data || [];
  }

  async createSimulationRevenue(data: CreateSimulationRevenueRequest): Promise<SimulationRevenue> {
    const response = await this.api.post<SimulationRevenue>('/simulation/revenues', data);
    return response.data;
  }

  async updateSimulationRevenue(id: string, data: CreateSimulationRevenueRequest): Promise<SimulationRevenue> {
    const response = await this.api.put<SimulationRevenue>(`/simulation/revenues/${id}`, data);
    return response.data;
  }

  async deleteSimulationRevenue(id: string): Promise<void> {
    await this.api.delete(`/simulation/revenues/${id}`);
  }

  async getSimulationCreditPurchases(): Promise<SimulationCreditPurchase[]> {
    const response = await this.api.get<{ data: SimulationCreditPurchase[] }>('/simulation/credit-purchases');
    return response.data.data || [];
  }

  async createSimulationCreditPurchase(data: CreateSimulationCreditPurchaseRequest): Promise<SimulationCreditPurchase> {
    const response = await this.api.post<SimulationCreditPurchase>('/simulation/credit-purchases', data);
    return response.data;
  }

  async updateSimulationCreditPurchase(
    id: string,
    data: CreateSimulationCreditPurchaseRequest
  ): Promise<SimulationCreditPurchase> {
    const response = await this.api.put<SimulationCreditPurchase>(`/simulation/credit-purchases/${id}`, data);
    return response.data;
  }

  async deleteSimulationCreditPurchase(id: string): Promise<void> {
    await this.api.delete(`/simulation/credit-purchases/${id}`);
  }

  async getSimulationStats(): Promise<SimulationStats> {
    const response = await this.api.get<SimulationStats>('/simulation/stats');
    return response.data;
  }

  async getSimulationProjection(months: number = 12): Promise<MonthProjection[]> {
    const response = await this.api.get<{ data: MonthProjection[] }>(`/simulation/projection?months=${months}`);
    return response.data.data || [];
  }

  async getAllSimulationExpenses(): Promise<Array<SimulationExpense & { isMonthly?: boolean; isSimulation?: boolean }>> {
    const response = await this.api.get<{ data: Array<SimulationExpense & { isMonthly?: boolean; isSimulation?: boolean }> }>('/simulation/all-expenses');
    return response.data.data || [];
  }

  async getAllSimulationRevenues(): Promise<Array<SimulationRevenue & { isMonthly?: boolean; isSimulation?: boolean }>> {
    const response = await this.api.get<{ data: Array<SimulationRevenue & { isMonthly?: boolean; isSimulation?: boolean }> }>('/simulation/all-revenues');
    return response.data.data || [];
  }

  // Wishes
  async getWishes(): Promise<Wish[]> {
    const response = await this.api.get<{ data: Wish[] }>('/wishes');
    return response.data.data || [];
  }

  async createWish(data: CreateWishRequest): Promise<Wish> {
    const response = await this.api.post<Wish>('/wishes', data);
    return response.data;
  }

  async updateWish(id: string, data: CreateWishRequest): Promise<Wish> {
    const response = await this.api.put<Wish>(`/wishes/${id}`, data);
    return response.data;
  }

  async deleteWish(id: string): Promise<void> {
    await this.api.delete(`/wishes/${id}`);
  }

  async purchaseWish(id: string, amount?: number, date?: string): Promise<{
    expense: Expense;
    budgetExceeded: boolean;
    remaining: number;
  }> {
    const response = await this.api.post<{
      expense: Expense;
      budgetExceeded: boolean;
      remaining: number;
    }>(`/wishes/${id}/purchase`, { amount, date });
    return response.data;
  }

  // Shopping List
  async getShoppingListItems(): Promise<ShoppingListItem[]> {
    const response = await this.api.get<{ data: ShoppingListItem[] }>('/shopping-list');
    return response.data.data || [];
  }

  async getShoppingListStats(): Promise<ShoppingListStats> {
    const response = await this.api.get<ShoppingListStats>('/shopping-list/stats');
    return response.data;
  }

  async createShoppingListItem(data: CreateShoppingListItemRequest): Promise<ShoppingListItem> {
    const response = await this.api.post<ShoppingListItem>('/shopping-list', data);
    return response.data;
  }

  async updateShoppingListItem(id: string, data: CreateShoppingListItemRequest): Promise<ShoppingListItem> {
    const response = await this.api.put<ShoppingListItem>(`/shopping-list/${id}`, data);
    return response.data;
  }

  async toggleShoppingListItem(id: string): Promise<ShoppingListItem> {
    const response = await this.api.patch<ShoppingListItem>(`/shopping-list/${id}/toggle`);
    return response.data;
  }

  async deleteShoppingListItem(id: string): Promise<void> {
    await this.api.delete(`/shopping-list/${id}`);
  }

  async clearShoppingList(): Promise<void> {
    await this.api.delete('/shopping-list');
  }

  // Notifications
  async getNotifications(): Promise<NotificationsResponse> {
    const response = await this.api.get<NotificationsResponse>('/notifications');
    return response.data;
  }
}

export const apiService = new ApiService();

