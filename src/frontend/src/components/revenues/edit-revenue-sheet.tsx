import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { revenueSchema, type RevenueFormData } from '@/utils/validators';
import { useRevenueStore } from '@/stores/revenueStore';
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
import { Textarea } from '@/components/ui/textarea';
import type { Revenue } from '@/types/api';
import { useEffect } from 'react';

interface EditRevenueSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  revenue: Revenue | null;
}

export function EditRevenueSheet({ open, onOpenChange, revenue }: EditRevenueSheetProps) {
  const { updateRevenue, fetchRevenues } = useRevenueStore();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<RevenueFormData>({
    resolver: zodResolver(revenueSchema),
  });

  useEffect(() => {
    if (revenue) {
      setValue('name', revenue.name);
      setValue('amount', revenue.amount);
      setValue('date', revenue.date.split('T')[0]);
      setValue('notes', revenue.notes || '');
    }
  }, [revenue, setValue]);

  const onSubmit = async (data: RevenueFormData) => {
    if (!revenue) return;
    try {
      const updatedRevenue = await apiService.updateRevenue(revenue.id, data);
      updateRevenue(revenue.id, updatedRevenue);
      await fetchRevenues();
      reset();
      onOpenChange(false);
      toast({
        title: 'Receita atualizada com sucesso!',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar receita',
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
            <SheetTitle>Editar Receita</SheetTitle>
            <SheetDescription>Atualize as informações da receita</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                placeholder="Ex: Salário"
                {...register('name')}
                error={errors.name?.message}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Valor *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('amount', { valueAsNumber: true })}
                error={errors.amount?.message}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Data de Recebimento *</Label>
              <Input
                id="date"
                type="date"
                {...register('date')}
                error={errors.date?.message}
              />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                placeholder="Observações opcionais"
                {...register('notes')}
                error={errors.notes?.message}
              />
              {errors.notes && (
                <p className="text-sm text-destructive">{errors.notes.message}</p>
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





