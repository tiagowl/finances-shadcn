import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  budgetMax: z.number().min(0, 'Budget max must be positive or zero'),
  color: z
    .union([z.string(), z.literal(''), z.null(), z.undefined()])
    .optional()
    .transform((val) => {
      // Convert empty string or null to undefined
      if (val === '' || val === null) {
        return undefined;
      }
      return val;
    })
    .refine(
      (val) => {
        // If undefined, it's valid (optional field)
        if (val === undefined) {
          return true;
        }
        // Otherwise, must be valid hex color
        return /^#[0-9A-F]{6}$/i.test(val);
      },
      {
        message: 'Invalid color format. Must be in format #RRGGBB',
      }
    ),
});

export type CreateCategoryDTO = z.infer<typeof createCategorySchema>;





