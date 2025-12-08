import { z } from 'zod';

export const createRevenueSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  amount: z.number().positive('Amount must be positive').max(999999.99),
  date: z.coerce.date().max(new Date(), 'Date cannot be in the future'),
  notes: z.string().max(500).optional(),
});

export type CreateRevenueDTO = z.infer<typeof createRevenueSchema>;





