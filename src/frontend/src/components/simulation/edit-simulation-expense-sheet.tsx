import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { simulationExpenseSchema, type SimulationExpenseFormData } from '@/utils/validators';
import { useSimulationStore } from '@/stores/simulationStore';
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
import type { SimulationExpense } from '@/types/api';
import { useEffect } from 'react';

interface EditSimulationExpenseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: SimulationExpense | null;
}

export function EditSimulationExpenseSheet({
  open,
  onOpenChange,
  expense,
}: EditSimulationExpenseSheetProps) {
  const { updateExpense, fetchExpenses, fetchAllExpenses, fetchRevenues, fetchAllRevenues, fetchStats, fetchProjection } = useSimulationStore();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<SimulationExpenseFormData>({
    resolver: zodResolver(simulationExpenseSchema),
  });

  useEffect(() => {
    if (expense) {
      setValue('name', expense.name);
      setValue('amount', expense.amount);
      setValue('date', expense.date.split('T')[0]);
    }
  }, [expense, setValue]);

  const onSubmit = async (data: SimulationExpenseFormData) => {
    if (!expense) return;
    try {
      const updatedExpense = await apiService.updateSimulationExpense(expense.id, data);
      updateExpense(expense.id, updatedExpense);
      // Atualizar todas as listas e estatísticas
      await Promise.all([
        fetchExpenses(),
        fetchAllExpenses(),
        fetchRevenues(),
        fetchAllRevenues(),
        fetchStats(),
        fetchProjection(12),
      ]);
      reset();
      onOpenChange(false);
      toast({
        title: 'Despesa de simulação atualizada com sucesso!',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar despesa de simulação',
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
            <SheetTitle>Editar Despesa de Simulação</SheetTitle>
            <SheetDescription>Atualize as informações da despesa de simulação</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input id="name" placeholder="Ex: Aluguel" {...register('name')} error={errors.name?.message} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
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
              {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Data *</Label>
              <Input id="date" type="date" {...register('date')} error={errors.date?.message} />
              {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
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

