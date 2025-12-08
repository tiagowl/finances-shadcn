import { z } from 'zod';

export const createMonthlyRevenueSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  amount: z.number().positive('Amount must be positive'),
  dayOfMonth: z.number().int().min(1, 'Day must be between 1 and 31').max(31, 'Day must be between 1 and 31'),
});

export type CreateMonthlyRevenueDTO = z.infer<typeof createMonthlyRevenueSchema>;





