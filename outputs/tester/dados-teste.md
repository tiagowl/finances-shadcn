# Dados de Teste - Sistema de Controle Financeiro

## Visão Geral

Este documento define os dados de teste padronizados para uso em todos os tipos de testes (unitários, integração, E2E).

## Usuários de Teste

### Usuário Principal

```json
{
  "id": "user-001",
  "email": "test@example.com",
  "name": "Usuário Teste",
  "password": "password123",
  "passwordHash": "$2b$10$..."
}
```

### Usuários Adicionais

```json
[
  {
    "email": "user1@test.com",
    "name": "Usuário 1",
    "password": "senha123456"
  },
  {
    "email": "user2@test.com",
    "name": "Usuário 2",
    "password": "senha123456"
  }
]
```

## Categorias de Teste

### Categoria 1: Alimentação

```json
{
  "id": "cat-001",
  "name": "Alimentação",
  "budgetMax": 1000.00,
  "color": "#3b82f6",
  "userId": "user-001"
}
```

### Categoria 2: Transporte

```json
{
  "id": "cat-002",
  "name": "Transporte",
  "budgetMax": 500.00,
  "color": "#ef4444",
  "userId": "user-001"
}
```

### Categoria 3: Eletrônicos

```json
{
  "id": "cat-003",
  "name": "Eletrônicos",
  "budgetMax": 10000.00,
  "color": "#10b981",
  "userId": "user-001"
}
```

### Categoria 4: Sem Orçamento (zero)

```json
{
  "id": "cat-004",
  "name": "Diversos",
  "budgetMax": 0.00,
  "color": "#f59e0b",
  "userId": "user-001"
}
```

## Receitas de Teste

### Receita 1: Salário

```json
{
  "id": "rev-001",
  "name": "Salário",
  "amount": 5000.00,
  "date": "2024-01-05",
  "notes": "Salário mensal",
  "userId": "user-001"
}
```

### Receita 2: Freelance

```json
{
  "id": "rev-002",
  "name": "Freelance Design",
  "amount": 1500.00,
  "date": "2024-01-15",
  "notes": "Projeto de logo",
  "userId": "user-001"
}
```

### Receita 3: Venda

```json
{
  "id": "rev-003",
  "name": "Venda de produto",
  "amount": 200.00,
  "date": "2024-01-20",
  "userId": "user-001"
}
```

## Despesas de Teste

### Despesa 1: Supermercado

```json
{
  "id": "exp-001",
  "name": "Supermercado",
  "amount": 450.00,
  "date": "2024-01-10",
  "categoryId": "cat-001",
  "notes": "Compras do mês",
  "userId": "user-001"
}
```

### Despesa 2: Uber

```json
{
  "id": "exp-002",
  "name": "Uber",
  "amount": 35.50,
  "date": "2024-01-12",
  "categoryId": "cat-002",
  "userId": "user-001"
}
```

### Despesa 3: Combustível

```json
{
  "id": "exp-003",
  "name": "Combustível",
  "amount": 200.00,
  "date": "2024-01-14",
  "categoryId": "cat-002",
  "userId": "user-001"
}
```

### Despesa 4: Fones de Ouvido

```json
{
  "id": "exp-004",
  "name": "Fones de Ouvido",
  "amount": 300.00,
  "date": "2024-01-18",
  "categoryId": "cat-003",
  "userId": "user-001"
}
```

## Despesas Mensais de Teste

### Despesa Mensal 1: Netflix

```json
{
  "id": "monthly-exp-001",
  "name": "Netflix",
  "amount": 45.90,
  "dayOfMonth": 10,
  "cancellationLink": "https://www.netflix.com/cancelplan",
  "userId": "user-001"
}
```

### Despesa Mensal 2: Spotify

```json
{
  "id": "monthly-exp-002",
  "name": "Spotify Premium",
  "amount": 21.90,
  "dayOfMonth": 5,
  "cancellationLink": "https://www.spotify.com/account/subscription/",
  "userId": "user-001"
}
```

### Despesa Mensal 3: Academia

```json
{
  "id": "monthly-exp-003",
  "name": "Academia",
  "amount": 120.00,
  "dayOfMonth": 1,
  "cancellationLink": null,
  "userId": "user-001"
}
```

