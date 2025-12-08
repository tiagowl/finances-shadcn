# Scripts de Automação - Testes de Integração

## Visão Geral

Este documento contém exemplos de scripts para testes de integração, focando em APIs e integração entre camadas.

## Backend - Testes de API

### Configuração Base

```typescript
// tests/integration/setup.ts
import { FastifyInstance } from 'fastify';
import { buildApp } from '@/presentation/http/server';
import { db } from '@/infrastructure/database/knex';

let app: FastifyInstance;

beforeAll(async () => {
  app = await buildApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

beforeEach(async () => {
  // Limpar dados de teste
  await db('expenses').delete();
  await db('revenues').delete();
  await db('categories').delete();
  await db('wishes').delete();
});

export { app };
```

### Exemplo 1: Teste de Endpoint - POST /categories

```typescript
// tests/integration/categories.routes.test.ts
import { app } from '../setup';
import { createTestUser, getAuthToken } from '../helpers/auth';

describe('POST /api/categories', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    const { user, token } = await createTestUser();
    userId = user.id;
    authToken = token;
  });

  it('should create category successfully', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/categories',
      headers: {
        authorization: `Bearer ${authToken}`,
      },
      payload: {
        name: 'Alimentação',
        budgetMax: 1000,
        color: '#3b82f6',
      },
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.name).toBe('Alimentação');
    expect(body.budgetMax).toBe(1000);
    expect(body.userId).toBe(userId);
  });

  it('should return 401 without authentication', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/categories',
      payload: {
        name: 'Alimentação',
        budgetMax: 1000,
      },
    });

    expect(response.statusCode).toBe(401);
  });

  it('should return 400 for invalid data', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/categories',
      headers: {
        authorization: `Bearer ${authToken}`,
      },
      payload: {
        name: 'A', // muito curto
        budgetMax: -100, // negativo
      },
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });
});
```

### Exemplo 2: Teste de Endpoint - GET /categories com Estatísticas

```typescript
// tests/integration/categories-stats.test.ts
import { app } from '../setup';
import { createTestUser, getAuthToken } from '../helpers/auth';
import { createTestCategory } from '../helpers/category';
import { createTestExpense } from '../helpers/expense';

describe('GET /api/categories with stats', () => {
  let authToken: string;
  let userId: string;
  let categoryId: string;

  beforeAll(async () => {
    const { user, token } = await createTestUser();
    userId = user.id;
    authToken = token;

    const category = await createTestCategory(userId, {
      name: 'Alimentação',
      budgetMax: 1000,
    });
    categoryId = category.id;

    // Criar despesas
    await createTestExpense(userId, categoryId, {
      name: 'Supermercado',
      amount: 500,
      date: new Date(),
    });
  });

  it('should return categories with stats', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/categories',
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    
    expect(body.data).toHaveLength(1);
    expect(body.data[0]).toHaveProperty('totalSpent');
    expect(body.data[0]).toHaveProperty('remaining');
    expect(body.data[0].totalSpent).toBe(500);
    expect(body.data[0].remaining).toBe(500);
    
    expect(body.stats).toBeDefined();
    expect(body.stats.totalBudgetMax).toBe(1000);
    expect(body.stats.totalSpent).toBe(500);
  });
});
```

### Exemplo 3: Teste de Endpoint - POST /wishes/:id/purchase

```typescript
// tests/integration/wishes-purchase.test.ts
import { app } from '../setup';
import { createTestUser, getAuthToken } from '../helpers/auth';
import { createTestCategory } from '../helpers/category';
import { createTestWish } from '../helpers/wish';
import { db } from '@/infrastructure/database/knex';

describe('POST /api/wishes/:id/purchase', () => {
  let authToken: string;
  let userId: string;
  let categoryId: string;
  let wishId: string;

  beforeAll(async () => {
    const { user, token } = await createTestUser();
    userId = user.id;
    authToken = token;

    const category = await createTestCategory(userId, {
      name: 'Eletrônicos',
      budgetMax: 10000,
    });
    categoryId = category.id;

    const wish = await createTestWish(userId, {
      name: 'iPhone 15',
      categoryId,
      amount: 5000,
    });
    wishId = wish.id;
  });

  it('should purchase wish and create expense', async () => {
    const response = await app.inject({
      method: 'POST',
      url: `/api/wishes/${wishId}/purchase`,
      headers: {
        authorization: `Bearer ${authToken}`,
      },
      payload: {},
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    
    expect(body.expense).toBeDefined();
    expect(body.expense.name).toBe('iPhone 15');
    expect(body.expense.categoryId).toBe(categoryId);
    expect(body.expense.amount).toBe(5000);
    
    // Verificar que wish foi deletado
    const wish = await db('wishes').where({ id: wishId }).first();
    expect(wish).toBeUndefined();
  });

  it('should detect budget exceeded', async () => {
    // Criar outra wish
    const wish2 = await createTestWish(userId, {
      name: 'MacBook',
      categoryId,
      amount: 15000, // Ultrapassa orçamento de 10000
    });

    // Já gasto 5000 anteriormente
    const response = await app.inject({
      method: 'POST',
      url: `/api/wishes/${wish2.id}/purchase`,
      headers: {
        authorization: `Bearer ${authToken}`,
      },
      payload: {},
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.budgetExceeded).toBe(true);
    expect(body.remaining).toBeLessThan(0);
  });
});
```

