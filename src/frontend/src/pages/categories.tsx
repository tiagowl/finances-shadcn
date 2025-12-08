import { useEffect, useState } from 'react';
import { useCategoryStore } from '@/stores/categoryStore';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical, Edit, Trash2, Wallet, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { CreateCategorySheet } from '@/components/categories/create-category-sheet';
import { EditCategorySheet } from '@/components/categories/edit-category-sheet';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Category } from '@/types/api';

export function CategoriesPage() {
  const { categories, stats, isLoading, fetchCategories, deleteCategory } = useCategoryStore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsEditSheetOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setDeletingCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;
    try {
      await deleteCategory(deletingCategory.id);
      toast({
        title: 'Categoria excluída com sucesso!',
        variant: 'success',
      });
      setIsDeleteDialogOpen(false);
      setDeletingCategory(null);
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir categoria',
        description: error.response?.data?.error?.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold">Categorias</h1>
          <p className="text-sm md:text-base text-muted-foreground">Gerencie suas categorias de despesas</p>
        </div>
        <Button onClick={() => setIsSheetOpen(true)} size="sm" className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Categoria
        </Button>
      </div>

      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <>
          {stats && (
            <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Orçamentos Máximos</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold">{formatCurrency(stats.totalBudgetMax)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Soma de todos os orçamentos</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold text-expense">
                    {formatCurrency(stats.totalSpent)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Total gasto em todas as categorias</p>
                </CardContent>
              </Card>
            </div>
          )}

          {!Array.isArray(categories) || categories.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma categoria cadastrada</p>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs md:text-sm">Nome</TableHead>
                      <TableHead className="text-right text-xs md:text-sm">Orçamento Máximo</TableHead>
                      <TableHead className="text-right text-xs md:text-sm">Gasto</TableHead>
                      <TableHead className="text-right text-xs md:text-sm">Restante</TableHead>
                      <TableHead className="text-right text-xs md:text-sm w-[50px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium text-sm">{category.name}</TableCell>
                        <TableCell className="text-right text-sm md:text-base">
                          {formatCurrency(category.budgetMax)}
                        </TableCell>
                        <TableCell className="text-right text-sm md:text-base text-expense">
                          {formatCurrency(category.totalSpent ?? 0)}
                        </TableCell>
                        <TableCell
                          className={`text-right text-sm md:text-base ${
                            (category.remaining ?? 0) < 0 ? 'text-destructive' : 'text-muted-foreground'
                          }`}
                        >
                          {formatCurrency(category.remaining ?? category.budgetMax)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(category)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(category)}
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
        </>
      )}

      <CreateCategorySheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
      <EditCategorySheet
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        category={editingCategory}
      />
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a categoria "{deletingCategory?.name}"? Esta ação não pode ser desfeita.
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

