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

interface CreateCategorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCategorySheet({ open, onOpenChange }: CreateCategorySheetProps) {
  const { addCategory, fetchCategories } = useCategoryStore();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const category = await apiService.createCategory(data);
      addCategory(category);
      await fetchCategories();
      reset();
      onOpenChange(false);
      toast({
        title: 'Categoria criada com sucesso!',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao criar categoria',
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
            <SheetTitle>Nova Categoria</SheetTitle>
            <SheetDescription>Adicione uma nova categoria para organizar suas despesas</SheetDescription>
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





