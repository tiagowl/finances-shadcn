import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email format').transform((val) => val.toLowerCase().trim()),
  password: z.string().min(1, 'Password is required').transform((val) => val.trim()),
});

export type LoginDTO = z.infer<typeof loginSchema>;





