# Scripts de Automação - Testes Unitários

## Visão Geral

Este documento contém exemplos de scripts de automação para testes unitários no Frontend e Backend.

## Frontend - Testes Unitários

### Configuração Base

```typescript
// setupTests.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
```

### Exemplo 1: Teste de Componente - Botão

```typescript
// src/components/ui/button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should apply variant styles', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByText('Delete');
    expect(button).toHaveClass('bg-destructive');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });
});
```

### Exemplo 2: Teste de Hook - useCategoryStore

```typescript
// src/stores/__tests__/categoryStore.test.ts
import { renderHook, act } from '@testing-library/react';
import { useCategoryStore } from '../categoryStore';
import { apiService } from '@/services/api';

jest.mock('@/services/api');

describe('useCategoryStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch categories successfully', async () => {
    const mockCategories = [
      { id: '1', name: 'Alimentação', budgetMax: 1000 },
      { id: '2', name: 'Transporte', budgetMax: 500 },
    ];

    (apiService.getCategories as jest.Mock).mockResolvedValue({
      data: mockCategories,
      stats: { totalBudgetMax: 1500, totalSpent: 750 },
    });

    const { result } = renderHook(() => useCategoryStore());

    await act(async () => {
      await result.current.fetchCategories();
    });

    expect(result.current.categories).toEqual(mockCategories);
    expect(result.current.stats).toEqual({ totalBudgetMax: 1500, totalSpent: 750 });
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle fetch error', async () => {
    (apiService.getCategories as jest.Mock).mockRejectedValue(
      new Error('Network error')
    );

    const { result } = renderHook(() => useCategoryStore());

    await act(async () => {
      await result.current.fetchCategories();
    });

    expect(result.current.categories).toEqual([]);
    expect(result.current.error).toBe('Network error');
    expect(result.current.isLoading).toBe(false);
  });
});
```

### Exemplo 3: Teste de Utilitário - formatCurrency

```typescript
// src/utils/__tests__/formatters.test.ts
import { formatCurrency } from '../formatters';

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
```

### Exemplo 4: Teste de Validação - wishSchema

```typescript
// src/utils/__tests__/validators.test.ts
import { wishSchema } from '../validators';

describe('wishSchema', () => {
  it('should validate valid wish data', () => {
    const validData = {
      name: 'iPhone 15',
      purchaseLink: 'https://example.com',
      categoryId: 'category-123',
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
});
```

## Backend - Testes Unitários

### Exemplo 1: Teste de Entidade - Category

```typescript
// src/domain/entities/__tests__/category.entity.test.ts
import { Category } from '../category.entity';

describe('Category Entity', () => {
  it('should create a valid category', () => {
    const category = new Category(
      'id-123',
      'user-123',
      'Alimentação',
      1000,
      '#3b82f6'
    );

    expect(category.name).toBe('Alimentação');
    expect(category.budgetMax).toBe(1000);
    expect(category.color).toBe('#3b82f6');
  });

  it('should throw error for name shorter than 2 characters', () => {
    expect(() => {
      new Category('id-123', 'user-123', 'A', 1000);
    }).toThrow('Name must be at least 2 characters');
  });

  it('should throw error for negative budget', () => {
    expect(() => {
      new Category('id-123', 'user-123', 'Alimentação', -100);
    }).toThrow('Budget max must be positive or zero');
  });

  it('should throw error for invalid color format', () => {
    expect(() => {
      new Category('id-123', 'user-123', 'Alimentação', 1000, 'invalid-color');
    }).toThrow('Invalid color format');
  });
});
```

### Exemplo 2: Teste de Use Case - CreateCategoryUseCase

