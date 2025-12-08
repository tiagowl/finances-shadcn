import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { simulationRevenueSchema, type SimulationRevenueFormData } from '@/utils/validators';
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

interface CreateSimulationRevenueSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateSimulationRevenueSheet({ open, onOpenChange }: CreateSimulationRevenueSheetProps) {
  const { addRevenue, fetchRevenues, fetchStats, fetchProjection } = useSimulationStore();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SimulationRevenueFormData>({
    resolver: zodResolver(simulationRevenueSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: SimulationRevenueFormData) => {
    try {
      const revenue = await apiService.createSimulationRevenue(data);
      addRevenue(revenue);
      // Atualizar todas as listas e estatísticas
      await Promise.all([
        fetchRevenues(),
        fetchStats(),
        fetchProjection(12),
      ]);
      reset();
      onOpenChange(false);
      toast({
        title: 'Receita de simulação criada com sucesso!',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao criar receita de simulação',
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
            <SheetTitle>Nova Receita de Simulação</SheetTitle>
            <SheetDescription>Adicione uma receita futura para simulação</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input id="name" placeholder="Ex: Salário" {...register('name')} error={errors.name?.message} />
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





