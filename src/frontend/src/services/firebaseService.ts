import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  writeBatch,
  QueryConstraint,
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
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
  User,
  Notification as ApiNotification,
} from '@/types/api';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';

// Helper to convert Firestore timestamp to ISO string
const toISOString = (timestamp: Timestamp | Date | string | undefined): string => {
  if (!timestamp) return new Date().toISOString();
  if (timestamp instanceof Timestamp) return timestamp.toDate().toISOString();
  if (timestamp instanceof Date) return timestamp.toISOString();
  return timestamp;
};

// Helper to convert ISO string to Firestore timestamp
const toTimestamp = (date: string | Date): Timestamp => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return Timestamp.fromDate(d);
};

// Helper to get current user ID
const getCurrentUserId = (): string => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  return user.uid;
};

class FirebaseService {
  // Auth
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      // Check if Firebase is properly configured
      if (!auth || !db) {
        throw new Error(
          'Firebase não está configurado. Por favor, configure as variáveis de ambiente do Firebase no arquivo .env'
        );
      }

      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const firebaseUser = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      const userData = userDoc.data() as Omit<User, 'id'> | undefined;

      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || data.email,
        name: userData?.name || firebaseUser.displayName || 'User',
        createdAt: userData?.createdAt || firebaseUser.metadata.creationTime || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Get ID token for compatibility
      const token = await firebaseUser.getIdToken();