```typescript
// src/application/use-cases/category/__tests__/create-category.use-case.test.ts
import { CreateCategoryUseCase } from '../create-category.use-case';
import { ICategoryRepository } from '@/domain/repositories/category.repository.interface';
import { Category } from '@/domain/entities/category.entity';
import { NotFoundError } from '@/shared/errors/not-found-error';

describe('CreateCategoryUseCase', () => {
  let useCase: CreateCategoryUseCase;
  let mockRepository: jest.Mocked<ICategoryRepository>;
  let mockCategoryRepository: jest.Mocked<ICategoryRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockCategoryRepository = {
      findById: jest.fn(),
    } as any;

    useCase = new CreateCategoryUseCase(mockRepository, mockCategoryRepository);
  });

  it('should create category successfully', async () => {
    const dto = {
      name: 'Alimentação',
      budgetMax: 1000,
      color: '#3b82f6',
    };

    const userId = 'user-123';
    const createdCategory = new Category(
      'id-123',
      userId,
      dto.name,
      dto.budgetMax,
      dto.color,
      new Date(),
      new Date()
    );

    mockRepository.create.mockResolvedValue(createdCategory);

    const result = await useCase.execute(dto, userId);

    expect(mockRepository.create).toHaveBeenCalledTimes(1);
    expect(result).toEqual(createdCategory);
  });

  it('should throw error if category ID is invalid', async () => {
    const dto = {
      name: 'Alimentação',
      budgetMax: 1000,
      categoryId: 'invalid-category-id',
    };

    mockCategoryRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute(dto, 'user-123')
    ).rejects.toThrow(NotFoundError);
  });
});
```

### Exemplo 3: Teste de Use Case - PurchaseWishUseCase

```typescript
// src/application/use-cases/wish/__tests__/purchase-wish.use-case.test.ts
import { PurchaseWishUseCase } from '../purchase-wish.use-case';
import { Wish } from '@/domain/entities/wish.entity';
import { Category } from '@/domain/entities/category.entity';
import { Expense } from '@/domain/entities/expense.entity';
import { NotFoundError } from '@/shared/errors/not-found-error';

describe('PurchaseWishUseCase', () => {
  let useCase: PurchaseWishUseCase;
  let mockWishRepository: any;
  let mockExpenseRepository: any;
  let mockCategoryRepository: any;

  beforeEach(() => {
    mockWishRepository = {
      findById: jest.fn(),
      delete: jest.fn(),
    };

    mockExpenseRepository = {
      create: jest.fn(),
      getTotalByCategoryIdAndMonth: jest.fn(),
    };

    mockCategoryRepository = {
      findById: jest.fn(),
    };

    useCase = new PurchaseWishUseCase(
      mockWishRepository,
      mockExpenseRepository,
      mockCategoryRepository
    );
  });

  it('should purchase wish successfully', async () => {
    const wish = new Wish(
      'wish-123',
      'user-123',
      'iPhone 15',
      'https://example.com',
      'category-123',
      5000,
      new Date(),
      new Date()
    );

    const category = new Category(
      'category-123',
      'user-123',
      'Eletrônicos',
      10000
    );

    const expense = new Expense(
      'expense-123',
      'user-123',
      'category-123',
      'iPhone 15',
      5000,
      new Date(),
      'Link: https://example.com',
      new Date(),
      new Date()
    );

    mockWishRepository.findById.mockResolvedValue(wish);
    mockCategoryRepository.findById.mockResolvedValue(category);
    mockExpenseRepository.getTotalByCategoryIdAndMonth.mockResolvedValue(0);
    mockExpenseRepository.create.mockResolvedValue(expense);

    const result = await useCase.execute('wish-123', 'user-123');

    expect(mockExpenseRepository.create).toHaveBeenCalledTimes(1);
    expect(mockWishRepository.delete).toHaveBeenCalledWith('wish-123');
    expect(result.expense).toEqual(expense);
    expect(result.budgetExceeded).toBe(false);
  });

  it('should detect budget exceeded', async () => {
    const wish = new Wish(
      'wish-123',
      'user-123',
      'iPhone 15',
      null,
      'category-123',
      5000,
      new Date(),
      new Date()
    );

    const category = new Category(
      'category-123',
      'user-123',
      'Eletrônicos',
      10000
    );

    // Já gasto R$ 8000 no mês
    mockExpenseRepository.getTotalByCategoryIdAndMonth.mockResolvedValue(8000);
    // Adicionar R$ 5000 ultrapassaria o orçamento de R$ 10000

    mockWishRepository.findById.mockResolvedValue(wish);
    mockCategoryRepository.findById.mockResolvedValue(category);

    const expense = new Expense(/* ... */);
    mockExpenseRepository.create.mockResolvedValue(expense);

    const result = await useCase.execute('wish-123', 'user-123');

    expect(result.budgetExceeded).toBe(true);
    expect(result.remaining).toBeLessThan(0);
  });

  it('should throw error if wish has no category', async () => {
    const wish = new Wish(
      'wish-123',
      'user-123',
      'iPhone 15',
      null,
      null, // sem categoria
      5000,
      new Date(),
      new Date()
    );

    mockWishRepository.findById.mockResolvedValue(wish);

    await expect(
      useCase.execute('wish-123', 'user-123')
    ).rejects.toThrow('Wish must have a category to be purchased');
  });
});
```

