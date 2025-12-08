import { z } from 'zod';

export const createShoppingListItemSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  price: z.number().min(0, 'Price must be positive or zero'),
});

export type CreateShoppingListItemDTO = z.infer<typeof createShoppingListItemSchema>;





