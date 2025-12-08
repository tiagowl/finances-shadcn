import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { wishSchema, type WishFormData } from '@/utils/validators';
import { useWishStore } from '@/stores/wishStore';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect } from 'react';

interface CreateWishSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateWishSheet({ open, onOpenChange }: CreateWishSheetProps) {
  const { addWish, fetchWishes } = useWishStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<WishFormData>({
    resolver: zodResolver(wishSchema),
  });

  const categoryId = watch('categoryId');

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open, fetchCategories]);

  const onSubmit = async (data: WishFormData) => {
    try {
      // Transform empty strings to null for optional fields
      const dataToSend = {
        ...data,
        purchaseLink: data.purchaseLink === '' ? null : data.purchaseLink,
        categoryId: data.categoryId === '' || data.categoryId === '__none__' ? null : data.categoryId,
        amount: data.amount === undefined || data.amount === null || (typeof data.amount === 'number' && isNaN(data.amount)) ? null : data.amount,
      };
      const wish = await apiService.createWish(dataToSend);
      addWish(wish);
      await fetchWishes();
      reset();
      onOpenChange(false);
      toast({
        title: 'Desejo criado com sucesso!',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao criar desejo',
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
            <SheetTitle>Novo Desejo</SheetTitle>
            <SheetDescription>Adicione um item à sua lista de desejos</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input id="name" placeholder="Ex: iPhone 15" {...register('name')} error={errors.name?.message} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryId">Categoria (opcional)</Label>
              <Select
                value={categoryId || '__none__'}
                onValueChange={(value) => setValue('categoryId', value === '__none__' ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Nenhuma categoria</SelectItem>
                  {Array.isArray(categories) && categories.length > 0 ? (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="__no_categories__" disabled>
                      Nenhuma categoria disponível
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-destructive">{errors.categoryId.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (opcional)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('amount', { valueAsNumber: true })}
                error={errors.amount?.message}
              />
              {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchaseLink">Link de Compra (opcional)</Label>
              <Input
                id="purchaseLink"
                type="url"
                placeholder="https://..."
                {...register('purchaseLink')}
                error={errors.purchaseLink?.message}
              />
              {errors.purchaseLink && <p className="text-sm text-destructive">{errors.purchaseLink.message}</p>}
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



