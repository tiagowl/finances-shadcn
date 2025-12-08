import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { monthlyExpenseSchema, type MonthlyExpenseFormData } from '@/utils/validators';
import { useMonthlyExpenseStore } from '@/stores/monthlyExpenseStore';
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

interface CreateMonthlyExpenseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateMonthlyExpenseSheet({ open, onOpenChange }: CreateMonthlyExpenseSheetProps) {
  const { addMonthlyExpense, fetchMonthlyExpenses } = useMonthlyExpenseStore();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<MonthlyExpenseFormData>({
    resolver: zodResolver(monthlyExpenseSchema),
  });

  const onSubmit = async (data: MonthlyExpenseFormData) => {
    try {
      const expense = await apiService.createMonthlyExpense(data);
      addMonthlyExpense(expense);
      await fetchMonthlyExpenses();
      reset();
      onOpenChange(false);
      toast({
        title: 'Despesa mensal criada com sucesso!',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao criar despesa mensal',
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
            <SheetTitle>Nova Despesa Mensal</SheetTitle>
            <SheetDescription>Adicione uma despesa recorrente mensal</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                placeholder="Ex: Netflix"
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
            <div className="space-y-2">
              <Label htmlFor="cancellationLink">Link de Cancelamento (opcional)</Label>
              <Input
                id="cancellationLink"
                type="url"
                placeholder="https://..."
                {...register('cancellationLink')}
                error={errors.cancellationLink?.message}
              />
              {errors.cancellationLink && (
                <p className="text-sm text-destructive">{errors.cancellationLink.message}</p>
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





