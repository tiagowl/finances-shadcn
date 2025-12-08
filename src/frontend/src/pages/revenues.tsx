import { useEffect, useState, useMemo } from 'react';
import { useRevenueStore } from '@/stores/revenueStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical, Edit, Trash2, TrendingUp } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { CreateRevenueSheet } from '@/components/revenues/create-revenue-sheet';
import { EditRevenueSheet } from '@/components/revenues/edit-revenue-sheet';
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
import type { Revenue } from '@/types/api';

export function RevenuesPage() {
  const { revenues, isLoading, fetchRevenues, deleteRevenue } = useRevenueStore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingRevenue, setEditingRevenue] = useState<Revenue | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [deletingRevenue, setDeletingRevenue] = useState<Revenue | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const { filters, setSearch, setSort, setPage, setDateFilter, resetFilters } = useTableFilters<Revenue>({}, 10);

  useEffect(() => {
    fetchRevenues();
  }, [fetchRevenues]);

  // Filter, sort and paginate revenues
  const filteredAndSortedRevenues = useMemo(() => {
    if (!Array.isArray(revenues)) return [];
    return filterAndSort(
      revenues,
      filters.search,
      ['name'],
      filters.sortField,
      filters.sortDirection,
      undefined,
      filters.dateFilter,
      undefined,
      'date'
    );
  }, [revenues, filters.search, filters.sortField, filters.sortDirection, filters.dateFilter]);

  const paginatedRevenues = useMemo(() => {
    return paginate(filteredAndSortedRevenues, filters.page, filters.pageSize);
  }, [filteredAndSortedRevenues, filters.page, filters.pageSize]);

  const totalPages = useMemo(() => {
    return getTotalPages(filteredAndSortedRevenues.length, filters.pageSize);
  }, [filteredAndSortedRevenues.length, filters.pageSize]);

  const totalRevenue = Array.isArray(revenues) 
    ? revenues.reduce((sum, revenue) => sum + revenue.amount, 0)
    : 0;

  const handleEdit = (revenue: Revenue) => {
    setEditingRevenue(revenue);
    setIsEditSheetOpen(true);
  };

  const handleDeleteClick = (revenue: Revenue) => {
    setDeletingRevenue(revenue);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingRevenue) return;
    try {
      await deleteRevenue(deletingRevenue.id);
      toast({
        title: 'Receita excluída com sucesso!',
        variant: 'success',
      });
      setIsDeleteDialogOpen(false);
      setDeletingRevenue(null);
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir receita',
        description: error.response?.data?.error?.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold">Receitas</h1>
          <p className="text-sm md:text-base text-muted-foreground">Gerencie suas receitas</p>
        </div>
        <Button onClick={() => setIsSheetOpen(true)} size="sm" className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Receita
        </Button>
      </div>

      <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-revenue">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total acumulado</p>
          </CardContent>
        </Card>
      </div>

      <>
        {isLoading ? (
          <p>Carregando...</p>
        ) : !Array.isArray(revenues) || revenues.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma receita cadastrada</p>
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
                        <TableHead className="text-xs md:text-sm max-w-[200px]">Observações</TableHead>
                        <TableHead className="text-right text-xs md:text-sm">Valor</TableHead>
                        <TableHead className="text-right text-xs md:text-sm w-[50px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedRevenues.map((revenue) => (
                        <TableRow key={revenue.id}>
                          <TableCell className="font-medium text-sm">{revenue.name}</TableCell>
                          <TableCell className="text-sm">{formatDate(revenue.date)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-[200px]">
                            <p className="truncate" title={revenue.notes || undefined}>{revenue.notes || '-'}</p>
                          </TableCell>
                          <TableCell className="text-right font-bold text-revenue text-sm md:text-base">
                            {formatCurrency(revenue.amount)}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(revenue)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteClick(revenue)}
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
                    {filteredAndSortedRevenues.map((revenue) => (
                        <TableRow key={revenue.id}>
                          <TableCell className="font-medium text-sm">
                            <div>
                              <p className="truncate max-w-[150px]">{revenue.name}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[150px]" title={revenue.notes || undefined}>{revenue.notes || '-'}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{formatDate(revenue.date)}</TableCell>
                          <TableCell className="text-right font-bold text-revenue text-sm">
                            {formatCurrency(revenue.amount)}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(revenue)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteClick(revenue)}
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

        <CreateRevenueSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
        <EditRevenueSheet
          open={isEditSheetOpen}
          onOpenChange={setIsEditSheetOpen}
          revenue={editingRevenue}
        />
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir a receita "{deletingRevenue?.name}"? Esta ação não pode ser desfeita.
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
      </>
    </div>
  );
}

