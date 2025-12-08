import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema, type CategoryFormData } from '@/utils/validators';
import { useCategoryStore } from '@/stores/categoryStore';
import { apiService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Category } from '@/types/api';
import { useEffect } from 'react';

interface EditCategorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
}

export function EditCategorySheet({
  open,
  onOpenChange,
  category,
}: EditCategorySheetProps) {
  const { updateCategory, fetchCategories } = useCategoryStore();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    if (category) {
      setValue('name', category.name);
      setValue('budgetMax', category.budgetMax);
      setValue('color', category.color || '');
    }
  }, [category, setValue]);

  const onSubmit = async (data: CategoryFormData) => {
    if (!category) return;
    try {
      // Convert empty color string to undefined
      const categoryData = {
        ...data,
        color: data.color && data.color.trim() !== '' ? data.color : undefined,
      };
      const updatedCategory = await apiService.updateCategory(category.id, categoryData);
      updateCategory(category.id, updatedCategory);
      await fetchCategories();
      reset();
      onOpenChange(false);
      toast({
        title: 'Categoria atualizada com sucesso!',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar categoria',
        description: error.response?.data?.error?.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <SheetHeader>
            <SheetTitle>Editar Categoria</SheetTitle>
            <SheetDescription>Atualize as informações da categoria</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                placeholder="Ex: Alimentação"
                {...register('name')}
                error={errors.name?.message}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="budgetMax">Orçamento Máximo *</Label>
              <Input
                id="budgetMax"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('budgetMax', { valueAsNumber: true })}
                error={errors.budgetMax?.message}
              />
              {errors.budgetMax && (
                <p className="text-sm text-destructive">{errors.budgetMax.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Cor (opcional)</Label>
              <Input
                id="color"
                type="color"
                {...register('color')}
                error={errors.color?.message}
              />
              {errors.color && (
                <p className="text-sm text-destructive">{errors.color.message}</p>
              )}
            </div>
          </div>
          <SheetFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}





