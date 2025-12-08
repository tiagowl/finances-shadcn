import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  simulationCreditPurchaseSchema,
  type SimulationCreditPurchaseFormData,
} from '@/utils/validators';
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

interface CreateSimulationCreditPurchaseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateSimulationCreditPurchaseSheet({
  open,
  onOpenChange,
}: CreateSimulationCreditPurchaseSheetProps) {
  const { addCreditPurchase, fetchCreditPurchases, fetchStats, fetchProjection } = useSimulationStore();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SimulationCreditPurchaseFormData>({
    resolver: zodResolver(simulationCreditPurchaseSchema),
    defaultValues: {
      purchaseDate: new Date().toISOString().split('T')[0],
      installments: 1,
    },
  });

  const onSubmit = async (data: SimulationCreditPurchaseFormData) => {
    try {
      const purchase = await apiService.createSimulationCreditPurchase(data);
      addCreditPurchase(purchase);
      // Atualizar todas as listas e estatísticas
      await Promise.all([
        fetchCreditPurchases(),
        fetchStats(),
        fetchProjection(12),
      ]);
      reset();
      onOpenChange(false);
      toast({
        title: 'Compra no crédito criada com sucesso!',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao criar compra no crédito',
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
            <SheetTitle>Nova Compra no Crédito</SheetTitle>
            <SheetDescription>Adicione uma compra parcelada para simulação</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input id="name" placeholder="Ex: Notebook" {...register('name')} error={errors.name?.message} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Valor Total *</Label>
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
              <Label htmlFor="installments">Parcelas *</Label>
              <Input
                id="installments"
                type="number"
                min="1"
                placeholder="1"
                {...register('installments', { valueAsNumber: true })}
                error={errors.installments?.message}
              />
              {errors.installments && <p className="text-sm text-destructive">{errors.installments.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Data da Compra *</Label>
              <Input
                id="purchaseDate"
                type="date"
                {...register('purchaseDate')}
                error={errors.purchaseDate?.message}
              />
              {errors.purchaseDate && <p className="text-sm text-destructive">{errors.purchaseDate.message}</p>}
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





