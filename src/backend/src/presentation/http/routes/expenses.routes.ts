import { FastifyInstance } from 'fastify';
import { CreateExpenseUseCase } from '@/application/use-cases/expense/create-expense.use-case';
import { UpdateExpenseUseCase } from '@/application/use-cases/expense/update-expense.use-case';
import { DeleteExpenseUseCase } from '@/application/use-cases/expense/delete-expense.use-case';
import { PostgreSQLExpenseRepository } from '@/infrastructure/repositories/postgres-expense.repository';
import { PostgreSQLCategoryRepository } from '@/infrastructure/repositories/postgres-category.repository';
import { createExpenseSchema } from '@/application/dto/create-expense.dto';
import { authMiddleware } from '../middleware/auth.middleware';
import { ValidationError } from '@/shared/errors/validation-error';

// Helper function to format date as YYYY-MM-DD
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function expenseRoutes(fastify: FastifyInstance) {
  const expenseRepository = new PostgreSQLExpenseRepository();
  const categoryRepository = new PostgreSQLCategoryRepository();
  const createUseCase = new CreateExpenseUseCase(expenseRepository, categoryRepository);
  const updateUseCase = new UpdateExpenseUseCase(expenseRepository, categoryRepository);
  const deleteUseCase = new DeleteExpenseUseCase(expenseRepository);

  fastify.post('/expenses', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const dto = createExpenseSchema.parse(request.body);
      const expense = await createUseCase.execute(dto, request.userId!);

      return reply.status(201).send({
        id: expense.id,
        userId: expense.userId,
        categoryId: expense.categoryId,
        name: expense.name,
        amount: expense.amount,
        date: formatDate(expense.date),
        notes: expense.notes,
        createdAt: expense.createdAt,
        updatedAt: expense.updatedAt,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new ValidationError('Validation failed', error.errors);
      }
      throw error;
    }
  });

  fastify.get('/expenses', { preHandler: [authMiddleware] }, async (request, reply) => {
    const query = request.query as { limit?: string; offset?: string };
    const limit = query.limit ? parseInt(query.limit) : undefined;
    const offset = query.offset ? parseInt(query.offset) : undefined;

    const expenses = await expenseRepository.findByUserId(request.userId!, limit, offset);

    return reply.send({
      data: expenses.map((e) => ({
        id: e.id,
        userId: e.userId,
        categoryId: e.categoryId,
        name: e.name,
        amount: e.amount,
        date: formatDate(e.date),
        notes: e.notes,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
      })),
    });
  });

  fastify.put('/expenses/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const dto = createExpenseSchema.parse(request.body);
      const expense = await updateUseCase.execute(params.id, dto, request.userId!);

      return reply.send({
        id: expense.id,
        userId: expense.userId,
        categoryId: expense.categoryId,
        name: expense.name,
        amount: expense.amount,
        date: formatDate(expense.date),
        notes: expense.notes,
        createdAt: expense.createdAt,
        updatedAt: expense.updatedAt,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new ValidationError('Validation failed', error.errors);
      }
      throw error;
    }
  });

  fastify.delete('/expenses/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    const params = request.params as { id: string };
    await deleteUseCase.execute(params.id, request.userId!);
    return reply.status(204).send();
  });
}

