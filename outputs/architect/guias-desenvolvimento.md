# Guias de Desenvolvimento - Sistema de Controle Financeiro

## 1. Introdução

Este documento fornece guias práticos para desenvolvedores trabalhando no Sistema de Controle Financeiro. Inclui padrões de código, boas práticas, convenções e exemplos.

---

## 2. Setup do Ambiente

### 2.1 Pré-requisitos

- Node.js 20+ e npm/yarn/pnpm
- PostgreSQL 16+
- Git
- Editor: VS Code (recomendado)
- Docker e Docker Compose (opcional)

### 2.2 Configuração Inicial

#### Backend

```bash
cd backend
npm install
cp .env.example .env
# Configurar variáveis de ambiente
npm run migrate
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Configurar variáveis de ambiente
npm run dev
```

---

## 3. Padrões de Código

### 3.1 TypeScript

#### Configuração

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

#### Boas Práticas

- **Sempre use tipos explícitos** para funções públicas
- **Evite `any`**: Use `unknown` se necessário
- **Use interfaces** para objetos, **types** para unions/intersections
- **Prefira `const`** sobre `let`, evite `var`

```typescript
// ✅ Bom
interface User {
  id: string;
  email: string;
}

function getUser(id: string): Promise<User | null> {
  // ...
}

// ❌ Ruim
function getUser(id: any): any {
  // ...
}
```

---

### 3.2 Nomenclatura

#### Variáveis e Funções

```typescript
// camelCase
const userName = 'John';
const totalRevenue = 1000;

function calculateTotal() { }
function getUserById(id: string) { }
```

#### Classes e Interfaces

```typescript
// PascalCase
class RevenueRepository { }
interface IUserService { }
type CreateRevenueDTO = { }
```

#### Constantes

```typescript
// UPPER_SNAKE_CASE para constantes globais
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;

// camelCase para constantes locais
const defaultConfig = { };
```

#### Arquivos

- **Componentes React**: `PascalCase.tsx` (`RevenueCard.tsx`)
- **Hooks**: `camelCase.ts` com prefixo `use` (`useRevenues.ts`)
- **Utils**: `camelCase.ts` (`formatters.ts`)
- **Types**: `PascalCase.ts` (`Revenue.ts`)

---

### 3.3 Estrutura de Arquivos

#### Componente React

```typescript
// RevenueCard.tsx
import React from 'react';
import { Card } from '@/components/ui/card';

interface RevenueCardProps {
  revenue: Revenue;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function RevenueCard({ revenue, onEdit, onDelete }: RevenueCardProps) {
  return (
    <Card>
      {/* ... */}
    </Card>
  );
}
```

#### Use Case

```typescript
// create-revenue.use-case.ts
import { IRevenueRepository } from '@/domain/repositories';
import { Revenue } from '@/domain/entities';
import { CreateRevenueDTO } from '@/application/dto';

export class CreateRevenueUseCase {
  constructor(
    private revenueRepository: IRevenueRepository
  ) {}

  async execute(dto: CreateRevenueDTO): Promise<Revenue> {
    // 1. Validar
    // 2. Criar entidade
    // 3. Persistir
    // 4. Retornar
  }
}
```

---

## 4. Clean Architecture - Guia Prático

### 4.1 Regra de Dependência

**Camadas internas NÃO podem depender de camadas externas.**

```
Domain ← Application ← Infrastructure
         ↑
    Presentation
```

### 4.2 Exemplo: Criar Receita

#### 1. Domain Layer (Entidade)

```typescript
// domain/entities/revenue.entity.ts
export class Revenue {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly amount: number,
    public readonly date: Date,
    public readonly notes?: string
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.name.length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
    if (this.amount <= 0) {
      throw new Error('Amount must be positive');
    }
    if (this.date > new Date()) {
      throw new Error('Date cannot be in the future');
    }
  }
}
```

#### 2. Domain Layer (Repository Interface)

```typescript
// domain/repositories/revenue.repository.interface.ts
import { Revenue } from '../entities';

export interface IRevenueRepository {
  create(revenue: Revenue): Promise<Revenue>;
  findById(id: string): Promise<Revenue | null>;
  findByUserId(userId: string): Promise<Revenue[]>;
}
```

#### 3. Application Layer (Use Case)

