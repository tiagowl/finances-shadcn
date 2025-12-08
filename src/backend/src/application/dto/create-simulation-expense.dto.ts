import { z } from 'zod';

export const createSimulationExpenseSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  amount: z.number().positive('Amount must be positive'),
  date: z.string().refine((date) => {
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
  }, 'Invalid date format'),
});

export type CreateSimulationExpenseDTO = z.infer<typeof createSimulationExpenseSchema>;