### Exemplo 4: Teste de Integração - Categoria com Despesas

```typescript
// tests/integration/category-expense-integration.test.ts
import { app } from '../setup';
import { createTestUser, getAuthToken } from '../helpers/auth';
import { createTestCategory } from '../helpers/category';
import { createTestExpense } from '../helpers/expense';
import { db } from '@/infrastructure/database/knex';

describe('Category-Expense Integration', () => {
  let authToken: string;
  let userId: string;
  let categoryId: string;

  beforeAll(async () => {
    const { user, token } = await createTestUser();
    userId = user.id;
    authToken = token;

    const category = await createTestCategory(userId, {
      name: 'Transporte',
      budgetMax: 2000,
    });
    categoryId = category.id;
  });

  it('should calculate total spent correctly', async () => {
    // Criar múltiplas despesas
    await createTestExpense(userId, categoryId, {
      name: 'Uber',
      amount: 50,
      date: new Date(),
    });

    await createTestExpense(userId, categoryId, {
      name: 'Combustível',
      amount: 200,
      date: new Date(),
    });

    // Buscar categoria com stats
    const response = await app.inject({
      method: 'GET',
      url: '/api/categories',
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    });

    const body = JSON.parse(response.body);
    const category = body.data.find((c: any) => c.id === categoryId);
    
    expect(category.totalSpent).toBe(250);
    expect(category.remaining).toBe(1750);
  });

  it('should prevent category deletion with expenses', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: `/api/categories/${categoryId}`,
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    });

    // Deve falhar por causa de ON DELETE RESTRICT
    expect(response.statusCode).toBe(500); // ou código apropriado
  });
});
```

## Helpers de Teste

### Helper de Autenticação

```typescript
// tests/helpers/auth.ts
import { db } from '@/infrastructure/database/knex';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function createTestUser() {
  const email = `test-${Date.now()}@test.com`;
  const passwordHash = await bcrypt.hash('password123', 10);

  const [user] = await db('users')
    .insert({
      email,
      password_hash: passwordHash,
      name: 'Test User',
    })
    .returning('*');

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );

  return { user, token };
}

export async function getAuthToken(userId: string): Promise<string> {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );
}
```

### Helper de Categoria

```typescript
// tests/helpers/category.ts
import { db } from '@/infrastructure/database/knex';
import { Category } from '@/domain/entities/category.entity';

export async function createTestCategory(
  userId: string,
  data: {
    name: string;
    budgetMax: number;
    color?: string;
  }
): Promise<Category> {
  const [row] = await db('categories')
    .insert({
      user_id: userId,
      name: data.name,
      budget_max: data.budgetMax,
      color: data.color,
    })
    .returning('*');

  return new Category(
    row.id,
    row.user_id,
    row.name,
    parseFloat(row.budget_max),
    row.color,
    row.created_at,
    row.updated_at
  );
}
```

## Estrutura de Testes de Integração

```
tests/
├── integration/
│   ├── setup.ts
│   ├── categories.routes.test.ts
│   ├── categories-stats.test.ts
│   ├── wishes-purchase.test.ts
│   ├── category-expense-integration.test.ts
│   └── ...
├── helpers/
│   ├── auth.ts
│   ├── category.ts
│   ├── expense.ts
│   ├── wish.ts
│   └── ...
└── fixtures/
    ├── users.json
    ├── categories.json
    └── ...
```

## Comandos de Execução

```bash
# Backend - Testes de Integração
npm run test:integration    # Todos os testes de integração
npm run test:integration:api # Apenas testes de API
npm run test:integration:db  # Apenas testes de banco
```

## Cobertura Esperada

- **Endpoints**: 100% dos endpoints críticos
- **Fluxos de Integração**: Principais fluxos de negócio
- **Casos de Erro**: Tratamento de erros comum

---

**Versão**: 1.0  
**Última Atualização**: 2024



