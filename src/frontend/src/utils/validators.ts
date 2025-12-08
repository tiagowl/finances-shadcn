import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});

export const revenueSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100, 'Nome deve ter no máximo 100 caracteres'),
  amount: z.number().positive('Valor deve ser positivo').max(999999.99, 'Valor muito alto'),
  date: z.string().refine((date) => {
    const dateObj = new Date(date);
    return dateObj <= new Date();
  }, 'Data não pode ser futura'),
  notes: z.string().max(500, 'Observações devem ter no máximo 500 caracteres').optional(),
});

export const expenseSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100, 'Nome deve ter no máximo 100 caracteres'),
  amount: z.number().positive('Valor deve ser positivo').max(999999.99, 'Valor muito alto'),
  date: z.string().refine((date) => {
    const dateObj = new Date(date);
    return dateObj <= new Date();
  }, 'Data não pode ser futura'),
  categoryId: z.union([z.string(), z.literal('__none__'), z.null()]).optional().nullable(),
  notes: z.string().max(500, 'Observações devem ter no máximo 500 caracteres').optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  budgetMax: z.number().min(0, 'Orçamento deve ser positivo ou zero'),
  color: z.string().optional(),
});

export const monthlyExpenseSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100),
  amount: z.number().positive('Valor deve ser positivo').max(999999.99),
  dayOfMonth: z.number().int().min(1, 'Dia deve ser entre 1 e 31').max(31, 'Dia deve ser entre 1 e 31'),
  cancellationLink: z.string().url('URL inválida').optional().nullable(),
});

export const monthlyRevenueSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100),
  amount: z.number().positive('Valor deve ser positivo').max(999999.99),
  dayOfMonth: z.number().int().min(1, 'Dia deve ser entre 1 e 31').max(31, 'Dia deve ser entre 1 e 31'),
});

export const simulationExpenseSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100),
  amount: z.number().positive('Valor deve ser positivo').max(999999.99),
  date: z.string().refine((date) => {
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
  }, 'Data inválida'),
});

export const simulationRevenueSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100),
  amount: z.number().positive('Valor deve ser positivo').max(999999.99),
  date: z.string().refine((date) => {
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
  }, 'Data inválida'),
});

export const simulationCreditPurchaseSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100),
  amount: z.number().positive('Valor deve ser positivo').max(999999.99),
  installments: z.number().int().positive('Parcelas deve ser um número inteiro positivo'),
  purchaseDate: z.string().refine((date) => {
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
  }, 'Data inválida'),
});

export const wishSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(255),
  purchaseLink: z
    .string()
    .transform((val) => (val === '' ? null : val))
    .refine((val) => val === null || z.string().url().safeParse(val).success, 'URL inválida')
    .optional()
    .nullable(),
  categoryId: z
    .string()
    .transform((val) => (val === '' || val === '__none__' ? null : val))
    .refine((val) => val === null || z.string().uuid().safeParse(val).success, 'ID de categoria inválido')
    .optional()
    .nullable(),
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
        .positive('Valor deve ser positivo')
        .max(999999.99, 'Valor muito alto')
        .nullable()
        .optional()
    ),
});

export const shoppingListItemSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(255),
  price: z.number().min(0, 'Preço deve ser positivo ou zero').max(999999.99),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type RevenueFormData = z.infer<typeof revenueSchema>;
export type ExpenseFormData = z.infer<typeof expenseSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type MonthlyExpenseFormData = z.infer<typeof monthlyExpenseSchema>;
export type MonthlyRevenueFormData = z.infer<typeof monthlyRevenueSchema>;
export type SimulationExpenseFormData = z.infer<typeof simulationExpenseSchema>;
export type SimulationRevenueFormData = z.infer<typeof simulationRevenueSchema>;
export type SimulationCreditPurchaseFormData = z.infer<typeof simulationCreditPurchaseSchema>;
export type WishFormData = z.infer<typeof wishSchema>;
export type ShoppingListItemFormData = z.infer<typeof shoppingListItemSchema>;

