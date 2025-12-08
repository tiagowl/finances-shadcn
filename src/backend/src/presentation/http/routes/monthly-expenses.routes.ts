import { FastifyInstance } from 'fastify';
import { CreateMonthlyExpenseUseCase } from '@/application/use-cases/monthly-expense/create-monthly-expense.use-case';
import { GetMonthlyExpensesUseCase } from '@/application/use-cases/monthly-expense/get-monthly-expenses.use-case';
import { UpdateMonthlyExpenseUseCase } from '@/application/use-cases/monthly-expense/update-monthly-expense.use-case';
import { DeleteMonthlyExpenseUseCase } from '@/application/use-cases/monthly-expense/delete-monthly-expense.use-case';
import { PostgreSQLMonthlyExpenseRepository } from '@/infrastructure/repositories/postgres-monthly-expense.repository';
import { createMonthlyExpenseSchema } from '@/application/dto/create-monthly-expense.dto';
import { authMiddleware } from '../middleware/auth.middleware';
import { ValidationError } from '@/shared/errors/validation-error';

export async function monthlyExpenseRoutes(fastify: FastifyInstance) {
  const repository = new PostgreSQLMonthlyExpenseRepository();
  const createUseCase = new CreateMonthlyExpenseUseCase(repository);
  const getUseCase = new GetMonthlyExpensesUseCase(repository);
  const updateUseCase = new UpdateMonthlyExpenseUseCase(repository);
  const deleteUseCase = new DeleteMonthlyExpenseUseCase(repository);

  fastify.post('/monthly-expenses', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const dto = createMonthlyExpenseSchema.parse(request.body);
      const monthlyExpense = await createUseCase.execute(dto, request.userId!);

      return reply.status(201).send({
        id: monthlyExpense.id,
        userId: monthlyExpense.userId,
        name: monthlyExpense.name,
        amount: monthlyExpense.amount,
        dayOfMonth: monthlyExpense.dayOfMonth,
        cancellationLink: monthlyExpense.cancellationLink,
        createdAt: monthlyExpense.createdAt,
        updatedAt: monthlyExpense.updatedAt,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new ValidationError('Validation failed', error.errors);
      }
      throw error;
    }
  });

  fastify.get('/monthly-expenses', { preHandler: [authMiddleware] }, async (request, reply) => {
    const monthlyExpenses = await getUseCase.execute(request.userId!);

    return reply.send({
      data: monthlyExpenses.map((e) => ({
        id: e.id,
        userId: e.userId,
        name: e.name,
        amount: e.amount,
        dayOfMonth: e.dayOfMonth,
        cancellationLink: e.cancellationLink,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
      })),
    });
  });

  fastify.put('/monthly-expenses/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const dto = createMonthlyExpenseSchema.parse(request.body);
      const monthlyExpense = await updateUseCase.execute(params.id, dto, request.userId!);

      return reply.send({
        id: monthlyExpense.id,
        userId: monthlyExpense.userId,
        name: monthlyExpense.name,
        amount: monthlyExpense.amount,
        dayOfMonth: monthlyExpense.dayOfMonth,
        cancellationLink: monthlyExpense.cancellationLink,
        createdAt: monthlyExpense.createdAt,
        updatedAt: monthlyExpense.updatedAt,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new ValidationError('Validation failed', error.errors);
      }
      throw error;
    }
  });

  fastify.delete('/monthly-expenses/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    const params = request.params as { id: string };
    await deleteUseCase.execute(params.id, request.userId!);
    return reply.status(204).send();
  });
}





