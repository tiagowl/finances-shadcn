import { describe, it, expect } from 'vitest';
import { wishSchema, categorySchema, expenseSchema, revenueSchema } from '../validators';

describe('wishSchema', () => {
  it('should validate valid wish data', () => {
    const validData = {
      name: 'iPhone 15',
      purchaseLink: 'https://example.com',
      categoryId: '550e8400-e29b-41d4-a716-446655440000',
      amount: 5000,
    };

    expect(() => wishSchema.parse(validData)).not.toThrow();
  });

  it('should reject name shorter than 2 characters', () => {
    const invalidData = {
      name: 'A',
      purchaseLink: null,
    };

    expect(() => wishSchema.parse(invalidData)).toThrow();
  });

  it('should reject invalid URL', () => {
    const invalidData = {
      name: 'iPhone 15',
      purchaseLink: 'not-a-url',
    };

    expect(() => wishSchema.parse(invalidData)).toThrow();
  });

  it('should reject negative amount', () => {
    const invalidData = {
      name: 'iPhone 15',
      amount: -100,
    };

    expect(() => wishSchema.parse(invalidData)).toThrow();
  });

  it('should accept null values for optional fields', () => {
    const validData = {
      name: 'iPhone 15',
      purchaseLink: null,
      categoryId: null,
      amount: null,
    };

    expect(() => wishSchema.parse(validData)).not.toThrow();
  });
});

describe('categorySchema', () => {
  it('should validate valid category data', () => {
    const validData = {
      name: 'Alimentação',
      budgetMax: 1000,
      color: '#3b82f6',
    };

    expect(() => categorySchema.parse(validData)).not.toThrow();
  });

  it('should reject name shorter than 2 characters', () => {
    const invalidData = {
      name: 'A',
      budgetMax: 1000,
    };

    expect(() => categorySchema.parse(invalidData)).toThrow();
  });

  it('should reject negative budget', () => {
    const invalidData = {
      name: 'Alimentação',
      budgetMax: -100,
    };

    expect(() => categorySchema.parse(invalidData)).toThrow();
  });
});

describe('expenseSchema', () => {
  it('should validate valid expense data', () => {
    const validData = {
      name: 'Supermercado',
      amount: 500,
      date: new Date().toISOString(),
      categoryId: 'category-123',
      notes: 'Compra mensal',
    };

    expect(() => expenseSchema.parse(validData)).not.toThrow();
  });

  it('should reject future date', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const invalidData = {
      name: 'Supermercado',
      amount: 500,
      date: futureDate.toISOString(),
      categoryId: 'category-123',
    };

    expect(() => expenseSchema.parse(invalidData)).toThrow();
  });
});

describe('revenueSchema', () => {
  it('should validate valid revenue data', () => {
    const validData = {
      name: 'Salário',
      amount: 5000,
      date: new Date().toISOString(),
    };

    expect(() => revenueSchema.parse(validData)).not.toThrow();
  });

  it('should reject negative amount', () => {
    const invalidData = {
      name: 'Salário',
      amount: -1000,
      date: new Date().toISOString(),
    };

    expect(() => revenueSchema.parse(invalidData)).toThrow();
  });
});



