import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ProtectedRoute } from '@/components/protected-route';
import { AppLayout } from '@/components/layout/app-layout';
import { LoginPage } from '@/pages/login';
import { RegisterPage } from '@/pages/register';
import { DashboardPage } from '@/pages/dashboard';
import { RevenuesPage } from '@/pages/revenues';
import { ExpensesPage } from '@/pages/expenses';
import { CategoriesPage } from '@/pages/categories';
import { MonthlyRevenuesPage } from '@/pages/monthly-revenues';
import { MonthlyExpensesPage } from '@/pages/monthly-expenses';
import { SimulationPage } from '@/pages/simulation';
import { WishesPage } from '@/pages/wishes';
import { ShoppingListPage } from '@/pages/shopping-list';
import { useAuthStore } from '@/stores/authStore';

function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="revenues" element={<RevenuesPage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="monthly-revenues" element={<MonthlyRevenuesPage />} />
          <Route path="monthly-expenses" element={<MonthlyExpensesPage />} />
          <Route path="simulation" element={<SimulationPage />} />
          <Route path="wishes" element={<WishesPage />} />
          <Route path="shopping-list" element={<ShoppingListPage />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;

