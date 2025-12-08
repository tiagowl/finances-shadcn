import { z } from 'zod';

export const createWishSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  purchaseLink: z
    .string()
    .transform((val) => (val === '' ? undefined : val))
    .optional()
    .nullable()
    .refine((val) => val === null || val === undefined || z.string().url().safeParse(val).success, 'Invalid URL'),
  categoryId: z
    .string()
    .transform((val) => (val === '' || val === '__none__' ? undefined : val))
    .optional()
    .nullable()
    .refine((val) => val === null || val === undefined || z.string().uuid().safeParse(val).success, 'Invalid category ID'),
  amount: z
    .preprocess(
      (val) => {
        if (val === '' || val === null || val === undefined) return null;
        if (typeof val === 'string') {
          const num = parseFloat(val);
          return isNaN(num) ? null : num;
        }
        return val;
      },
      z
        .number()
        .positive('Amount must be positive')
        .max(999999.99)
        .nullable()
        .optional()
    ),
});

export type CreateWishDTO = z.infer<typeof createWishSchema>;



