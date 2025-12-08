import { ISimulationExpenseRepository } from '@/domain/repositories/simulation-expense.repository.interface';
import { ISimulationRevenueRepository } from '@/domain/repositories/simulation-revenue.repository.interface';
import { ISimulationCreditPurchaseRepository } from '@/domain/repositories/simulation-credit-purchase.repository.interface';
import { IExpenseRepository } from '@/domain/repositories/expense.repository.interface';
import { IRevenueRepository } from '@/domain/repositories/revenue.repository.interface';
import { IMonthlyExpenseRepository } from '@/domain/repositories/monthly-expense.repository.interface';
import { IMonthlyRevenueRepository } from '@/domain/repositories/monthly-revenue.repository.interface';

export interface MonthProjection {
  year: number;
  month: number;
  expenses: number;
  revenues: number;
  creditPayments: number;
  balance: number;
}

export class GetSimulationProjectionUseCase {
  constructor(
    private simulationExpenseRepository: ISimulationExpenseRepository,
    private simulationRevenueRepository: ISimulationRevenueRepository,
    private creditPurchaseRepository: ISimulationCreditPurchaseRepository,
    private expenseRepository: IExpenseRepository,
    private revenueRepository: IRevenueRepository,
    private monthlyExpenseRepository: IMonthlyExpenseRepository,
    private monthlyRevenueRepository: IMonthlyRevenueRepository
  ) {}

  async execute(userId: string, months: number = 12): Promise<MonthProjection[]> {
    const projections: MonthProjection[] = [];
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    // Buscar despesas e receitas mensais uma vez (são recorrentes)
    const monthlyExpenses = await this.monthlyExpenseRepository.findByUserId(userId);
    const monthlyRevenues = await this.monthlyRevenueRepository.findByUserId(userId);
    
    // Calcular total de despesas e receitas mensais (soma de todas)
    const totalMonthlyExpenses = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalMonthlyRevenues = monthlyRevenues.reduce((sum, r) => sum + r.amount, 0);

    for (let i = 0; i < months; i++) {
      const year = currentMonth + i > 12 
        ? currentYear + Math.floor((currentMonth + i - 1) / 12)
        : currentYear;
      const month = ((currentMonth + i - 1) % 12) + 1;

      // Despesas de simulação no mês
      const simulationExpenses = await this.simulationExpenseRepository.findByUserIdAndMonth(userId, year, month);
      const simulationExpensesTotal = simulationExpenses.reduce((sum, e) => sum + e.amount, 0);
      
      // Receitas de simulação no mês
      const simulationRevenues = await this.simulationRevenueRepository.findByUserIdAndMonth(userId, year, month);
      const simulationRevenuesTotal = simulationRevenues.reduce((sum, r) => sum + r.amount, 0);
      
      // Parcelas de crédito no mês
      const creditPayments = await this.creditPurchaseRepository.getMonthlyPaymentsByUserId(userId, year, month);

      // Despesas totais = despesas mensais + despesas de simulação no mês + parcelas de crédito
      const totalExpenses = totalMonthlyExpenses + simulationExpensesTotal + creditPayments;
      
      // Receitas totais = receitas mensais + receitas de simulação no mês
      const totalRevenues = totalMonthlyRevenues + simulationRevenuesTotal;
      
      const balance = totalRevenues - totalExpenses;

      projections.push({
        year,
        month,
        expenses: totalExpenses,
        revenues: totalRevenues,
        creditPayments,
        balance,
      });
    }

    return projections;
  }
}





