import { useEffect, useState, useMemo } from 'react';
import { useExpenseStore } from '@/stores/expenseStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical, Edit, Trash2, TrendingDown } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { CreateExpenseSheet } from '@/components/expenses/create-expense-sheet';
import { EditExpenseSheet } from '@/components/expenses/edit-expense-sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { TableFilters } from '@/components/ui/table-filters';
import { useTableFilters } from '@/hooks/use-table-filters';
import { filterAndSort, paginate, getTotalPages } from '@/utils/table-utils';
import type { Expense } from '@/types/api';

export function ExpensesPage() {
  const { expenses, isLoading, fetchExpenses, deleteExpense } = useExpenseStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const { filters, setSearch, setSort, setPage, setCategoryFilter, setDateFilter, resetFilters } = useTableFilters<Expense>({}, 10);

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, [fetchExpenses, fetchCategories]);

  // Filter, sort and paginate expenses
  const filteredAndSortedExpenses = useMemo(() => {
    if (!Array.isArray(expenses)) return [];
    return filterAndSort(
      expenses,
      filters.search,
      ['name'],
      filters.sortField,
      filters.sortDirection,
      filters.categoryFilter,
      filters.dateFilter,
      'categoryId',
      'date'
    );
  }, [expenses, filters.search, filters.sortField, filters.sortDirection, filters.categoryFilter, filters.dateFilter]);

  const paginatedExpenses = useMemo(() => {
    return paginate(filteredAndSortedExpenses, filters.page, filters.pageSize);
  }, [filteredAndSortedExpenses, filters.page, filters.pageSize]);

  const totalPages = useMemo(() => {
    return getTotalPages(filteredAndSortedExpenses.length, filters.pageSize);
  }, [filteredAndSortedExpenses.length, filters.pageSize]);

  const totalExpense = Array.isArray(expenses)
    ? expenses.reduce((sum, expense) => sum + expense.amount, 0)
    : 0;

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId || !Array.isArray(categories)) {
      return 'Sem categoria';
    }
    return categories.find((c) => c.id === categoryId)?.name || 'Sem categoria';
  };

  const categoryOptions = useMemo(() => {
    if (!Array.isArray(categories)) return [];
    return categories.map((cat) => ({
      value: cat.id,
      label: cat.name,
    }));
  }, [categories]);

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsEditSheetOpen(true);
  };

  const handleDeleteClick = (expense: Expense) => {
    setDeletingExpense(expense);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingExpense) return;
    try {
      await deleteExpense(deletingExpense.id);
      toast({
        title: 'Despesa excluída com sucesso!',
        variant: 'success',
      });
      setIsDeleteDialogOpen(false);
      setDeletingExpense(null);
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir despesa',
        description: error.response?.data?.error?.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold">Despesas</h1>
          <p className="text-sm md:text-base text-muted-foreground">Gerencie suas despesas</p>
        </div>
        <Button onClick={() => setIsSheetOpen(true)} size="sm" className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Despesa
        </Button>
      </div>

      <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-expense">
              {formatCurrency(totalExpense)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total acumulado</p>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <p>Carregando...</p>
      ) : !Array.isArray(expenses) || expenses.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma despesa cadastrada</p>
      ) : (
        <div className="space-y-4">
          <TableFilters
            search={filters.search}
            onSearchChange={setSearch}
            searchPlaceholder="Buscar por nome..."
            sortField={filters.sortField}
            sortDirection={filters.sortDirection}
            sortOptions={[
              { field: 'amount', label: 'Valor' },
            ]}
            onSortChange={setSort}
            categoryFilter={filters.categoryFilter}
            categoryOptions={categoryOptions}
            onCategoryFilterChange={setCategoryFilter}
            dateFilter={filters.dateFilter}
            onDateFilterChange={setDateFilter}
            onReset={resetFilters}
          />

          <div className="rounded-md border overflow-hidden">
            {/* Desktop: Table with pagination */}
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs md:text-sm">Nome</TableHead>
                      <TableHead className="text-xs md:text-sm">Data</TableHead>
                      <TableHead className="text-xs md:text-sm">Categoria</TableHead>
                      <TableHead className="text-xs md:text-sm max-w-[200px]">Observações</TableHead>
                      <TableHead className="text-right text-xs md:text-sm">Valor</TableHead>
                      <TableHead className="text-right text-xs md:text-sm w-[50px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium text-sm">{expense.name}</TableCell>
                        <TableCell className="text-sm">{formatDate(expense.date)}</TableCell>
                        <TableCell className="text-sm">{getCategoryName(expense.categoryId)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[200px]">
                          <p className="truncate" title={expense.notes || undefined}>{expense.notes || '-'}</p>
                        </TableCell>
                        <TableCell className="text-right font-bold text-expense text-sm md:text-base">
                          {formatCurrency(expense.amount)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(expense)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(expense)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {totalPages > 1 && (
                <div className="border-t p-4">
                  <Pagination
                    currentPage={filters.page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </div>

            {/* Mobile: Scrollable list */}
            <div className="md:hidden max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="text-xs">Nome</TableHead>
                    <TableHead className="text-xs">Data</TableHead>
                    <TableHead className="text-right text-xs">Valor</TableHead>
                    <TableHead className="text-right text-xs w-[50px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium text-sm">
                        <div>
                          <p className="truncate max-w-[150px]">{expense.name}</p>
                          <p className="text-xs text-muted-foreground">{getCategoryName(expense.categoryId)}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[150px]" title={expense.notes || undefined}>{expense.notes || '-'}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{formatDate(expense.date)}</TableCell>
                      <TableCell className="text-right font-bold text-expense text-sm">
                        {formatCurrency(expense.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(expense)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(expense)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}

      <CreateExpenseSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        categories={categories}
      />
      <EditExpenseSheet
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        expense={editingExpense}
        categories={categories}
      />
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a despesa "{deletingExpense?.name}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