## Receitas Mensais de Teste

### Receita Mensal 1: Salário

```json
{
  "id": "monthly-rev-001",
  "name": "Salário",
  "amount": 5000.00,
  "dayOfMonth": 5,
  "userId": "user-001"
}
```

### Receita Mensal 2: Aluguel Recebido

```json
{
  "id": "monthly-rev-002",
  "name": "Aluguel Recebido",
  "amount": 800.00,
  "dayOfMonth": 10,
  "userId": "user-001"
}
```

## Desejos de Teste

### Desejo 1: iPhone 15

```json
{
  "id": "wish-001",
  "name": "iPhone 15",
  "categoryId": "cat-003",
  "amount": 5000.00,
  "purchaseLink": "https://www.apple.com/br/iphone-15/",
  "userId": "user-001"
}
```

### Desejo 2: Notebook

```json
{
  "id": "wish-002",
  "name": "MacBook Pro",
  "categoryId": "cat-003",
  "amount": 15000.00,
  "purchaseLink": "https://www.apple.com/br/macbook-pro/",
  "userId": "user-001"
}
```

### Desejo 3: Sem Categoria

```json
{
  "id": "wish-003",
  "name": "Viagem para Europa",
  "categoryId": null,
  "amount": null,
  "purchaseLink": null,
  "userId": "user-001"
}
```

## Lista de Compras de Teste

### Item 1: Leite

```json
{
  "id": "shop-001",
  "name": "Leite",
  "price": 5.50,
  "isPurchased": false,
  "userId": "user-001"
}
```

### Item 2: Pão

```json
{
  "id": "shop-002",
  "name": "Pão",
  "price": 8.00,
  "isPurchased": false,
  "userId": "user-001"
}
```

### Item 3: Café

```json
{
  "id": "shop-003",
  "name": "Café",
  "price": 15.90,
  "isPurchased": true,
  "userId": "user-001"
}
```

## Dados para Testes de Validação

### Dados Inválidos - Receita

```json
{
  "invalidRevenue": {
    "nameTooShort": {
      "name": "A",
      "amount": 100,
      "date": "2024-01-01"
    },
    "nameTooLong": {
      "name": "A".repeat(101),
      "amount": 100,
      "date": "2024-01-01"
    },
    "negativeAmount": {
      "name": "Teste",
      "amount": -100,
      "date": "2024-01-01"
    },
    "futureDate": {
      "name": "Teste",
      "amount": 100,
      "date": "2025-12-31"
    },
    "amountTooHigh": {
      "name": "Teste",
      "amount": 1000000.00,
      "date": "2024-01-01"
    }
  }
}
```

### Dados Inválidos - Categoria

```json
{
  "invalidCategory": {
    "nameTooShort": {
      "name": "A",
      "budgetMax": 1000
    },
    "duplicateName": {
      "name": "Alimentação",
      "budgetMax": 1000
    },
    "negativeBudget": {
      "name": "Teste",
      "budgetMax": -100
    }
  }
}
```

## Dados para Testes de Performance

### Grande Volume - Receitas

```json
{
  "bulkRevenues": {
    "count": 1000,
    "template": {
      "name": "Receita {{index}}",
      "amount": 100.00,
      "date": "2024-01-{{day}}"
    }
  }
}
```

### Grande Volume - Despesas

```json
{
  "bulkExpenses": {
    "count": 1000,
    "template": {
      "name": "Despesa {{index}}",
      "amount": 50.00,
      "categoryId": "cat-001",
      "date": "2024-01-{{day}}"
    }
  }
}
```

## Dados para Testes de Orçamento

### Cenário 1: Dentro do Orçamento

```json
{
  "scenario": "within-budget",
  "category": {
    "budgetMax": 1000.00
  },
  "expenses": [
    { "amount": 300.00 },
    { "amount": 200.00 }
  ],
  "expectedRemaining": 500.00
}
```

### Cenário 2: Orçamento Ultrapassado

```json
{
  "scenario": "budget-exceeded",
  "category": {
    "budgetMax": 1000.00
  },
  "expenses": [
    { "amount": 600.00 },
    { "amount": 500.00 }
  ],
  "expectedRemaining": -100.00
}
```

