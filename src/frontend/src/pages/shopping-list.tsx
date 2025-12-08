import { useEffect, useState, useMemo } from 'react';
import { useShoppingListStore } from '@/stores/shoppingListStore';
import { useExpenseStore } from '@/stores/expenseStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical, Edit, Trash2, Trash, ShoppingBag, CheckCircle2, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { apiService } from '@/services/api';
import { CreateShoppingListItemSheet } from '@/components/shopping-list/create-shopping-list-item-sheet';
import { EditShoppingListItemSheet } from '@/components/shopping-list/edit-shopping-list-item-sheet';
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
import { Checkbox } from '@/components/ui/checkbox';
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
import type { ShoppingListItem } from '@/types/api';

export function ShoppingListPage() {
  const { items, stats, isLoading, fetchItems, fetchStats, toggleItem, deleteItem, clearList } = useShoppingListStore();
  const { addExpense, fetchExpenses } = useExpenseStore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingListItem | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<ShoppingListItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isCompleteListDialogOpen, setIsCompleteListDialogOpen] = useState(false);
  const [isCompletingList, setIsCompletingList] = useState(false);
  const { toast } = useToast();

  const { filters, setSearch, setSort, setPage, resetFilters } = useTableFilters<ShoppingListItem>({}, 10);

  useEffect(() => {
    fetchItems();
    fetchStats();
  }, [fetchItems, fetchStats]);

  const handleEdit = (item: ShoppingListItem) => {
    setEditingItem(item);
    setIsEditSheetOpen(true);
  };

  const handleDeleteClick = (item: ShoppingListItem) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    try {
      await deleteItem(deletingItem.id);
      toast({
        title: 'Item excluído com sucesso!',
        variant: 'success',
      });
      setIsDeleteDialogOpen(false);
      setDeletingItem(null);
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir item',
        description: error.response?.data?.error?.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    }
  };

  const handleToggle = async (item: ShoppingListItem) => {
    try {
      await toggleItem(item.id);
      await fetchStats();
      toast({
        title: item.isPurchased ? 'Item marcado como não comprado' : 'Item marcado como comprado',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar item',
        description: error.response?.data?.error?.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    }
  };

  const handleClearList = async () => {
    try {
      await clearList();
      await fetchStats();
      setIsClearDialogOpen(false);
      toast({
        title: 'Lista limpa com sucesso!',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao limpar lista',
        description: error.response?.data?.error?.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    }
  };

  const pendingItems = Array.isArray(items) ? items.filter((item) => !item.isPurchased) : [];
  const purchasedItems = Array.isArray(items) ? items.filter((item) => item.isPurchased) : [];
  
  const hasPurchasedItems = purchasedItems.length > 0;
  
  const handleCompleteList = () => {
    if (!hasPurchasedItems) return;
    setIsCompleteListDialogOpen(true);
  };

  const handleConfirmCompleteList = async () => {
    if (!hasPurchasedItems) return;
    
    setIsCompletingList(true);
    try {
      // Calculate total amount
      const totalAmount = purchasedItems.reduce((sum, item) => sum + item.price, 0);
      
      // Create items list for notes
      const itemsList = purchasedItems.map((item) => `- ${item.name} (${formatCurrency(item.price)})`).join('\n');
      const maxNotesLength = 500;
      const notesPrefix = 'Itens comprados:\n';
      const availableLength = maxNotesLength - notesPrefix.length;
      const notes = itemsList.length > availableLength
        ? `${notesPrefix}${itemsList.substring(0, availableLength - 3)}...`
        : `${notesPrefix}${itemsList}`;
      
      // Create expense with local date (not UTC)
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const today = `${year}-${month}-${day}`;
      
      const expense = await apiService.createExpense({
        name: 'compras',
        amount: totalAmount,
        date: today,
        categoryId: null,
        notes: notes,
      });
      
      addExpense(expense);
      await fetchExpenses();
      
      // Remove all purchased items from the shopping list
      for (const item of purchasedItems) {
        await deleteItem(item.id);
      }
      
      await fetchStats();
      
      setIsCompleteListDialogOpen(false);
      
      toast({
        title: 'Lista concluída com sucesso!',
        description: `Despesa de ${formatCurrency(totalAmount)} adicionada às despesas e itens removidos da lista.`,
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao concluir lista',
        description: error.response?.data?.error?.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setIsCompletingList(false);
    }
  };

  // Filter, sort and paginate pending items
  const filteredAndSortedPending = useMemo(() => {
    return filterAndSort(
      pendingItems,
      filters.search,
      ['name'],
      filters.sortField,
      filters.sortDirection
    );
  }, [pendingItems, filters.search, filters.sortField, filters.sortDirection]);

  const paginatedPending = useMemo(() => {
    return paginate(filteredAndSortedPending, filters.page, filters.pageSize);
  }, [filteredAndSortedPending, filters.page, filters.pageSize]);

  const totalPagesPending = useMemo(() => {
    return getTotalPages(filteredAndSortedPending.length, filters.pageSize);
  }, [filteredAndSortedPending.length, filters.pageSize]);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold">Lista de Compras</h1>
          <p className="text-sm md:text-base text-muted-foreground">Gerencie sua lista de compras</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto flex-wrap">
          {hasPurchasedItems && (
            <Button
              onClick={handleCompleteList}
              size="sm"
              disabled={isCompletingList}
              className="w-full sm:w-auto"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Lista Concluída
            </Button>
          )}
          {Array.isArray(items) && items.length > 0 && (
            <Button
              onClick={() => setIsClearDialogOpen(true)}
              size="sm"
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Trash className="mr-2 h-4 w-4" />
              Limpar Lista
            </Button>
          )}
          <Button onClick={() => setIsSheetOpen(true)} size="sm" className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Item
          </Button>
        </div>
      </div>

      {stats && (
        <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{stats.totalItems}</div>
              <p className="text-xs text-muted-foreground mt-1">Itens na lista</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{stats.pendingItems}</div>
              <p className="text-xs text-muted-foreground mt-1">Aguardando</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comprados</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{stats.purchasedItems}</div>
              <p className="text-xs text-muted-foreground mt-1">Concluídos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{formatCurrency(stats.totalPrice)}</div>
              <p className="text-xs text-muted-foreground mt-1">Valor total</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Itens Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Carregando...</p>
          ) : pendingItems.length === 0 ? (
            <p className="text-muted-foreground">Nenhum item pendente</p>
          ) : (
            <div className="space-y-4">
              <TableFilters
                search={filters.search}
                onSearchChange={setSearch}
                searchPlaceholder="Buscar por nome..."
                sortField={filters.sortField}
                sortDirection={filters.sortDirection}
                sortOptions={[
                  { field: 'price', label: 'Preço' },
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
                          <TableHead className="w-10 md:w-12"></TableHead>
                          <TableHead className="text-xs md:text-sm">Nome</TableHead>
                          <TableHead className="text-right text-xs md:text-sm">Preço</TableHead>
                          <TableHead className="text-right text-xs md:text-sm w-[50px]">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedPending.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Checkbox
                                checked={item.isPurchased}
                                onCheckedChange={() => handleToggle(item)}
                                className="h-4 w-4"
                              />
                            </TableCell>
                            <TableCell className="font-medium text-sm">{item.name}</TableCell>
                            <TableCell className="text-right text-sm md:text-base">{formatCurrency(item.price)}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEdit(item)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteClick(item)}
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
                  {totalPagesPending > 1 && (
                    <div className="border-t p-4">
                      <Pagination
                        currentPage={filters.page}
                        totalPages={totalPagesPending}
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
                        <TableHead className="w-10"></TableHead>
                        <TableHead className="text-xs">Nome</TableHead>
                        <TableHead className="text-right text-xs">Preço</TableHead>
                        <TableHead className="text-right text-xs w-[50px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedPending.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Checkbox
                              checked={item.isPurchased}
                              onCheckedChange={() => handleToggle(item)}
                              className="h-4 w-4"
                            />
                          </TableCell>
                          <TableCell className="font-medium text-sm">{item.name}</TableCell>
                          <TableCell className="text-right text-sm">{formatCurrency(item.price)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(item)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteClick(item)}
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base md:text-lg">Itens Comprados</CardTitle>
        </CardHeader>
        <CardContent>
          {purchasedItems.length === 0 ? (
            <p className="text-muted-foreground">Nenhum item comprado</p>
          ) : (
            <div className="rounded-md border overflow-hidden">
              {/* Desktop: Table with scroll */}
              <div className="hidden md:block">
                <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                      <TableRow>
                        <TableHead className="w-10 md:w-12"></TableHead>
                        <TableHead className="text-xs md:text-sm">Nome</TableHead>
                        <TableHead className="text-right text-xs md:text-sm">Preço</TableHead>
                        <TableHead className="text-right text-xs md:text-sm w-[50px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchasedItems.map((item) => (
                        <TableRow key={item.id} className="opacity-60">
                          <TableCell>
                            <Checkbox
                              checked={item.isPurchased}
                              onCheckedChange={() => handleToggle(item)}
                              className="h-4 w-4"
                            />
                          </TableCell>
                          <TableCell className="font-medium line-through text-sm">{item.name}</TableCell>
                          <TableCell className="text-right text-sm md:text-base">{formatCurrency(item.price)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(item)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteClick(item)}
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

              {/* Mobile: Scrollable list */}
              <div className="md:hidden max-h-[400px] overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead className="text-xs">Nome</TableHead>
                      <TableHead className="text-right text-xs">Preço</TableHead>
                      <TableHead className="text-right text-xs w-[50px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchasedItems.map((item) => (
                      <TableRow key={item.id} className="opacity-60">
                        <TableCell>
                          <Checkbox
                            checked={item.isPurchased}
                            onCheckedChange={() => handleToggle(item)}
                            className="h-4 w-4"
                          />
                        </TableCell>
                        <TableCell className="font-medium line-through text-sm">{item.name}</TableCell>
                        <TableCell className="text-right text-sm">{formatCurrency(item.price)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(item)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(item)}
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
          )}
        </CardContent>
      </Card>

      <CreateShoppingListItemSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
      <EditShoppingListItemSheet
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        item={editingItem}
      />
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o item "{deletingItem?.name}"? Esta ação não pode ser desfeita.
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

      <Dialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Limpar Lista de Compras</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja limpar toda a lista de compras? Esta ação irá excluir todos os itens e não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsClearDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleClearList}>
              Limpar Lista
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCompleteListDialogOpen} onOpenChange={setIsCompleteListDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Concluir Lista de Compras</DialogTitle>
            <DialogDescription>
              Ao concluir a lista, uma despesa será criada com o total dos itens comprados ({formatCurrency(purchasedItems.reduce((sum, item) => sum + item.price, 0))}) e os itens comprados serão removidos da lista. Deseja continuar?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCompleteListDialogOpen(false)}
              disabled={isCompletingList}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmCompleteList}
              disabled={isCompletingList}
            >
              {isCompletingList ? 'Processando...' : 'Concluir Lista'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

