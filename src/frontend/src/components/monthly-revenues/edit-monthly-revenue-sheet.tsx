import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { monthlyRevenueSchema, type MonthlyRevenueFormData } from '@/utils/validators';
import { useMonthlyRevenueStore } from '@/stores/monthlyRevenueStore';
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
import type { MonthlyRevenue } from '@/types/api';
import { useEffect } from 'react';

interface EditMonthlyRevenueSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  revenue: MonthlyRevenue | null;
}

export function EditMonthlyRevenueSheet({
  open,
  onOpenChange,
  revenue,
}: EditMonthlyRevenueSheetProps) {
  const { updateMonthlyRevenue, fetchMonthlyRevenues } = useMonthlyRevenueStore();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<MonthlyRevenueFormData>({
    resolver: zodResolver(monthlyRevenueSchema),
  });

  useEffect(() => {
    if (revenue) {
      setValue('name', revenue.name);
      setValue('amount', revenue.amount);
      setValue('dayOfMonth', revenue.dayOfMonth);
    }
  }, [revenue, setValue]);

  const onSubmit = async (data: MonthlyRevenueFormData) => {
    if (!revenue) return;
    try {
      const updatedRevenue = await apiService.updateMonthlyRevenue(revenue.id, data);
      updateMonthlyRevenue(revenue.id, updatedRevenue);
      await fetchMonthlyRevenues();
      reset();
      onOpenChange(false);
      toast({
        title: 'Receita mensal atualizada com sucesso!',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar receita mensal',
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
            <SheetTitle>Editar Receita Mensal</SheetTitle>
            <SheetDescription>Atualize as informações da receita mensal</SheetDescription>
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
              <Label htmlFor="dayOfMonth">Dia do Mês *</Label>
              <Input
                id="dayOfMonth"
                type="number"
                min="1"
                max="31"
                placeholder="1-31"
                {...register('dayOfMonth', { valueAsNumber: true })}
                error={errors.dayOfMonth?.message}
              />
              {errors.dayOfMonth && (
                <p className="text-sm text-destructive">{errors.dayOfMonth.message}</p>
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





