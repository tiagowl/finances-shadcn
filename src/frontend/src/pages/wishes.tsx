import { useEffect, useState, useMemo } from 'react';
import { useWishStore } from '@/stores/wishStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { useExpenseStore } from '@/stores/expenseStore';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical, Edit, Trash2, ExternalLink, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { apiService } from '@/services/api';
import { CreateWishSheet } from '@/components/wishes/create-wish-sheet';
import { EditWishSheet } from '@/components/wishes/edit-wish-sheet';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import type { Wish } from '@/types/api';

export function WishesPage() {
  const { wishes, isLoading, fetchWishes, deleteWish, removeWish } = useWishStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { fetchExpenses } = useExpenseStore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingWish, setEditingWish] = useState<Wish | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [deletingWish, setDeletingWish] = useState<Wish | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [purchasingWish, setPurchasingWish] = useState<Wish | null>(null);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [purchaseWarning, setPurchaseWarning] = useState<{ budgetExceeded: boolean; remaining: number } | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState<string>('');
  const { toast } = useToast();

  const { filters, setSearch, setSort, setPage, setCategoryFilter, resetFilters } = useTableFilters<Wish>({}, 10);

  useEffect(() => {
    fetchWishes();
    fetchCategories();
  }, [fetchWishes, fetchCategories]);

  // Filter, sort and paginate wishes
  const filteredAndSortedWishes = useMemo(() => {
    if (!Array.isArray(wishes)) return [];
    return filterAndSort(
      wishes,
      filters.search,
      ['name'],
      filters.sortField,
      filters.sortDirection,
      filters.categoryFilter,
      undefined,
      'categoryId'
    );
  }, [wishes, filters.search, filters.sortField, filters.sortDirection, filters.categoryFilter]);

  const paginatedWishes = useMemo(() => {
    return paginate(filteredAndSortedWishes, filters.page, filters.pageSize);
  }, [filteredAndSortedWishes, filters.page, filters.pageSize]);

  const totalPages = useMemo(() => {
    return getTotalPages(filteredAndSortedWishes.length, filters.pageSize);
  }, [filteredAndSortedWishes.length, filters.pageSize]);

  const categoryOptions = useMemo(() => {
    if (!Array.isArray(categories)) return [];
    return categories.map((cat) => ({
      value: cat.id,
      label: cat.name,
    }));
  }, [categories]);

  const handleEdit = (wish: Wish) => {
    setEditingWish(wish);
    setIsEditSheetOpen(true);
  };

  const handleDeleteClick = (wish: Wish) => {
    setDeletingWish(wish);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingWish) return;
    try {
      await deleteWish(deletingWish.id);
      toast({
        title: 'Desejo excluído com sucesso!',
        variant: 'success',
      });
      setIsDeleteDialogOpen(false);
      setDeletingWish(null);
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir desejo',
        description: error.response?.data?.error?.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    }
  };

  const handleOpenLink = (link: string) => {
    window.open(link, '_blank');
  };

  const handlePurchaseClick = (wish: Wish) => {
    setPurchasingWish(wish);
    setPurchaseWarning(null);
    // Pre-fill with wish values if available
    setPurchaseAmount(wish.amount ? wish.amount.toString() : '');
    setIsPurchaseDialogOpen(true);
  };

  const handlePurchaseConfirm = async () => {
    if (!purchasingWish) return;

    // Validate amount
    const amount = parseFloat(purchaseAmount);
    if (!amount || amount <= 0) {
      toast({
        title: 'Erro',
        description: 'Por favor, informe um valor válido para a compra',
        variant: 'destructive',
      });
      return;
    }

    try {
      const result = await apiService.purchaseWish(
        purchasingWish.id,
        amount,
        new Date().toISOString().split('T')[0]
      );

      if (result.budgetExceeded && !purchaseWarning) {
        // Show warning first time - purchase already done, just need confirmation
        setPurchaseWarning({ budgetExceeded: true, remaining: result.remaining });
        return;
      }

      // Close dialog and refresh
      removeWish(purchasingWish.id);
      await fetchExpenses();
      await fetchWishes();
      setIsPurchaseDialogOpen(false);
      setPurchaseWarning(null);
      setPurchasingWish(null);
      setPurchaseAmount('');

      toast({
        title: 'Desejo comprado com sucesso!',
        description: result.budgetExceeded
          ? 'O desejo foi adicionado às despesas, mesmo ultrapassando o orçamento'
          : 'O desejo foi adicionado às suas despesas',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao comprar desejo',
        description: error.response?.data?.error?.message || 'Erro desconhecido',
        variant: 'destructive',
      });
      setIsPurchaseDialogOpen(false);
      setPurchaseWarning(null);
      setPurchasingWish(null);
      setPurchaseAmount('');
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold">Lista de Desejos</h1>
          <p className="text-sm md:text-base text-muted-foreground">Gerencie seus desejos e sonhos</p>
        </div>
        <Button onClick={() => setIsSheetOpen(true)} size="sm" className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Desejo
        </Button>
      </div>

      {isLoading ? (
        <p>Carregando...</p>
      ) : !Array.isArray(wishes) || wishes.length === 0 ? (
        <p className="text-muted-foreground">Nenhum desejo cadastrado</p>
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
                      <TableHead className="text-xs md:text-sm">Categoria</TableHead>
                      <TableHead className="text-xs md:text-sm">Valor</TableHead>
                      <TableHead className="text-xs md:text-sm">Link de Compra</TableHead>
                      <TableHead className="text-right text-xs md:text-sm w-[50px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedWishes.map((wish) => {
                      const category = categories.find((c) => c.id === wish.categoryId);
                      return (
                        <TableRow key={wish.id}>
                          <TableCell className="font-medium text-sm">{wish.name}</TableCell>
                          <TableCell className="text-sm">{category ? category.name : '-'}</TableCell>
                          <TableCell className="text-sm">{wish.amount ? formatCurrency(wish.amount) : '-'}</TableCell>
                          <TableCell className="text-sm">
                            {wish.purchaseLink ? (
                              <Button
                                variant="link"
                                size="sm"
                                className="p-0 h-auto"
                                onClick={() => handleOpenLink(wish.purchaseLink!)}
                              >
                                <ExternalLink className="mr-1 h-3 w-3" />
                                Ver Link
                              </Button>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePurchaseClick(wish)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle2 className="mr-1 h-4 w-4" />
                                Comprado
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEdit(wish)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteClick(wish)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
                    <TableHead className="text-xs">Categoria</TableHead>
                    <TableHead className="text-right text-xs">Valor</TableHead>
                    <TableHead className="text-right text-xs w-[50px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedWishes.map((wish) => {
                    const category = categories.find((c) => c.id === wish.categoryId);
                    return (
                      <TableRow key={wish.id}>
                        <TableCell className="font-medium text-sm">
                          <div>
                            <p className="truncate max-w-[150px]">{wish.name}</p>
                            {wish.purchaseLink && (
                              <Button
                                variant="link"
                                size="sm"
                                className="p-0 h-auto text-xs"
                                onClick={() => handleOpenLink(wish.purchaseLink!)}
                              >
                                <ExternalLink className="mr-1 h-3 w-3" />
                                Ver Link
                              </Button>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{category ? category.name : '-'}</TableCell>
                        <TableCell className="text-right text-sm">
                          {wish.amount ? formatCurrency(wish.amount) : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePurchaseClick(wish)}
                              className="text-green-600 hover:text-green-700 h-7 px-2"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(wish)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteClick(wish)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}

      <CreateWishSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
      <EditWishSheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen} wish={editingWish} />
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o desejo "{deletingWish?.name}"? Esta ação não pode ser desfeita.
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

      <Dialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Compra</DialogTitle>
            <DialogDescription>
              {purchaseWarning?.budgetExceeded ? (
                <>
                  <p className="mb-2">
                    A categoria atingiu ou ultrapassou o orçamento máximo no mês atual.
                  </p>
                  <p className="mb-2">
                    Restante após a compra: <strong>{formatCurrency(purchaseWarning.remaining)}</strong>
                  </p>
                  <p>
                    Deseja registrar a compra mesmo assim?
                  </p>
                </>
              ) : (
                <>
                  <p className="mb-4">
                    Marcar o desejo "{purchasingWish?.name}" como comprado criará uma despesa e removerá o desejo da lista.
                  </p>
                  {(!purchasingWish?.amount || purchasingWish.amount <= 0) && (
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="purchaseAmount">Valor da Compra *</Label>
                      <Input
                        id="purchaseAmount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={purchaseAmount}
                        onChange={(e) => setPurchaseAmount(e.target.value)}
                      />
                    </div>
                  )}
                  {purchasingWish?.amount && purchasingWish.amount > 0 && (
                    <p className="mb-4 text-sm text-muted-foreground">
                      Valor: <strong>{formatCurrency(purchasingWish.amount)}</strong>
                    </p>
                  )}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsPurchaseDialogOpen(false);
                setPurchaseWarning(null);
                setPurchasingWish(null);
                setPurchaseAmount('');
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handlePurchaseConfirm}>
              {purchaseWarning?.budgetExceeded ? 'Entendido' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

