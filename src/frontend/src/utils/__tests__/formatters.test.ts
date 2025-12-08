import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatDateTime, formatMonthYear } from '../formatters';

describe('formatCurrency', () => {
  it('should format positive number correctly', () => {
    expect(formatCurrency(1000)).toBe('R$ 1.000,00');
    expect(formatCurrency(10.5)).toBe('R$ 10,50');
    expect(formatCurrency(0.99)).toBe('R$ 0,99');
  });

  it('should format negative number correctly', () => {
    expect(formatCurrency(-1000)).toBe('-R$ 1.000,00');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('R$ 0,00');
  });

  it('should handle large numbers', () => {
    expect(formatCurrency(999999.99)).toBe('R$ 999.999,99');
  });
});

describe('formatDate', () => {
  it('should format date string correctly', () => {
    const date = '2024-01-15';
    expect(formatDate(date)).toBe('15/01/2024');
  });

  it('should format Date object correctly', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('15/01/2024');
  });
});

describe('formatDateTime', () => {
  it('should format datetime string correctly', () => {
    const date = '2024-01-15T10:30:00';
    const formatted = formatDateTime(date);
    expect(formatted).toContain('15/01/2024');
    expect(formatted).toContain('às');
  });
});

describe('formatMonthYear', () => {
  it('should format month and year correctly', () => {
    const date = new Date('2024-01-15');
    const formatted = formatMonthYear(date);
    expect(formatted.toLowerCase()).toContain('janeiro');
    expect(formatted).toContain('2024');
  });
});