      return { user, token };
    } catch (error: any) {
      // Provide more helpful error messages
      if (error.code === 'auth/configuration-not-found' || error.code === 'auth/invalid-api-key') {
        throw new Error(
          'Firebase não está configurado corretamente. Por favor, configure as variáveis de ambiente do Firebase no arquivo .env'
        );
      }
      if (error.code === 'auth/user-not-found') {
        throw new Error('Usuário não encontrado. Verifique o email informado.');
      }
      if (error.code === 'auth/wrong-password') {
        throw new Error('Senha incorreta. Tente novamente.');
      }
      if (error.code === 'auth/invalid-email') {
        throw new Error('Email inválido. Por favor, verifique o email informado.');
      }
      if (error.code === 'auth/too-many-requests') {
        throw new Error('Muitas tentativas. Aguarde alguns minutos e tente novamente.');
      }
      throw new Error(error.message || 'Erro ao fazer login. Tente novamente.');
    }
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      // Check if Firebase is properly configured
      if (!auth || !db) {
        throw new Error(
          'Firebase não está configurado. Por favor, configure as variáveis de ambiente do Firebase no arquivo .env'
        );
      }

      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const firebaseUser = userCredential.user;

      // Update display name
      await updateProfile(firebaseUser, { displayName: data.name });

      // Create user document in Firestore using the user ID as document ID
      const now = new Date().toISOString();
      const userData: Omit<User, 'id'> = {
        email: data.email,
        name: data.name,
        createdAt: now,
        updatedAt: now,
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...userData,
        id: firebaseUser.uid,
      });

      const user: User = {
        id: firebaseUser.uid,
        ...userData,
      };

      const token = await firebaseUser.getIdToken();

      return { user, token };
    } catch (error: any) {
      // Provide more helpful error messages
      if (error.code === 'auth/configuration-not-found' || error.code === 'auth/invalid-api-key') {
        throw new Error(
          'Firebase não está configurado corretamente. Por favor, configure as variáveis de ambiente do Firebase no arquivo .env'
        );
      }
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Este email já está cadastrado. Tente fazer login.');
      }
      if (error.code === 'auth/weak-password') {
        throw new Error('A senha é muito fraca. Use pelo menos 6 caracteres.');
      }
      if (error.code === 'auth/invalid-email') {
        throw new Error('Email inválido. Por favor, verifique o email informado.');
      }
      throw new Error(error.message || 'Erro ao criar conta. Tente novamente.');
    }
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }

  async getUser(userId: string): Promise<User> {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      // If user document doesn't exist, create it from auth user
      const firebaseUser = auth.currentUser;
      if (!firebaseUser || firebaseUser.uid !== userId) {
        throw new Error('User not found');
      }
      const now = new Date().toISOString();
      const userData: Omit<User, 'id'> = {
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || 'User',
        createdAt: now,
        updatedAt: now,
      };
      await setDoc(doc(db, 'users', userId), {
        ...userData,
        id: userId,
      });
      return { id: userId, ...userData };
    }
    const data = userDoc.data();
    return {
      id: userDoc.id,
      email: data.email,
      name: data.name,
      createdAt: data.createdAt || '',
      updatedAt: data.updatedAt || '',
    };
  }

  // Revenues
  async getRevenues(): Promise<Revenue[]> {
    try {
      const userId = getCurrentUserId();
      let snapshot;
      
      try {
        // Try with orderBy (requires composite index)
        const q = query(
          collection(db, 'revenues'),
          where('userId', '==', userId),
          orderBy('date', 'desc')
        );
        snapshot = await getDocs(q);
      } catch (error: any) {
        // If index doesn't exist, query without orderBy and sort in memory
        if (error.code === 'failed-precondition' || error.message?.includes('index')) {
          const q = query(
            collection(db, 'revenues'),
            where('userId', '==', userId)
          );
          snapshot = await getDocs(q);
          const revenues = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            date: toISOString(doc.data().date),
            createdAt: toISOString(doc.data().createdAt),
            updatedAt: toISOString(doc.data().updatedAt),
          })) as Revenue[];
          // Sort in memory
          return revenues.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        throw error;
      }
      
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: toISOString(doc.data().date),
        createdAt: toISOString(doc.data().createdAt),
        updatedAt: toISOString(doc.data().updatedAt),
      })) as Revenue[];
    } catch (error: any) {
      console.error('Error fetching revenues:', error);
      throw new Error(error.message || 'Erro ao buscar receitas');
    }
  }

  async getRevenue(id: string): Promise<Revenue> {
    const docRef = doc(db, 'revenues', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error('Revenue not found');
    return {
      id: docSnap.id,
      ...docSnap.data(),
      date: toISOString(docSnap.data().date),
      createdAt: toISOString(docSnap.data().createdAt),
      updatedAt: toISOString(docSnap.data().updatedAt),
    } as Revenue;
  }

  async createRevenue(data: CreateRevenueRequest): Promise<Revenue> {
    const userId = getCurrentUserId();
    const now = Timestamp.now();
    const revenueData = {
      ...data,
      userId,
      date: toTimestamp(data.date),
      createdAt: now,
      updatedAt: now,
    };
    const docRef = await addDoc(collection(db, 'revenues'), revenueData);
    return {
      id: docRef.id,
      ...data,
      userId,
      date: data.date,
      createdAt: toISOString(now),
      updatedAt: toISOString(now),
    };
  }

  async updateRevenue(id: string, data: CreateRevenueRequest): Promise<Revenue> {
    const docRef = doc(db, 'revenues', id);
    await updateDoc(docRef, {
      ...data,
      date: toTimestamp(data.date),
      updatedAt: Timestamp.now(),
    });
    return this.getRevenue(id);
  }

  async deleteRevenue(id: string): Promise<void> {
    await deleteDoc(doc(db, 'revenues', id));
  }

  // Expenses
  async getExpenses(): Promise<Expense[]> {
    try {
      const userId = getCurrentUserId();
      let snapshot;
      
      try {
        // Try with orderBy (requires composite index)
        const q = query(
          collection(db, 'expenses'),
          where('userId', '==', userId),
          orderBy('date', 'desc')
        );
        snapshot = await getDocs(q);
      } catch (error: any) {
        // If index doesn't exist, query without orderBy and sort in memory
        if (error.code === 'failed-precondition' || error.message?.includes('index')) {
          const q = query(
            collection(db, 'expenses'),
            where('userId', '==', userId)
          );
          snapshot = await getDocs(q);
          const expenses = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            date: toISOString(doc.data().date),
            createdAt: toISOString(doc.data().createdAt),
            updatedAt: toISOString(doc.data().updatedAt),
          })) as Expense[];
          // Sort in memory
          return expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        throw error;
      }
      
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: toISOString(doc.data().date),
        createdAt: toISOString(doc.data().createdAt),
        updatedAt: toISOString(doc.data().updatedAt),
      })) as Expense[];
    } catch (error: any) {
      console.error('Error fetching expenses:', error);
      throw new Error(error.message || 'Erro ao buscar despesas');
    }
  }

  async createExpense(data: CreateExpenseRequest): Promise<Expense> {
    try {
      const userId = getCurrentUserId();
      const now = Timestamp.now();
      const expenseData = {
        ...data,
        userId,
        categoryId: data.categoryId ?? null,
        date: toTimestamp(data.date),
        createdAt: now,
        updatedAt: now,
      };
      const docRef = await addDoc(collection(db, 'expenses'), expenseData);
      return {
        id: docRef.id,
        ...data,
        userId,
        categoryId: data.categoryId ?? null,
        date: data.date,
        createdAt: toISOString(now),
        updatedAt: toISOString(now),
      };
    } catch (error: any) {
      console.error('Error creating expense:', error);
      throw new Error(error.message || 'Erro ao criar despesa');
    }
  }

  async updateExpense(id: string, data: CreateExpenseRequest): Promise<Expense> {
    const docRef = doc(db, 'expenses', id);
    await updateDoc(docRef, {
      ...data,
      categoryId: data.categoryId ?? null,
      date: toTimestamp(data.date),
      updatedAt: Timestamp.now(),
    });
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error('Expense not found');
    const docData = docSnap.data();
    return {
      id: docSnap.id,
      ...docData,
      date: toISOString(docData.date),
      createdAt: toISOString(docData.createdAt),
      updatedAt: toISOString(docData.updatedAt),
    } as Expense;
  }

  async deleteExpense(id: string): Promise<void> {
    await deleteDoc(doc(db, 'expenses', id));
  }

  // Categories
  async getCategories(): Promise<CategoriesResponse> {
    try {
      const userId = getCurrentUserId();
      let snapshot;
      
      try {
        // Try with orderBy (requires composite index)
        const q = query(
          collection(db, 'categories'),
          where('userId', '==', userId),
          orderBy('name', 'asc')
        );
        snapshot = await getDocs(q);
      } catch (error: any) {
        // If index doesn't exist, query without orderBy and sort in memory
        if (error.code === 'failed-precondition' || error.message?.includes('index')) {
          const q = query(
            collection(db, 'categories'),
            where('userId', '==', userId)
          );
          snapshot = await getDocs(q);
          const categories = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: toISOString(doc.data().createdAt),
            updatedAt: toISOString(doc.data().updatedAt),
          })) as Category[];
          // Sort in memory
          const sortedCategories = categories.sort((a, b) => a.name.localeCompare(b.name));
          const totalBudgetMax = sortedCategories.reduce((sum, cat) => sum + (cat.budgetMax || 0), 0);
          const totalSpent = sortedCategories.reduce((sum, cat) => sum + (cat.totalSpent || 0), 0);
          return {
            data: sortedCategories,
            stats: { totalBudgetMax, totalSpent },
          };
        }
        throw error;
      }
      
      const categories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: toISOString(doc.data().createdAt),
        updatedAt: toISOString(doc.data().updatedAt),
      })) as Category[];

      // Calculate stats
      const totalBudgetMax = categories.reduce((sum, cat) => sum + (cat.budgetMax || 0), 0);
      const totalSpent = categories.reduce((sum, cat) => sum + (cat.totalSpent || 0), 0);

      return {
        data: categories,
        stats: { totalBudgetMax, totalSpent },
      };
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      throw new Error(error.message || 'Erro ao buscar categorias');
    }
  }

  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    const userId = getCurrentUserId();
    const now = Timestamp.now();
    const categoryData = {
      ...data,
      userId,
      createdAt: now,
      updatedAt: now,
    };
    const docRef = await addDoc(collection(db, 'categories'), categoryData);
    return {
      id: docRef.id,
      ...data,
      userId,
      createdAt: toISOString(now),
      updatedAt: toISOString(now),
    };
  }

  async updateCategory(id: string, data: CreateCategoryRequest): Promise<Category> {
    const docRef = doc(db, 'categories', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error('Category not found');
    const docData = docSnap.data();
    return {
      id: docSnap.id,
      ...docData,
      createdAt: toISOString(docData.createdAt),
      updatedAt: toISOString(docData.updatedAt),
    } as Category;
  }

  async deleteCategory(id: string): Promise<void> {
    await deleteDoc(doc(db, 'categories', id));
  }

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const userId = getCurrentUserId();
      
      // Get all revenues and expenses (not just current month)
      const [revenuesSnap, expensesSnap] = await Promise.all([
        getDocs(
          query(
            collection(db, 'revenues'),
            where('userId', '==', userId)
          )
        ),
        getDocs(
          query(
            collection(db, 'expenses'),
            where('userId', '==', userId)
          )
        ),
      ]);

      // Calculate totals from all transactions
      const totalRevenue = revenuesSnap.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);
      const totalExpense = expensesSnap.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);
      const balance = totalRevenue - totalExpense;

      // Get recent transactions (last 10), sorted by date
      const allTransactions: Array<{ id: string; type: 'revenue' | 'expense'; name: string; amount: number; date: string }> = [
        ...revenuesSnap.docs.map((doc) => ({
          id: doc.id,
          type: 'revenue' as const,
          name: doc.data().name,
          amount: doc.data().amount,
          date: toISOString(doc.data().date),
        })),
        ...expensesSnap.docs.map((doc) => ({
          id: doc.id,
          type: 'expense' as const,
          name: doc.data().name,
          amount: doc.data().amount,
          date: toISOString(doc.data().date),
        })),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

      return {
        totalRevenue,
        totalExpense,
        balance,
        recentTransactions: allTransactions,
      };
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      throw new Error(error.message || 'Erro ao buscar estatísticas do dashboard');
    }
  }

  // Monthly Expenses
  async getMonthlyExpenses(): Promise<MonthlyExpense[]> {
    try {
      const userId = getCurrentUserId();
      let snapshot;
      
      try {
        // Try with orderBy (requires composite index)
        const q = query(
          collection(db, 'monthlyExpenses'),
          where('userId', '==', userId),
          orderBy('dayOfMonth', 'asc')
        );
        snapshot = await getDocs(q);
      } catch (error: any) {
        // If index doesn't exist, query without orderBy and sort in memory
        if (error.code === 'failed-precondition' || error.message?.includes('index')) {
          const q = query(
            collection(db, 'monthlyExpenses'),
            where('userId', '==', userId)
          );
          snapshot = await getDocs(q);
          const expenses = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: toISOString(doc.data().createdAt),
            updatedAt: toISOString(doc.data().updatedAt),
          })) as MonthlyExpense[];
          // Sort in memory
          return expenses.sort((a, b) => a.dayOfMonth - b.dayOfMonth);
        }
        throw error;
      }
      
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: toISOString(doc.data().createdAt),
        updatedAt: toISOString(doc.data().updatedAt),
      })) as MonthlyExpense[];
    } catch (error: any) {
      console.error('Error fetching monthly expenses:', error);
      throw new Error(error.message || 'Erro ao buscar despesas mensais');
    }
  }

  async createMonthlyExpense(data: CreateMonthlyExpenseRequest): Promise<MonthlyExpense> {
    const userId = getCurrentUserId();
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, 'monthlyExpenses'), {
      ...data,
      userId,
      createdAt: now,
      updatedAt: now,
    });
    return {
      id: docRef.id,
      ...data,
      userId,
      createdAt: toISOString(now),
      updatedAt: toISOString(now),
    };
  }

  async updateMonthlyExpense(id: string, data: CreateMonthlyExpenseRequest): Promise<MonthlyExpense> {
    const docRef = doc(db, 'monthlyExpenses', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error('Monthly expense not found');
    const docData = docSnap.data();
    return {
      id: docSnap.id,
      ...docData,
      createdAt: toISOString(docData.createdAt),
      updatedAt: toISOString(docData.updatedAt),
    } as MonthlyExpense;
  }

  async deleteMonthlyExpense(id: string): Promise<void> {
    await deleteDoc(doc(db, 'monthlyExpenses', id));
  }

  // Monthly Revenues
  async getMonthlyRevenues(): Promise<MonthlyRevenue[]> {
    try {
      const userId = getCurrentUserId();
      let snapshot;
      
      try {
        // Try with orderBy (requires composite index)
        const q = query(
          collection(db, 'monthlyRevenues'),
          where('userId', '==', userId),
          orderBy('dayOfMonth', 'asc')
        );
        snapshot = await getDocs(q);
      } catch (error: any) {
        // If index doesn't exist, query without orderBy and sort in memory
        if (error.code === 'failed-precondition' || error.message?.includes('index')) {
          const q = query(
            collection(db, 'monthlyRevenues'),
            where('userId', '==', userId)
          );
          snapshot = await getDocs(q);
          const revenues = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: toISOString(doc.data().createdAt),
            updatedAt: toISOString(doc.data().updatedAt),
          })) as MonthlyRevenue[];
          // Sort in memory
          return revenues.sort((a, b) => a.dayOfMonth - b.dayOfMonth);
        }
        throw error;
      }
      
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: toISOString(doc.data().createdAt),
        updatedAt: toISOString(doc.data().updatedAt),
      })) as MonthlyRevenue[];
    } catch (error: any) {
      console.error('Error fetching monthly revenues:', error);
      throw new Error(error.message || 'Erro ao buscar receitas mensais');
    }
  }

  async createMonthlyRevenue(data: CreateMonthlyRevenueRequest): Promise<MonthlyRevenue> {
    const userId = getCurrentUserId();
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, 'monthlyRevenues'), {
      ...data,
      userId,
      createdAt: now,
      updatedAt: now,
    });
    return {
      id: docRef.id,
      ...data,
      userId,
      createdAt: toISOString(now),
      updatedAt: toISOString(now),
    };
  }

  async updateMonthlyRevenue(id: string, data: CreateMonthlyRevenueRequest): Promise<MonthlyRevenue> {
    const docRef = doc(db, 'monthlyRevenues', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error('Monthly revenue not found');
    const docData = docSnap.data();
    return {
      id: docSnap.id,
      ...docData,
      createdAt: toISOString(docData.createdAt),
      updatedAt: toISOString(docData.updatedAt),
    } as MonthlyRevenue;
  }

  async deleteMonthlyRevenue(id: string): Promise<void> {
    await deleteDoc(doc(db, 'monthlyRevenues', id));
  }

  // Simulation Expenses
  async getSimulationExpenses(year?: number, month?: number): Promise<SimulationExpense[]> {
    const userId = getCurrentUserId();
    const constraints: QueryConstraint[] = [where('userId', '==', userId)];

    if (year && month) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      constraints.push(where('date', '>=', Timestamp.fromDate(startDate)));
      constraints.push(where('date', '<=', Timestamp.fromDate(endDate)));
    }

    constraints.push(orderBy('date', 'desc'));
    const q = query(collection(db, 'simulationExpenses'), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: toISOString(doc.data().date),
      createdAt: toISOString(doc.data().createdAt),
      updatedAt: toISOString(doc.data().updatedAt),
    })) as SimulationExpense[];
  }

  async createSimulationExpense(data: CreateSimulationExpenseRequest): Promise<SimulationExpense> {
    const userId = getCurrentUserId();
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, 'simulationExpenses'), {
      ...data,
      userId,
      date: toTimestamp(data.date),
      createdAt: now,
      updatedAt: now,
    });
    return {
      id: docRef.id,
      ...data,
      userId,
      createdAt: toISOString(now),
      updatedAt: toISOString(now),
    };
  }

  async updateSimulationExpense(id: string, data: CreateSimulationExpenseRequest): Promise<SimulationExpense> {
    const docRef = doc(db, 'simulationExpenses', id);
    await updateDoc(docRef, {
      ...data,
      date: toTimestamp(data.date),
      updatedAt: Timestamp.now(),
    });
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error('Simulation expense not found');
    const docData = docSnap.data();
    return {
      id: docSnap.id,
      ...docData,
      date: toISOString(docData.date),
      createdAt: toISOString(docData.createdAt),
      updatedAt: toISOString(docData.updatedAt),
    } as SimulationExpense;
  }

  async deleteSimulationExpense(id: string): Promise<void> {
    await deleteDoc(doc(db, 'simulationExpenses', id));
  }

  // Simulation Revenues
  async getSimulationRevenues(year?: number, month?: number): Promise<SimulationRevenue[]> {
    const userId = getCurrentUserId();
    const constraints: QueryConstraint[] = [where('userId', '==', userId)];

    if (year && month) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      constraints.push(where('date', '>=', Timestamp.fromDate(startDate)));
      constraints.push(where('date', '<=', Timestamp.fromDate(endDate)));
    }

    constraints.push(orderBy('date', 'desc'));
    const q = query(collection(db, 'simulationRevenues'), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: toISOString(doc.data().date),
      createdAt: toISOString(doc.data().createdAt),
      updatedAt: toISOString(doc.data().updatedAt),
    })) as SimulationRevenue[];
  }

  async createSimulationRevenue(data: CreateSimulationRevenueRequest): Promise<SimulationRevenue> {
    const userId = getCurrentUserId();
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, 'simulationRevenues'), {
      ...data,
      userId,
      date: toTimestamp(data.date),
      createdAt: now,
      updatedAt: now,
    });
    return {
      id: docRef.id,
      ...data,
      userId,
      createdAt: toISOString(now),
      updatedAt: toISOString(now),
    };
  }

  async updateSimulationRevenue(id: string, data: CreateSimulationRevenueRequest): Promise<SimulationRevenue> {
    const docRef = doc(db, 'simulationRevenues', id);
    await updateDoc(docRef, {
      ...data,
      date: toTimestamp(data.date),
      updatedAt: Timestamp.now(),
    });
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error('Simulation revenue not found');
    const docData = docSnap.data();
    return {
      id: docSnap.id,
      ...docData,
      date: toISOString(docData.date),
      createdAt: toISOString(docData.createdAt),
      updatedAt: toISOString(docData.updatedAt),
    } as SimulationRevenue;
  }

  async deleteSimulationRevenue(id: string): Promise<void> {
    await deleteDoc(doc(db, 'simulationRevenues', id));
  }

  // Simulation Credit Purchases
  async getSimulationCreditPurchases(): Promise<SimulationCreditPurchase[]> {
    const userId = getCurrentUserId();
    const q = query(
      collection(db, 'simulationCreditPurchases'),
      where('userId', '==', userId),
      orderBy('purchaseDate', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      purchaseDate: toISOString(doc.data().purchaseDate),
      createdAt: toISOString(doc.data().createdAt),
      updatedAt: toISOString(doc.data().updatedAt),
    })) as SimulationCreditPurchase[];
  }

  async createSimulationCreditPurchase(data: CreateSimulationCreditPurchaseRequest): Promise<SimulationCreditPurchase> {
    const userId = getCurrentUserId();
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, 'simulationCreditPurchases'), {
      ...data,
      userId,
      purchaseDate: toTimestamp(data.purchaseDate),
      createdAt: now,
      updatedAt: now,
    });
    return {
      id: docRef.id,
      ...data,
      userId,
      createdAt: toISOString(now),
      updatedAt: toISOString(now),
    };
  }

  async updateSimulationCreditPurchase(
    id: string,
    data: CreateSimulationCreditPurchaseRequest
  ): Promise<SimulationCreditPurchase> {
    const docRef = doc(db, 'simulationCreditPurchases', id);
    await updateDoc(docRef, {
      ...data,
      purchaseDate: toTimestamp(data.purchaseDate),
      updatedAt: Timestamp.now(),
    });
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error('Simulation credit purchase not found');
    const docData = docSnap.data();
    return {
      id: docSnap.id,
      ...docData,
      purchaseDate: toISOString(docData.purchaseDate),
      createdAt: toISOString(docData.createdAt),
      updatedAt: toISOString(docData.updatedAt),
    } as SimulationCreditPurchase;
  }

  async deleteSimulationCreditPurchase(id: string): Promise<void> {
    await deleteDoc(doc(db, 'simulationCreditPurchases', id));
  }

  // Simulation Stats
  async getSimulationStats(): Promise<SimulationStats> {
    const userId = getCurrentUserId();
    const [revenuesSnap, expensesSnap, creditSnap] = await Promise.all([
      getDocs(query(collection(db, 'simulationRevenues'), where('userId', '==', userId))),
      getDocs(query(collection(db, 'simulationExpenses'), where('userId', '==', userId))),
      getDocs(query(collection(db, 'simulationCreditPurchases'), where('userId', '==', userId))),
    ]);

    const totalRevenue = revenuesSnap.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);
    const totalExpense = expensesSnap.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);
    const totalCreditSpent = creditSnap.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);
    const averageBalance = totalRevenue - totalExpense - totalCreditSpent;

    return {
      totalRevenue,
      totalCreditSpent,
      totalExpense,
      averageBalance,
    };
  }

  // Simulation Projection
  async getSimulationProjection(months: number = 12): Promise<MonthProjection[]> {
    const now = new Date();
    const projections: MonthProjection[] = [];

    // Get all simulation data
    const [revenues, expenses, creditPurchases, monthlyRevenues, monthlyExpenses] = await Promise.all([
      this.getAllSimulationRevenues(),
      this.getAllSimulationExpenses(),
      this.getSimulationCreditPurchases(),
      this.getMonthlyRevenues(),
      this.getMonthlyExpenses(),
    ]);

    for (let i = 0; i < months; i++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth() + 1;

      // Calculate revenues
      let monthRevenues = revenues
        .filter((r) => {
          const rDate = new Date(r.date);
          return rDate.getFullYear() === year && rDate.getMonth() + 1 === month;
        })
        .reduce((sum, r) => sum + r.amount, 0);

      // Add monthly revenues
      monthRevenues += monthlyRevenues
        .filter((mr) => mr.dayOfMonth <= new Date(year, month, 0).getDate())
        .reduce((sum, mr) => sum + mr.amount, 0);

      // Calculate expenses
      let monthExpenses = expenses
        .filter((e) => {
          const eDate = new Date(e.date);
          return eDate.getFullYear() === year && eDate.getMonth() + 1 === month;
        })
        .reduce((sum, e) => sum + e.amount, 0);

      // Add monthly expenses
      monthExpenses += monthlyExpenses
        .filter((me) => me.dayOfMonth <= new Date(year, month, 0).getDate())
        .reduce((sum, me) => sum + me.amount, 0);

      // Calculate credit payments
      const monthCreditPayments = creditPurchases.reduce((sum, cp) => {
        const purchaseDate = new Date(cp.purchaseDate);
        const monthsSincePurchase = (year - purchaseDate.getFullYear()) * 12 + (month - purchaseDate.getMonth() - 1);
        if (monthsSincePurchase >= 0 && monthsSincePurchase < cp.installments) {
          return sum + cp.amount / cp.installments;
        }
        return sum;
      }, 0);

      const balance = monthRevenues - monthExpenses - monthCreditPayments;

      projections.push({
        year,
        month,
        expenses: monthExpenses,
        revenues: monthRevenues,
        creditPayments: monthCreditPayments,
        balance,
      });
    }

    return projections;
  }

  async getAllSimulationExpenses(): Promise<Array<SimulationExpense & { isMonthly?: boolean; isSimulation?: boolean }>> {
    const userId = getCurrentUserId();
    const [simulationExpenses, monthlyExpenses] = await Promise.all([
      getDocs(query(collection(db, 'simulationExpenses'), where('userId', '==', userId))),
      getDocs(query(collection(db, 'monthlyExpenses'), where('userId', '==', userId))),
    ]);

    return [
      ...simulationExpenses.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: toISOString(doc.data().date),
        createdAt: toISOString(doc.data().createdAt),
        updatedAt: toISOString(doc.data().updatedAt),
        isSimulation: true,
      })) as Array<SimulationExpense & { isSimulation: boolean }>,
      ...monthlyExpenses.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        amount: doc.data().amount,
        date: new Date(new Date().getFullYear(), new Date().getMonth(), doc.data().dayOfMonth).toISOString(),
        userId: doc.data().userId,
        createdAt: toISOString(doc.data().createdAt),
        updatedAt: toISOString(doc.data().updatedAt),
        isMonthly: true,
      })) as Array<SimulationExpense & { isMonthly: boolean }>,
    ];
  }

  async getAllSimulationRevenues(): Promise<Array<SimulationRevenue & { isMonthly?: boolean; isSimulation?: boolean }>> {
    const userId = getCurrentUserId();
    const [simulationRevenues, monthlyRevenues] = await Promise.all([
      getDocs(query(collection(db, 'simulationRevenues'), where('userId', '==', userId))),
      getDocs(query(collection(db, 'monthlyRevenues'), where('userId', '==', userId))),
    ]);

    return [
      ...simulationRevenues.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: toISOString(doc.data().date),
        createdAt: toISOString(doc.data().createdAt),
        updatedAt: toISOString(doc.data().updatedAt),
        isSimulation: true,
      })) as Array<SimulationRevenue & { isSimulation: boolean }>,
      ...monthlyRevenues.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        amount: doc.data().amount,
        date: new Date(new Date().getFullYear(), new Date().getMonth(), doc.data().dayOfMonth).toISOString(),
        userId: doc.data().userId,
        createdAt: toISOString(doc.data().createdAt),
        updatedAt: toISOString(doc.data().updatedAt),
        isMonthly: true,
      })) as Array<SimulationRevenue & { isMonthly: boolean }>,
    ];
  }

  // Wishes
  async getWishes(): Promise<Wish[]> {
    try {
      const userId = getCurrentUserId();
      let snapshot;
      
      try {
        // Try with orderBy (requires composite index)
        const q = query(
          collection(db, 'wishes'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        snapshot = await getDocs(q);
      } catch (error: any) {
        // If index doesn't exist, query without orderBy and sort in memory
        if (error.code === 'failed-precondition' || error.message?.includes('index')) {
          const q = query(
            collection(db, 'wishes'),
            where('userId', '==', userId)
          );
          snapshot = await getDocs(q);
          const wishes = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: toISOString(doc.data().createdAt),
            updatedAt: toISOString(doc.data().updatedAt),
          })) as Wish[];
          // Sort in memory
          return wishes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        throw error;
      }
      
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: toISOString(doc.data().createdAt),
        updatedAt: toISOString(doc.data().updatedAt),
      })) as Wish[];
    } catch (error: any) {
      console.error('Error fetching wishes:', error);
      throw new Error(error.message || 'Erro ao buscar desejos');
    }
  }

  async createWish(data: CreateWishRequest): Promise<Wish> {
    try {
      const userId = getCurrentUserId();
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, 'wishes'), {
        ...data,
        userId,
        createdAt: now,
        updatedAt: now,
      });
      return {
        id: docRef.id,
        ...data,
        userId,
        createdAt: toISOString(now),
        updatedAt: toISOString(now),
      };
    } catch (error: any) {
      console.error('Error creating wish:', error);
      throw new Error(error.message || 'Erro ao criar desejo');
    }
  }

  async updateWish(id: string, data: CreateWishRequest): Promise<Wish> {
    const docRef = doc(db, 'wishes', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error('Wish not found');
    const docData = docSnap.data();
    return {
      id: docSnap.id,
      ...docData,
      createdAt: toISOString(docData.createdAt),
      updatedAt: toISOString(docData.updatedAt),
    } as Wish;
  }

  async deleteWish(id: string): Promise<void> {
    await deleteDoc(doc(db, 'wishes', id));
  }

  async purchaseWish(id: string, amount?: number, date?: string): Promise<{
    expense: Expense;
    budgetExceeded: boolean;
    remaining: number;
  }> {
    const wish = await this.getWish(id);
    const expenseAmount = amount || wish.amount || 0;
    const expenseDate = date || new Date().toISOString();
    const userId = getCurrentUserId();

    // Create expense
    const expense = await this.createExpense({
      name: wish.name,
      amount: expenseAmount,
      date: expenseDate,
      categoryId: wish.categoryId || null,
    });

    // Check budget
    const categories = await this.getCategories();
    const category = categories.data.find((c) => c.id === wish.categoryId);
    let budgetExceeded = false;
    let remaining = 0;

    if (category) {
      const categoryExpenses = await getDocs(
        query(
          collection(db, 'expenses'),
          where('userId', '==', userId),
          where('categoryId', '==', category.id)
        )
      );
      const totalSpent = categoryExpenses.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);
      remaining = category.budgetMax - totalSpent;
      budgetExceeded = remaining < 0;
    }

    // Delete wish
    await this.deleteWish(id);

    return { expense, budgetExceeded, remaining };
  }

  private async getWish(id: string): Promise<Wish> {
    const docRef = doc(db, 'wishes', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error('Wish not found');
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: toISOString(docSnap.data().createdAt),
      updatedAt: toISOString(docSnap.data().updatedAt),
    } as Wish;
  }

  // Shopping List
  async getShoppingListItems(): Promise<ShoppingListItem[]> {
    try {
      const userId = getCurrentUserId();
      let snapshot;
      
      try {
        // Try with orderBy (requires composite index)
        const q = query(
          collection(db, 'shoppingList'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        snapshot = await getDocs(q);
      } catch (error: any) {
        // If index doesn't exist, query without orderBy and sort in memory
        if (error.code === 'failed-precondition' || error.message?.includes('index')) {
          const q = query(
            collection(db, 'shoppingList'),
            where('userId', '==', userId)
          );
          snapshot = await getDocs(q);
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: toISOString(doc.data().createdAt),
            updatedAt: toISOString(doc.data().updatedAt),
          })) as ShoppingListItem[];
          // Sort in memory
          return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        throw error;
      }
      
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: toISOString(doc.data().createdAt),
        updatedAt: toISOString(doc.data().updatedAt),
      })) as ShoppingListItem[];
    } catch (error: any) {
      console.error('Error fetching shopping list items:', error);
      throw new Error(error.message || 'Erro ao buscar itens da lista de compras');
    }
  }

  async getShoppingListStats(): Promise<ShoppingListStats> {
    const items = await this.getShoppingListItems();
    const totalItems = items.length;
    const purchasedItems = items.filter((item) => item.isPurchased).length;
    const pendingItems = totalItems - purchasedItems;
    const totalPrice = items.reduce((sum, item) => sum + (item.price || 0), 0);

    return {
      totalItems,
      purchasedItems,
      pendingItems,
      totalPrice,
    };
  }

  async createShoppingListItem(data: CreateShoppingListItemRequest): Promise<ShoppingListItem> {
    const userId = getCurrentUserId();
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, 'shoppingList'), {
      ...data,
      userId,
      isPurchased: false,
      createdAt: now,
      updatedAt: now,
    });
    return {
      id: docRef.id,
      ...data,
      userId,
      isPurchased: false,
      createdAt: toISOString(now),
      updatedAt: toISOString(now),
    };
  }

  async updateShoppingListItem(id: string, data: CreateShoppingListItemRequest): Promise<ShoppingListItem> {
    const docRef = doc(db, 'shoppingList', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error('Shopping list item not found');
    const docData = docSnap.data();
    return {
      id: docSnap.id,
      ...docData,
      createdAt: toISOString(docData.createdAt),
      updatedAt: toISOString(docData.updatedAt),
    } as ShoppingListItem;
  }

  async toggleShoppingListItem(id: string): Promise<ShoppingListItem> {
    const docRef = doc(db, 'shoppingList', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error('Item not found');
    const docData = docSnap.data();
    const currentValue = docData.isPurchased || false;
    await updateDoc(docRef, {
      isPurchased: !currentValue,
      updatedAt: Timestamp.now(),
    });
    const updatedSnap = await getDoc(docRef);
    if (!updatedSnap.exists()) throw new Error('Item not found after update');
    const updatedData = updatedSnap.data();
    return {
      id: updatedSnap.id,
      ...updatedData,
      createdAt: toISOString(updatedData.createdAt),
      updatedAt: toISOString(updatedData.updatedAt),
    } as ShoppingListItem;
  }

  async deleteShoppingListItem(id: string): Promise<void> {
    await deleteDoc(doc(db, 'shoppingList', id));
  }

  async clearShoppingList(): Promise<void> {
    const userId = getCurrentUserId();
    const snapshot = await getDocs(query(collection(db, 'shoppingList'), where('userId', '==', userId)));
    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }

  // Notifications
  async generateNotifications(): Promise<void> {
    try {
      const userId = getCurrentUserId();
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();
      const currentDay = now.getDate();

      // Get all categories and expenses
      const [categories, expenses, monthlyExpenses] = await Promise.all([
        this.getCategories(),
        this.getExpenses(),
        this.getMonthlyExpenses(),
      ]);

      const batch = writeBatch(db);
      const notificationsRef = collection(db, 'notifications');

      // Delete old notifications for this user
      const oldNotifications = await getDocs(
        query(collection(db, 'notifications'), where('userId', '==', userId))
      );
      oldNotifications.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Check category budgets
      for (const category of categories.data) {
        if (category.budgetMax > 0) {
          // Calculate total spent in current month
          const monthExpenses = expenses.filter((expense) => {
            if (expense.categoryId !== category.id) return false;
            const expenseDate = new Date(expense.date);
            return (
              expenseDate.getMonth() + 1 === currentMonth && expenseDate.getFullYear() === currentYear
            );
          });

          const totalSpent = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
          const percentage = (totalSpent / category.budgetMax) * 100;

          // Budget exceeded
          if (totalSpent >= category.budgetMax) {
            const notificationRef = doc(notificationsRef);
            batch.set(notificationRef, {
              userId,
              type: 'budget_exceeded',
              title: 'Orçamento Excedido',
              message: `A categoria "${category.name}" excedeu o orçamento máximo de ${category.budgetMax.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}. Total gasto: ${totalSpent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
              categoryId: category.id,
              severity: 'error',
              createdAt: Timestamp.now(),
            });
          }
          // Budget warning (80% or more)
          else if (percentage >= 80) {
            const notificationRef = doc(notificationsRef);
            batch.set(notificationRef, {
              userId,
              type: 'budget_warning',
              title: 'Orçamento Próximo do Limite',
              message: `A categoria "${category.name}" está com ${percentage.toFixed(1)}% do orçamento utilizado (${totalSpent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} de ${category.budgetMax.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})`,
              categoryId: category.id,
              severity: 'warning',
              createdAt: Timestamp.now(),
            });
          }
        }
      }

      // Check monthly expenses
      for (const monthlyExpense of monthlyExpenses) {
        const expenseDay = monthlyExpense.dayOfMonth;
        let daysUntilExpense: number;
        
        if (expenseDay >= currentDay) {
          // Expense is in the current month
          daysUntilExpense = expenseDay - currentDay;
        } else {
          // Expense is in the next month
          const daysInCurrentMonth = new Date(currentYear, currentMonth, 0).getDate();
          daysUntilExpense = (daysInCurrentMonth - currentDay) + expenseDay;
        }
        
        // Expense is today
        if (daysUntilExpense === 0) {
          const notificationRef = doc(notificationsRef);
          batch.set(notificationRef, {
            userId,
            type: 'monthly_expense_coming',
            title: 'Despesa Mensal Hoje',
            message: `A despesa mensal "${monthlyExpense.name}" (${monthlyExpense.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}) vence hoje`,
            monthlyExpenseId: monthlyExpense.id,
            severity: 'info',
            createdAt: Timestamp.now(),
          });
        }
        // Expense is in 1-3 days
        else if (daysUntilExpense > 0 && daysUntilExpense <= 3) {
          const notificationRef = doc(notificationsRef);
          batch.set(notificationRef, {
            userId,
            type: 'monthly_expense_coming',
            title: 'Despesa Mensal Próxima',
            message: `A despesa mensal "${monthlyExpense.name}" (${monthlyExpense.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}) vence em ${daysUntilExpense} dia${daysUntilExpense > 1 ? 's' : ''}`,
            monthlyExpenseId: monthlyExpense.id,
            severity: 'warning',
            createdAt: Timestamp.now(),
          });
        }
      }

      await batch.commit();
    } catch (error: any) {
      console.error('Error generating notifications:', error);
      // Don't throw - notifications are not critical
    }
  }

  async getNotifications(): Promise<NotificationsResponse> {
    try {
      const userId = getCurrentUserId();
      
      // Generate notifications first
      await this.generateNotifications();
      
      let snapshot;
      try {
        // Try with orderBy (requires composite index)
        const q = query(
          collection(db, 'notifications'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc'),
          limit(50)
        );
        snapshot = await getDocs(q);
      } catch (error: any) {
        // If index doesn't exist, query without orderBy and sort in memory
        if (error.code === 'failed-precondition' || error.message?.includes('index')) {
          const q = query(
            collection(db, 'notifications'),
            where('userId', '==', userId),
            limit(50)
          );
          snapshot = await getDocs(q);
          const notifications = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              type: data.type as ApiNotification['type'],
              title: data.title,
              message: data.message,
              categoryId: data.categoryId,
              monthlyExpenseId: data.monthlyExpenseId,
              severity: data.severity as ApiNotification['severity'],
              createdAt: toISOString(data.createdAt),
            } as ApiNotification;
          });
          // Sort in memory
          const sorted = notifications.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          return {
            data: sorted,
            count: sorted.length,
          };
        }
        throw error;
      }

      const notifications = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          type: data.type as ApiNotification['type'],
          title: data.title,
          message: data.message,
          categoryId: data.categoryId,
          monthlyExpenseId: data.monthlyExpenseId,
          severity: data.severity as ApiNotification['severity'],
          createdAt: toISOString(data.createdAt),
        } as ApiNotification;
      });

      return {
        data: notifications,
        count: notifications.length,
      };
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      return {
        data: [],
        count: 0,
      };
    }
  }
}

export const firebaseService = new FirebaseService();

