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

interface CreateShoppingListItemSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateShoppingListItemSheet({ open, onOpenChange }: CreateShoppingListItemSheetProps) {
  const { addItem, fetchItems, fetchStats } = useShoppingListStore();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ShoppingListItemFormData>({
    resolver: zodResolver(shoppingListItemSchema),
    defaultValues: {
      price: 0,
    },
  });

  const onSubmit = async (data: ShoppingListItemFormData) => {
    try {
      const item = await apiService.createShoppingListItem(data);
      addItem(item);
      await fetchItems();
      await fetchStats();
      reset();
      onOpenChange(false);
      toast({
        title: 'Item adicionado com sucesso!',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao adicionar item',
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
            <SheetTitle>Novo Item</SheetTitle>
            <SheetDescription>Adicione um item à sua lista de compras</SheetDescription>
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





