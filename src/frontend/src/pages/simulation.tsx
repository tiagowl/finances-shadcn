import { useEffect, useState } from 'react';
import { useSimulationStore } from '@/stores/simulationStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TrendingDown, TrendingUp, CreditCard, DollarSign, Edit, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { CreateSimulationExpenseSheet } from '@/components/simulation/create-simulation-expense-sheet';
import { CreateSimulationRevenueSheet } from '@/components/simulation/create-simulation-revenue-sheet';
import { CreateSimulationCreditPurchaseSheet } from '@/components/simulation/create-simulation-credit-purchase-sheet';
import { EditSimulationExpenseSheet } from '@/components/simulation/edit-simulation-expense-sheet';
import { EditSimulationRevenueSheet } from '@/components/simulation/edit-simulation-revenue-sheet';
import { EditSimulationCreditPurchaseSheet } from '@/components/simulation/edit-simulation-credit-purchase-sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import type { SimulationExpense, SimulationRevenue, SimulationCreditPurchase } from '@/types/api';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export function SimulationPage() {
  const {
    expenses,
    revenues,
    allExpenses,
    allRevenues,
    creditPurchases,
    stats,
    projection,
    isLoading,
    fetchExpenses,
    fetchRevenues,
    fetchAllExpenses,
    fetchAllRevenues,
    fetchCreditPurchases,
    fetchStats,
    fetchProjection,
    deleteExpense,
    deleteRevenue,
    deleteCreditPurchase,
  } = useSimulationStore();
  const { toast } = useToast();
  const [isExpenseSheetOpen, setIsExpenseSheetOpen] = useState(false);
  const [isRevenueSheetOpen, setIsRevenueSheetOpen] = useState(false);
  const [isCreditPurchaseSheetOpen, setIsCreditPurchaseSheetOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<SimulationExpense | null>(null);
  const [isEditExpenseSheetOpen, setIsEditExpenseSheetOpen] = useState(false);
  const [editingRevenue, setEditingRevenue] = useState<SimulationRevenue | null>(null);
  const [isEditRevenueSheetOpen, setIsEditRevenueSheetOpen] = useState(false);
  const [editingCreditPurchase, setEditingCreditPurchase] = useState<SimulationCreditPurchase | null>(null);
  const [isEditCreditPurchaseSheetOpen, setIsEditCreditPurchaseSheetOpen] = useState(false);

  useEffect(() => {
    fetchExpenses();
    fetchRevenues();
    fetchAllExpenses();
    fetchAllRevenues();
    fetchCreditPurchases();
    fetchStats();
    fetchProjection(12);
  }, [fetchExpenses, fetchRevenues, fetchAllExpenses, fetchAllRevenues, fetchCreditPurchases, fetchStats, fetchProjection]);

  const handleEditExpense = (expense: SimulationExpense) => {
    setEditingExpense(expense);
    setIsEditExpenseSheetOpen(true);
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta despesa de simulação?')) return;
    try {
      await deleteExpense(id);
      await Promise.all([fetchAllExpenses(), fetchStats(), fetchProjection(12)]);
      toast({
        title: 'Despesa de simulação excluída com sucesso!',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir despesa de simulação',
        description: error.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    }
  };

  const handleEditRevenue = (revenue: SimulationRevenue) => {
    setEditingRevenue(revenue);
    setIsEditRevenueSheetOpen(true);
  };

  const handleDeleteRevenue = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta receita de simulação?')) return;
    try {
      await deleteRevenue(id);
      await Promise.all([fetchAllRevenues(), fetchStats(), fetchProjection(12)]);
      toast({
        title: 'Receita de simulação excluída com sucesso!',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir receita de simulação',
        description: error.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    }
  };

  const handleEditCreditPurchase = (purchase: SimulationCreditPurchase) => {
    setEditingCreditPurchase(purchase);
    setIsEditCreditPurchaseSheetOpen(true);
  };

  const handleDeleteCreditPurchase = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta compra no crédito?')) return;
    try {
      await deleteCreditPurchase(id);
      await Promise.all([fetchStats(), fetchProjection(12)]);
      toast({
        title: 'Compra no crédito excluída com sucesso!',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir compra no crédito',
        description: error.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    }
  };

  const totalExpenses = Array.isArray(expenses) ? expenses.reduce((sum, e) => sum + e.amount, 0) : 0;
  const totalRevenues = Array.isArray(revenues) ? revenues.reduce((sum, r) => sum + r.amount, 0) : 0;
  const totalCreditPayments = Array.isArray(creditPurchases)
    ? creditPurchases.reduce((sum, p) => sum + p.amount, 0)
    : 0;

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold">Simulação de Gastos Futuros</h1>
          <p className="text-sm md:text-base text-muted-foreground">Projete suas finanças futuras</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setIsExpenseSheetOpen(true)} variant="outline" size="sm" className="text-xs md:text-sm">
            <Plus className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Despesa</span>
            <span className="sm:hidden">Desp.</span>
          </Button>
          <Button onClick={() => setIsRevenueSheetOpen(true)} variant="outline" size="sm" className="text-xs md:text-sm">
            <Plus className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Receita</span>
            <span className="sm:hidden">Rec.</span>
          </Button>
          <Button onClick={() => setIsCreditPurchaseSheetOpen(true)} variant="outline" size="sm" className="text-xs md:text-sm">
            <Plus className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Crédito</span>
            <span className="sm:hidden">Créd.</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-expense">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground mt-1">Total projetado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-revenue">{formatCurrency(totalRevenues)}</div>
            <p className="text-xs text-muted-foreground mt-1">Total projetado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Crédito</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{formatCurrency(totalCreditPayments)}</div>
            <p className="text-xs text-muted-foreground mt-1">Total projetado</p>
          </CardContent>
        </Card>
      </div>

      {stats && (
        <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-revenue">{formatCurrency(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground mt-1">Simulação</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Despesa Total</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-expense">{formatCurrency(stats.totalExpense)}</div>
              <p className="text-xs text-muted-foreground mt-1">Simulação</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Crédito Total</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{formatCurrency(stats.totalCreditSpent)}</div>
              <p className="text-xs text-muted-foreground mt-1">Simulação</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Médio</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-xl md:text-2xl font-bold ${stats.averageBalance >= 0 ? 'text-revenue' : 'text-expense'}`}>
                {formatCurrency(stats.averageBalance)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Média projetada</p>
            </CardContent>
          </Card>
        </div>
      )}

      {projection.length > 0 && (
        <>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg">Projeção de Saldo - Próximos 12 Meses</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250} className="min-h-[250px]">
                <AreaChart data={projection.map((m) => ({
                  mes: new Date(m.year, m.month - 1).toLocaleDateString('pt-BR', { month: 'short' }),
                  saldo: m.balance,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="saldo"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                    name="Saldo"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg">Receitas vs Despesas - Próximos 12 Meses</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250} className="min-h-[250px]">
                <BarChart data={projection.map((m) => ({
                  mes: new Date(m.year, m.month - 1).toLocaleDateString('pt-BR', { month: 'short' }),
                  receitas: m.revenues,
                  despesas: m.expenses,
                  credito: m.creditPayments,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="receitas" fill="#10b981" name="Receitas" />
                  <Bar dataKey="despesas" fill="#ef4444" name="Despesas" />
                  <Bar dataKey="credito" fill="#f59e0b" name="Crédito" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg">Evolução do Saldo - Linha do Tempo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250} className="min-h-[250px]">
                <LineChart data={projection.map((m) => ({
                  mes: new Date(m.year, m.month - 1).toLocaleDateString('pt-BR', { month: 'short' }),
                  saldo: m.balance,
                  receitas: m.revenues,
                  despesas: m.expenses + m.creditPayments,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="saldo"
                    stroke="#8884d8"
                    strokeWidth={2}
                    name="Saldo"
                  />
                  <Line
                    type="monotone"
                    dataKey="receitas"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Receitas"
                  />
                  <Line
                    type="monotone"
                    dataKey="despesas"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Despesas"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}

      {/* Lista de Receitas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-revenue" />
            Receitas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : !Array.isArray(allRevenues) || allRevenues.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma receita cadastrada</p>
          ) : (
            <div className="space-y-2">
              {allRevenues.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm md:text-base truncate">{item.name}</p>
                      {item.isMonthly && (
                        <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                          Mensal
                        </span>
                      )}
                      {item.isSimulation && (
                        <span className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded">
                          Simulação
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(item.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <div className="text-right">
                      <p className="font-bold text-sm md:text-base text-revenue">
                        {formatCurrency(item.amount)}
                      </p>
                    </div>
                    {item.isSimulation && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="12" cy="5" r="1" />
                              <circle cx="12" cy="19" r="1" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              const revenue = revenues.find((r) => r.id === item.id);
                              if (revenue) handleEditRevenue(revenue);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteRevenue(item.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Despesas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-expense" />
            Despesas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : !Array.isArray(allExpenses) || allExpenses.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma despesa cadastrada</p>
          ) : (
            <div className="space-y-2">
              {allExpenses.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm md:text-base truncate">{item.name}</p>
                      {item.isMonthly && (
                        <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                          Mensal
                        </span>
                      )}
                      {item.isSimulation && (
                        <span className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded">
                          Simulação
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(item.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <div className="text-right">
                      <p className="font-bold text-sm md:text-base text-expense">
                        {formatCurrency(item.amount)}
                      </p>
                    </div>
                    {item.isSimulation && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="12" cy="5" r="1" />
                              <circle cx="12" cy="19" r="1" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              const expense = expenses.find((e) => e.id === item.id);
                              if (expense) handleEditExpense(expense);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteExpense(item.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Gastos no Crédito */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Gastos no Crédito
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : !Array.isArray(creditPurchases) || creditPurchases.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum gasto no crédito cadastrado para simulação</p>
          ) : (
            <div className="space-y-2">
              {creditPurchases.map((purchase: SimulationCreditPurchase) => (
                <div
                  key={purchase.id}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm md:text-base truncate">{purchase.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(purchase.purchaseDate)} • {purchase.installments}x de{' '}
                      {formatCurrency(purchase.amount / purchase.installments)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <div className="text-right">
                      <p className="font-bold text-sm md:text-base">
                        {formatCurrency(purchase.amount)}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditCreditPurchase(purchase)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteCreditPurchase(purchase.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CreateSimulationExpenseSheet open={isExpenseSheetOpen} onOpenChange={setIsExpenseSheetOpen} />
      <CreateSimulationRevenueSheet open={isRevenueSheetOpen} onOpenChange={setIsRevenueSheetOpen} />
      <CreateSimulationCreditPurchaseSheet
        open={isCreditPurchaseSheetOpen}
        onOpenChange={setIsCreditPurchaseSheetOpen}
      />
      <EditSimulationExpenseSheet
        open={isEditExpenseSheetOpen}
        onOpenChange={(open) => {
          setIsEditExpenseSheetOpen(open);
          if (!open) setEditingExpense(null);
        }}
        expense={editingExpense}
      />
      <EditSimulationRevenueSheet
        open={isEditRevenueSheetOpen}
        onOpenChange={(open) => {
          setIsEditRevenueSheetOpen(open);
          if (!open) setEditingRevenue(null);
        }}
        revenue={editingRevenue}
      />
      <EditSimulationCreditPurchaseSheet
        open={isEditCreditPurchaseSheetOpen}
        onOpenChange={(open) => {
          setIsEditCreditPurchaseSheetOpen(open);
          if (!open) setEditingCreditPurchase(null);
        }}
        purchase={editingCreditPurchase}
      />
    </div>
  );
}