### Exemplo 4: Teste de Repository - PostgreSQLCategoryRepository

```typescript
// src/infrastructure/repositories/__tests__/postgres-category.repository.test.ts
import { PostgreSQLCategoryRepository } from '../postgres-category.repository';
import { db } from '@/infrastructure/database/knex';
import { Category } from '@/domain/entities/category.entity';

jest.mock('@/infrastructure/database/knex');

describe('PostgreSQLCategoryRepository', () => {
  let repository: PostgreSQLCategoryRepository;

  beforeEach(() => {
    repository = new PostgreSQLCategoryRepository();
    jest.clearAllMocks();
  });

  it('should create category', async () => {
    const category = new Category(
      'id-123',
      'user-123',
      'Alimentação',
      1000,
      '#3b82f6',
      new Date(),
      new Date()
    );

    const mockRow = {
      id: 'id-123',
      user_id: 'user-123',
      name: 'Alimentação',
      budget_max: 1000,
      color: '#3b82f6',
      created_at: new Date(),
      updated_at: new Date(),
    };

    (db as any).mockReturnValue({
      insert: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([mockRow]),
    });

    const result = await repository.create(category);

    expect(result).toEqual(category);
  });

  it('should find categories by user ID', async () => {
    const mockRows = [
      {
        id: 'id-1',
        user_id: 'user-123',
        name: 'Alimentação',
        budget_max: 1000,
        color: '#3b82f6',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    (db as any).mockReturnValue({
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockResolvedValue(mockRows),
    });

    const result = await repository.findByUserId('user-123');

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Alimentação');
  });
});
```

## Estrutura de Testes Unitários

```
src/
├── components/
│   ├── ui/
│   │   ├── button.test.tsx
│   │   ├── card.test.tsx
│   │   └── ...
│   └── ...
├── stores/
│   ├── __tests__/
│   │   ├── categoryStore.test.ts
│   │   └── ...
├── utils/
│   ├── __tests__/
│   │   ├── formatters.test.ts
│   │   └── validators.test.ts
└── ...

backend/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── __tests__/
│   │   │   │   ├── category.entity.test.ts
│   │   │   │   └── ...
│   ├── application/
│   │   ├── use-cases/
│   │   │   ├── category/
│   │   │   │   ├── __tests__/
│   │   │   │   │   ├── create-category.use-case.test.ts
│   │   │   │   │   └── ...
│   └── infrastructure/
│       ├── repositories/
│       │   ├── __tests__/
│       │   │   ├── postgres-category.repository.test.ts
│       │   │   └── ...
```

## Comandos de Execução

```bash
# Frontend
npm run test:unit        # Executar todos os testes unitários
npm run test:watch       # Modo watch
npm run test:coverage    # Com cobertura

# Backend
npm run test:unit        # Executar todos os testes unitários
npm run test:watch       # Modo watch
npm run test:coverage    # Com cobertura
```

## Cobertura Mínima Esperada

- **Lógica de Negócio**: 90%
- **Componentes UI**: 60%
- **Utils/Helpers**: 80%
- **Use Cases**: 85%
- **Entities**: 90%

---

**Versão**: 1.0  
**Última Atualização**: 2024



