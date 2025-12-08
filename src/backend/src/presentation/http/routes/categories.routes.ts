import { FastifyInstance } from 'fastify';
import { CreateCategoryUseCase } from '@/application/use-cases/category/create-category.use-case';
import { UpdateCategoryUseCase } from '@/application/use-cases/category/update-category.use-case';
import { DeleteCategoryUseCase } from '@/application/use-cases/category/delete-category.use-case';
import { PostgreSQLCategoryRepository } from '@/infrastructure/repositories/postgres-category.repository';
import { PostgreSQLExpenseRepository } from '@/infrastructure/repositories/postgres-expense.repository';
import { createCategorySchema } from '@/application/dto/create-category.dto';
import { authMiddleware } from '../middleware/auth.middleware';
import { ValidationError } from '@/shared/errors/validation-error';

export async function categoryRoutes(fastify: FastifyInstance) {
  const categoryRepository = new PostgreSQLCategoryRepository();
  const expenseRepository = new PostgreSQLExpenseRepository();
  const createUseCase = new CreateCategoryUseCase(categoryRepository);
  const updateUseCase = new UpdateCategoryUseCase(categoryRepository);
  const deleteUseCase = new DeleteCategoryUseCase(categoryRepository, expenseRepository);

  fastify.post('/categories', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const dto = createCategorySchema.parse(request.body);
      const category = await createUseCase.execute(dto, request.userId!);

      return reply.status(201).send({
        id: category.id,
        userId: category.userId,
        name: category.name,
        budgetMax: category.budgetMax,
        color: category.color,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new ValidationError('Validation failed', error.errors);
      }
      throw error;
    }
  });

  fastify.get('/categories', { preHandler: [authMiddleware] }, async (request, reply) => {
    const categories = await categoryRepository.findByUserId(request.userId!);

    // Get total spent for each category
    const categoriesWithStats = await Promise.all(
      categories.map(async (category) => {
        const totalSpent = await expenseRepository.getTotalByCategoryId(category.id);
        const remaining = category.budgetMax - totalSpent;

        return {
          id: category.id,
          userId: category.userId,
          name: category.name,
          budgetMax: category.budgetMax,
          totalSpent,
          remaining,
          color: category.color,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
        };
      })
    );

    // Calculate total statistics
    const totalBudgetMax = categoriesWithStats.reduce((sum, cat) => sum + cat.budgetMax, 0);
    const totalSpent = categoriesWithStats.reduce((sum, cat) => sum + cat.totalSpent, 0);

    return reply.send({
      data: categoriesWithStats,
      stats: {
        totalBudgetMax,
        totalSpent,
      },
    });
  });

  fastify.put('/categories/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const dto = createCategorySchema.parse(request.body);
      const category = await updateUseCase.execute(params.id, dto, request.userId!);

      return reply.send({
        id: category.id,
        userId: category.userId,
        name: category.name,
        budgetMax: category.budgetMax,
        color: category.color,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new ValidationError('Validation failed', error.errors);
      }
      throw error;
    }
  });

  fastify.delete('/categories/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const params = request.params as { id: string };
      await deleteUseCase.execute(params.id, request.userId!);
      return reply.status(204).send();
    } catch (error: any) {
      // Re-throw known errors (NotFoundError, etc.)
      if (error.name === 'NotFoundError' || error.statusCode) {
        throw error;
      }
      // Handle database constraint errors
      if (error.code === '23503' || error.message?.includes('foreign key')) {
        throw new ValidationError('Cannot delete category. It is associated with existing expenses.');
      }
      throw error;
    }
  });
}

