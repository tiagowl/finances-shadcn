export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Revenue {
  id: string;
  userId: string;
  name: string;
  amount: number;
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  userId: string;
  categoryId: string | null;
  name: string;
  amount: number;
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  budgetMax: number;
  totalSpent?: number;
  remaining?: number;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryStats {
  totalBudgetMax: number;
  totalSpent: number;
}

export interface CategoriesResponse {
  data: Category[];
  stats?: CategoryStats;
}

export interface RecentTransaction {
  id: string;
  type: 'revenue' | 'expense';
  name: string;
  amount: number;
  date: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalExpense: number;
  balance: number;
  recentTransactions: RecentTransaction[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface CreateRevenueRequest {
  name: string;
  amount: number;
  date: string;
  notes?: string;
}

export interface CreateExpenseRequest {
  name: string;
  amount: number;
  date: string;
  categoryId?: string | null;
  notes?: string;
}

export interface CreateCategoryRequest {
  name: string;
  budgetMax: number;
  color?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface MonthlyExpense {
  id: string;
  userId: string;
  name: string;
  amount: number;
  dayOfMonth: number;
  cancellationLink?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyRevenue {
  id: string;
  userId: string;
  name: string;
  amount: number;
  dayOfMonth: number;
  createdAt: string;
  updatedAt: string;
}

export interface SimulationExpense {
  id: string;
  userId: string;
  name: string;
  amount: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface SimulationRevenue {
  id: string;
  userId: string;
  name: string;
  amount: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface SimulationCreditPurchase {
  id: string;
  userId: string;
  name: string;
  amount: number;
  installments: number;
  purchaseDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface SimulationStats {
  totalRevenue: number;
  totalCreditSpent: number;
  totalExpense: number;
  averageBalance: number;
}

export interface MonthProjection {
  year: number;
  month: number;
  expenses: number;
  revenues: number;
  creditPayments: number;
  balance: number;
}

export interface Wish {
  id: string;
  userId: string;
  name: string;
  purchaseLink?: string | null;
  categoryId?: string | null;
  amount?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingListItem {
  id: string;
  userId: string;
  name: string;
  price: number;
  isPurchased: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingListStats {
  totalItems: number;
  purchasedItems: number;
  pendingItems: number;
  totalPrice: number;
}

export interface CreateMonthlyExpenseRequest {
  name: string;
  amount: number;
  dayOfMonth: number;
  cancellationLink?: string | null;
}

export interface CreateMonthlyRevenueRequest {
  name: string;
  amount: number;
  dayOfMonth: number;
}

export interface CreateSimulationExpenseRequest {
  name: string;
  amount: number;
  date: string;
}

export interface CreateSimulationRevenueRequest {
  name: string;
  amount: number;
  date: string;
}

export interface CreateSimulationCreditPurchaseRequest {
  name: string;
  amount: number;
  installments: number;
  purchaseDate: string;
}

export interface CreateWishRequest {
  name: string;
  purchaseLink?: string | null;
  categoryId?: string | null;
  amount?: number | null;
}

export interface CreateShoppingListItemRequest {
  name: string;
  price: number;
}

export interface Notification {
  id: string;
  userId?: string;
  type: 'budget_warning' | 'budget_exceeded' | 'monthly_expense_coming';
  title: string;
  message: string;
  categoryId?: string;
  monthlyExpenseId?: string;
  severity: 'warning' | 'error' | 'info';
  createdAt: string;
}

export interface NotificationsResponse {
  data: Notification[];
  count: number;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    errors?: Array<{ field: string; message: string }>;
  };
}

