import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { shoppingListItemSchema, type ShoppingListItemFormData } from '@/utils/validators';
import { useShoppingListStore } from '@/stores/shoppingListStore';
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
import type { ShoppingListItem } from '@/types/api';
import { useEffect } from 'react';

interface EditShoppingListItemSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ShoppingListItem | null;
}

export function EditShoppingListItemSheet({ open, onOpenChange, item }: EditShoppingListItemSheetProps) {
  const { updateItem, fetchItems, fetchStats } = useShoppingListStore();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ShoppingListItemFormData>({
    resolver: zodResolver(shoppingListItemSchema),
  });

  useEffect(() => {
    if (item) {
      setValue('name', item.name);
      setValue('price', item.price);
    }
  }, [item, setValue]);

  const onSubmit = async (data: ShoppingListItemFormData) => {
    if (!item) return;
    try {
      const updatedItem = await apiService.updateShoppingListItem(item.id, data);
      updateItem(item.id, updatedItem);
      await fetchItems();
      await fetchStats();
      reset();
      onOpenChange(false);
      toast({
        title: 'Item atualizado com sucesso!',
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <SheetHeader>
            <SheetTitle>Editar Item</SheetTitle>
            <SheetDescription>Atualize as informações do item</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input id="name" placeholder="Ex: Leite" {...register('name')} error={errors.name?.message} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Preço *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('price', { valueAsNumber: true })}
                error={errors.price?.message}
              />
              {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
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





