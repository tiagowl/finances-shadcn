import { z } from 'zod';

export const createSimulationCreditPurchaseSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  amount: z.number().positive('Amount must be positive'),
  installments: z.number().int().positive('Installments must be a positive integer'),
  purchaseDate: z.string().refine((date) => {
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
  }, 'Invalid date format'),
});

export type CreateSimulationCreditPurchaseDTO = z.infer<typeof createSimulationCreditPurchaseSchema>;





