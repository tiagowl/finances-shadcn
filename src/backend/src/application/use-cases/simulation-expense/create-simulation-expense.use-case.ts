import { ISimulationExpenseRepository } from '@/domain/repositories/simulation-expense.repository.interface';
import { SimulationExpense } from '@/domain/entities/simulation-expense.entity';
import { CreateSimulationExpenseDTO } from '@/application/dto/create-simulation-expense.dto';
import { generateUUID } from '@/shared/utils/uuid';

export class CreateSimulationExpenseUseCase {
  constructor(private repository: ISimulationExpenseRepository) {}

  async execute(dto: CreateSimulationExpenseDTO, userId: string): Promise<SimulationExpense> {
    const now = new Date();
    const expense = new SimulationExpense(
      generateUUID(),
      userId,
      dto.name,
      dto.amount,
      new Date(dto.date),
      now,
      now
    );

    return await this.repository.create(expense);
  }
}