### Cenário 3: Orçamento no Limite

```json
{
  "scenario": "at-limit",
  "category": {
    "budgetMax": 1000.00
  },
  "expenses": [
    { "amount": 1000.00 }
  ],
  "expectedRemaining": 0.00
}
```

## Dados para Testes de Simulação

### Simulação - Despesa

```json
{
  "id": "sim-exp-001",
  "name": "Compras Futuras",
  "amount": 2000.00,
  "date": "2024-06-15",
  "userId": "user-001"
}
```

### Simulação - Compra no Crédito

```json
{
  "id": "sim-credit-001",
  "name": "Notebook",
  "amount": 10000.00,
  "installments": 12,
  "purchaseDate": "2024-02-01",
  "userId": "user-001",
  "expectedMonthlyPayment": 833.33
}
```

## Seeds SQL para Testes

```sql
-- Inserir usuário de teste
INSERT INTO users (id, email, password_hash, name)
VALUES (
  'user-001',
  'test@example.com',
  '$2b$10$hashed_password',
  'Usuário Teste'
);

-- Inserir categorias
INSERT INTO categories (id, user_id, name, budget_max, color)
VALUES
  ('cat-001', 'user-001', 'Alimentação', 1000.00, '#3b82f6'),
  ('cat-002', 'user-001', 'Transporte', 500.00, '#ef4444'),
  ('cat-003', 'user-001', 'Eletrônicos', 10000.00, '#10b981');

-- Inserir receitas
INSERT INTO revenues (id, user_id, name, amount, date)
VALUES
  ('rev-001', 'user-001', 'Salário', 5000.00, '2024-01-05'),
  ('rev-002', 'user-001', 'Freelance', 1500.00, '2024-01-15');

-- Inserir despesas
INSERT INTO expenses (id, user_id, category_id, name, amount, date)
VALUES
  ('exp-001', 'user-001', 'cat-001', 'Supermercado', 450.00, '2024-01-10'),
  ('exp-002', 'user-001', 'cat-002', 'Uber', 35.50, '2024-01-12');
```

## Fixtures JSON

### fixtures/users.json

```json
[
  {
    "id": "user-001",
    "email": "test@example.com",
    "name": "Usuário Teste",
    "password": "password123"
  }
]
```

### fixtures/categories.json

```json
[
  {
    "id": "cat-001",
    "userId": "user-001",
    "name": "Alimentação",
    "budgetMax": 1000.00,
    "color": "#3b82f6"
  }
]
```

## Helpers para Geração de Dados

### Função: Gerar Receitas

```typescript
function generateRevenues(count: number, userId: string) {
  return Array.from({ length: count }, (_, i) => ({
    id: `rev-${i + 1}`,
    userId,
    name: `Receita ${i + 1}`,
    amount: Math.random() * 1000 + 100,
    date: new Date(2024, 0, (i % 28) + 1),
  }));
}
```

### Função: Gerar Despesas

```typescript
function generateExpenses(
  count: number,
  userId: string,
  categoryId: string
) {
  return Array.from({ length: count }, (_, i) => ({
    id: `exp-${i + 1}`,
    userId,
    categoryId,
    name: `Despesa ${i + 1}`,
    amount: Math.random() * 500 + 50,
    date: new Date(2024, 0, (i % 28) + 1),
  }));
}
```

## Estratégia de Limpeza

### Antes de Cada Teste

```typescript
beforeEach(async () => {
  // Limpar todas as tabelas na ordem correta (respeitando FKs)
  await db('expenses').delete();
  await db('revenues').delete();
  await db('monthly_expenses').delete();
  await db('monthly_revenues').delete();
  await db('wishes').delete();
  await db('shopping_list_items').delete();
  await db('categories').delete();
  // Manter usuários ou recriar conforme necessário
});
```

### Após Todos os Testes

```typescript
afterAll(async () => {
  // Limpar completamente ou resetar banco de teste
  await db.migrate.rollback();
  await db.migrate.latest();
});
```

---

**Versão**: 1.0  
**Última Atualização**: 2024



