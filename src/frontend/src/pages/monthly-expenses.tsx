import { useEffect, useState, useMemo } from 'react';
import { useMonthlyExpenseStore } from '@/stores/monthlyExpenseStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical, Edit, Trash2, ExternalLink, Copy, CalendarDays } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { CreateMonthlyExpenseSheet } from '@/components/monthly-expenses/create-monthly-expense-sheet';
import { EditMonthlyExpenseSheet } from '@/components/monthly-expenses/edit-monthly-expense-sheet';
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
import type { MonthlyExpense } from '@/types/api';

export function MonthlyExpensesPage() {
  const { monthlyExpenses, isLoading, fetchMonthlyExpenses, deleteMonthlyExpense } = useMonthlyExpenseStore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<MonthlyExpense | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [deletingExpense, setDeletingExpense] = useState<MonthlyExpense | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const { filters, setSearch, setSort, setPage, resetFilters } = useTableFilters<MonthlyExpense>({}, 10);

  useEffect(() => {
    fetchMonthlyExpenses();
  }, [fetchMonthlyExpenses]);

  // Filter, sort and paginate monthly expenses
  const filteredAndSortedExpenses = useMemo(() => {
    if (!Array.isArray(monthlyExpenses)) return [];
    return filterAndSort(
      monthlyExpenses,
      filters.search,
      ['name'],
      filters.sortField,
      filters.sortDirection
    );
  }, [monthlyExpenses, filters.search, filters.sortField, filters.sortDirection]);

  const paginatedExpenses = useMemo(() => {
    return paginate(filteredAndSortedExpenses, filters.page, filters.pageSize);
  }, [filteredAndSortedExpenses, filters.page, filters.pageSize]);

  const totalPages = useMemo(() => {
    return getTotalPages(filteredAndSortedExpenses.length, filters.pageSize);
  }, [filteredAndSortedExpenses.length, filters.pageSize]);

  const totalExpense = Array.isArray(monthlyExpenses)
    ? monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    : 0;

  const handleEdit = (expense: MonthlyExpense) => {
    setEditingExpense(expense);
    setIsEditSheetOpen(true);
  };

  const handleDeleteClick = (expense: MonthlyExpense) => {
    setDeletingExpense(expense);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingExpense) return;
    try {
      await deleteMonthlyExpense(deletingExpense.id);
      toast({
        title: 'Despesa mensal excluída com sucesso!',
        variant: 'success',
      });
      setIsDeleteDialogOpen(false);
      setDeletingExpense(null);
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir despesa mensal',
        description: error.response?.data?.error?.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    }
  };

  const handleOpenCancellationLink = (link: string) => {
    window.open(link, '_blank');
  };

  const handleCopyCancellationLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: 'Link copiado!',
      variant: 'success',
    });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold">Despesas Mensais</h1>
          <p className="text-sm md:text-base text-muted-foreground">Gerencie suas despesas recorrentes</p>
        </div>
        <Button onClick={() => setIsSheetOpen(true)} size="sm" className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Adicionar Despesa Mensal</span>
          <span className="sm:hidden">Adicionar</span>
        </Button>
      </div>

      <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Despesas Mensais</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-expense">
              {formatCurrency(totalExpense)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total recorrente mensal</p>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <p>Carregando...</p>
      ) : !Array.isArray(monthlyExpenses) || monthlyExpenses.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma despesa mensal cadastrada</p>
      ) : (
        <div className="space-y-4">
          <TableFilters
            search={filters.search}
            onSearchChange={setSearch}
            searchPlaceholder="Buscar por nome..."
            sortField={filters.sortField}
            sortDirection={filters.sortDirection}
            sortOptions={[
              { field: 'dayOfMonth', label: 'Dia do Mês' },
              { field: 'amount', label: 'Valor' },
            ]}
            onSortChange={setSort}
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
                      <TableHead className="text-xs md:text-sm">Dia do Mês</TableHead>
                      <TableHead className="text-xs md:text-sm">Link de Cancelamento</TableHead>
                      <TableHead className="text-right text-xs md:text-sm">Valor</TableHead>
                      <TableHead className="text-right text-xs md:text-sm w-[50px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium text-sm">{expense.name}</TableCell>
                        <TableCell className="text-sm">Dia {expense.dayOfMonth}</TableCell>
                        <TableCell className="text-sm">
                          {expense.cancellationLink ? (
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenCancellationLink(expense.cancellationLink!)}
                                className="h-7 text-xs"
                              >
                                <ExternalLink className="mr-1 h-3 w-3" />
                                Abrir
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopyCancellationLink(expense.cancellationLink!)}
                                className="h-7 text-xs"
                              >
                                <Copy className="mr-1 h-3 w-3" />
                                Copiar
                              </Button>
                            </div>
                          ) : (
                            '-'
                          )}
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
                    <TableHead className="text-xs">Dia</TableHead>
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
                          {expense.cancellationLink && (
                            <div className="flex gap-1 mt-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenCancellationLink(expense.cancellationLink!)}
                                className="h-6 text-xs px-2"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">Dia {expense.dayOfMonth}</TableCell>
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

      <CreateMonthlyExpenseSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
      <EditMonthlyExpenseSheet
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        expense={editingExpense}
      />
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a despesa mensal "{deletingExpense?.name}"? Esta ação não pode ser desfeita.
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

