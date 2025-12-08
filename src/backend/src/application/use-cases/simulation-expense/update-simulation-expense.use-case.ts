import { ISimulationExpenseRepository } from '@/domain/repositories/simulation-expense.repository.interface';
import { SimulationExpense } from '@/domain/entities/simulation-expense.entity';
import { CreateSimulationExpenseDTO } from '@/application/dto/create-simulation-expense.dto';
import { NotFoundError } from '@/shared/errors/not-found-error';

export class UpdateSimulationExpenseUseCase {
  constructor(private repository: ISimulationExpenseRepository) {}

  async execute(id: string, dto: CreateSimulationExpenseDTO, userId: string): Promise<SimulationExpense> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundError('SimulationExpense');
    }

    if (existing.userId !== userId) {
      throw new NotFoundError('SimulationExpense');
    }

    const updated = new SimulationExpense(
      existing.id,
      existing.userId,
      dto.name,
      dto.amount,
      new Date(dto.date),
      existing.createdAt,
      new Date()
    );

    return await this.repository.update(updated);
  }
}