```typescript
// application/use-cases/create-revenue.use-case.ts
import { IRevenueRepository } from '@/domain/repositories';
import { Revenue } from '@/domain/entities';
import { CreateRevenueDTO } from '../dto';

export class CreateRevenueUseCase {
  constructor(
    private revenueRepository: IRevenueRepository
  ) {}

  async execute(dto: CreateRevenueDTO, userId: string): Promise<Revenue> {
    const revenue = new Revenue(
      crypto.randomUUID(),
      userId,
      dto.name,
      dto.amount,
      dto.date,
      dto.notes
    );

    return await this.revenueRepository.create(revenue);
  }
}
```

#### 4. Infrastructure Layer (Repository Implementation)

```typescript
// infrastructure/repositories/postgres-revenue.repository.ts
import { IRevenueRepository } from '@/domain/repositories';
import { Revenue } from '@/domain/entities';
import { knex } from '../database';

export class PostgreSQLRevenueRepository implements IRevenueRepository {
  async create(revenue: Revenue): Promise<Revenue> {
    await knex('revenues').insert({
      id: revenue.id,
      user_id: revenue.userId,
      name: revenue.name,
      amount: revenue.amount,
      date: revenue.date,
      notes: revenue.notes
    });

    return revenue;
  }

  // ... outros métodos
}
```

#### 5. Presentation Layer (Route Handler)

```typescript
// presentation/http/routes/revenues.routes.ts
import { FastifyInstance } from 'fastify';
import { CreateRevenueUseCase } from '@/application/use-cases';
import { createRevenueSchema } from '../schemas';

export async function revenueRoutes(fastify: FastifyInstance) {
  fastify.post('/revenues', async (request, reply) => {
    const userId = request.userId; // do middleware de auth
    const dto = createRevenueSchema.parse(request.body);

    const useCase = new CreateRevenueUseCase(
      fastify.revenueRepository // injetado via DI
    );

    const revenue = await useCase.execute(dto, userId);

    return reply.status(201).send(revenue);
  });
}
```

---

## 5. Tratamento de Erros

### 5.1 Hierarquia de Erros

```typescript
// shared/errors/app-error.ts
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// shared/errors/not-found-error.ts
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

// shared/errors/validation-error.ts
export class ValidationError extends AppError {
  constructor(message: string, public errors: any[]) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}
```

### 5.2 Uso em Use Cases

```typescript
async execute(id: string): Promise<Revenue> {
  const revenue = await this.revenueRepository.findById(id);
  
  if (!revenue) {
    throw new NotFoundError('Revenue');
  }
  
  return revenue;
}
```

### 5.3 Error Handler

```typescript
// presentation/http/middleware/error.middleware.ts
app.setErrorHandler((error, request, reply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: {
        code: error.code,
        message: error.message,
        ...(error.errors && { errors: error.errors })
      }
    });
  }

  logger.error(error);
  
  return reply.status(500).send({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error'
    }
  });
});
```

---

## 6. Validação

### 6.1 Backend (Zod)

```typescript
// presentation/http/schemas/revenue.schema.ts
import { z } from 'zod';

export const createRevenueSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  amount: z.number().positive('Amount must be positive').max(999999.99),
  date: z.coerce.date().max(new Date(), 'Date cannot be in the future'),
  notes: z.string().max(500).optional()
});

export type CreateRevenueDTO = z.infer<typeof createRevenueSchema>;
```

### 6.2 Frontend (React Hook Form + Zod)

```typescript
// components/forms/CreateRevenueForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createRevenueSchema } from '@/schemas';

export function CreateRevenueForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(createRevenueSchema)
  });

  const onSubmit = async (data: CreateRevenueDTO) => {
    // ...
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* ... */}
    </form>
  );
}
```

---

## 7. Testes

### 7.1 Estrutura de Testes

```
tests/
├── unit/
│   ├── domain/
│   ├── application/
│   └── utils/
├── integration/
│   ├── use-cases/
│   └── repositories/
└── e2e/
    └── api/
```

### 7.2 Exemplo: Teste Unitário

```typescript
// tests/unit/domain/entities/revenue.entity.test.ts
import { Revenue } from '@/domain/entities';

describe('Revenue Entity', () => {
  it('should create a valid revenue', () => {
    const revenue = new Revenue(
      '1',
      'user-1',
      'Salary',
      5000,
      new Date('2024-01-15')
    );

    expect(revenue.name).toBe('Salary');
    expect(revenue.amount).toBe(5000);
  });

  it('should throw error for invalid name', () => {
    expect(() => {
      new Revenue('1', 'user-1', 'A', 100, new Date());
    }).toThrow('Name must be at least 2 characters');
  });
});
```

### 7.3 Exemplo: Teste de Integração

