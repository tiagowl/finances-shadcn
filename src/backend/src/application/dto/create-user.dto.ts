import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255).transform((val) => val.trim()),
  email: z.string().email('Invalid email format').transform((val) => val.toLowerCase().trim()),
  password: z.string().min(8, 'Password must be at least 8 characters').transform((val) => val.trim()),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;