```typescript
// tests/integration/use-cases/create-revenue.use-case.test.ts
import { CreateRevenueUseCase } from '@/application/use-cases';
import { PostgreSQLRevenueRepository } from '@/infrastructure/repositories';

describe('CreateRevenueUseCase', () => {
  let useCase: CreateRevenueUseCase;
  let repository: PostgreSQLRevenueRepository;

  beforeEach(() => {
    repository = new PostgreSQLRevenueRepository(knex);
    useCase = new CreateRevenueUseCase(repository);
  });

  it('should create a revenue', async () => {
    const dto = {
      name: 'Salary',
      amount: 5000,
      date: new Date('2024-01-15')
    };

    const revenue = await useCase.execute(dto, 'user-1');

    expect(revenue.name).toBe('Salary');
    expect(revenue.id).toBeDefined();
  });
});
```

---

## 8. Migrations

### 8.1 Criar Migration

```bash
npm run migrate:make create_revenues_table
```

### 8.2 Exemplo de Migration

```typescript
// migrations/001_create_revenues.ts
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('revenues', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('name', 255).notNullable();
    table.decimal('amount', 10, 2).notNullable();
    table.date('date').notNullable();
    table.text('notes');
    table.timestamps(true, true);

    table.index('user_id');
    table.index('date');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('revenues');
}
```

### 8.3 Executar Migrations

```bash
# Desenvolvimento
npm run migrate

# Produção
npm run migrate:latest
```

---

## 9. Git Workflow

### 9.1 Branching Strategy

- **main**: Produção
- **develop**: Desenvolvimento
- **feature/**: Novas features
- **fix/**: Correções de bugs
- **hotfix/**: Correções urgentes

### 9.2 Commits

Seguir Conventional Commits:

```
feat: adiciona criação de receitas
fix: corrige validação de data
docs: atualiza README
refactor: reorganiza estrutura de pastas
test: adiciona testes para Revenue entity
```

### 9.3 Pull Requests

- Título descritivo
- Descrição do que foi feito
- Screenshots (se UI)
- Checklist de revisão
- Referência a issues (se aplicável)

---

## 10. Code Review

### 10. Checklist

- [ ] Código segue padrões do projeto
- [ ] Testes passando
- [ ] Sem console.logs ou código comentado
- [ ] Tratamento de erros adequado
- [ ] Validações implementadas
- [ ] Performance considerada
- [ ] Segurança verificada
- [ ] Documentação atualizada (se necessário)

### 10.2 Feedback

- Seja construtivo
- Explique o "porquê"
- Sugira alternativas
- Reconheça o que está bom

---

## 11. Performance

### 11.1 Backend

- **Queries**: Use índices, evite N+1 queries
- **Pagination**: Sempre paginar listas
- **Cache**: Use cache para dados frequentes
- **Connection Pool**: Configure adequadamente

### 11.2 Frontend

- **Code Splitting**: Lazy load de rotas
- **Memoization**: useMemo, useCallback quando necessário
- **Virtual Scrolling**: Para listas grandes
- **Bundle Size**: Monitore tamanho do bundle

---

## 12. Segurança

### 12.1 Checklist

- [ ] Inputs validados
- [ ] SQL injection prevenido (parameterized queries)
- [ ] XSS prevenido (sanitização)
- [ ] Autenticação em todas as rotas protegidas
- [ ] Autorização verificada (usuário só acessa seus dados)
- [ ] Secrets em variáveis de ambiente
- [ ] HTTPS em produção
- [ ] Rate limiting configurado

---

## 13. Debugging

### 13.1 Backend

```typescript
// Usar logger ao invés de console.log
import logger from '@/shared/logger';

logger.info('Revenue created', { revenueId, userId });
logger.error('Error creating revenue', { error, userId });
```

### 13.2 Frontend

- React DevTools
- Redux DevTools (se usar)
- Network tab para debug de API
- Console para erros

---

## 14. Recursos Úteis

### 14.1 Documentação

- [Fastify Docs](https://www.fastify.io/)
- [Knex.js Docs](https://knexjs.org/)
- [React Docs](https://react.dev/)
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [Zod Docs](https://zod.dev/)

### 14.2 Ferramentas

- **Postman/Insomnia**: Testar APIs
- **pgAdmin/DBeaver**: Gerenciar banco
- **VS Code Extensions**: ESLint, Prettier, TypeScript

---

**Guia gerado pelo Arquiteto de Software**  
**Para uso da equipe de desenvolvimento**  
**Versão 1.0**





