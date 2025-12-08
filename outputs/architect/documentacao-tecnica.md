# Documentação Técnica - Sistema de Controle Financeiro

## 1. Visão Geral Técnica

### 1.1 Stack Tecnológica

#### Frontend
- **Framework**: React 19
- **UI Library**: shadcn/ui (via MCP)
- **Build Tool**: Vite
- **State Management**: Zustand ou React Context
- **HTTP Client**: Axios ou Fetch API
- **Form Handling**: React Hook Form + Zod
- **Routing**: React Router v6
- **Charts**: Recharts ou Chart.js
- **Date Handling**: date-fns
- **Monetary Formatting**: numeral.js ou Intl.NumberFormat

#### Backend
- **Runtime**: Node.js 20+
- **Framework**: Fastify 4.x
- **Language**: TypeScript 5.x
- **ORM/Query Builder**: Knex.js 3.x
- **Database**: PostgreSQL 16
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **Error Handling**: Custom error classes

#### Infraestrutura
- **Database**: PostgreSQL (managed ou self-hosted)
- **Cache**: Redis (opcional, futuro)
- **File Storage**: Local ou S3 (futuro)
- **Deploy**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: Winston (logs), Prometheus (métricas)

---

## 2. Arquitetura de Software

### 2.1 Clean Architecture

O sistema segue os princípios da Clean Architecture, organizando o código em camadas bem definidas:

#### Camadas

1. **Presentation Layer** (Frontend)
   - Componentes React
   - Hooks customizados
   - Serviços de API
   - Gerenciamento de estado

2. **Application Layer** (Backend)
   - Use Cases (casos de uso)
   - DTOs (Data Transfer Objects)
   - Mappers (conversão de dados)
   - Application Services

3. **Domain Layer** (Backend)
   - Entities (entidades de domínio)
   - Value Objects
   - Domain Services
   - Domain Events (futuro)

4. **Infrastructure Layer** (Backend)
   - Repository implementations
   - Database connections
   - External services
   - Cache implementations

---

### 2.2 Domain-Driven Design (DDD)

#### Bounded Contexts

1. **User Management Context**
   - User entity
   - Authentication
   - Authorization

2. **Financial Transactions Context**
   - Revenue entity
   - Expense entity
   - Transaction aggregates

3. **Budget Management Context**
   - Category entity
   - Budget entity
   - Budget calculation services

4. **Planning Context**
   - Simulation entity
   - Projection services
   - Forecasting logic

---

### 2.3 Repository Pattern

Todas as operações de persistência passam pelo Repository Pattern:

```typescript
// Interface (Domain Layer)
interface IRevenueRepository {
  create(revenue: Revenue): Promise<Revenue>;
  findById(id: string): Promise<Revenue | null>;
  findByUserId(userId: string): Promise<Revenue[]>;
  update(revenue: Revenue): Promise<Revenue>;
  delete(id: string): Promise<void>;
}

// Implementation (Infrastructure Layer)
class PostgreSQLRevenueRepository implements IRevenueRepository {
  // Implementação usando Knex.js
}
```

---

## 3. Estrutura de Código

### 3.1 Frontend Structure

```
frontend/
├── public/
│   └── assets/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── forms/           # Form components
│   │   ├── charts/          # Chart components
│   │   └── layout/          # Layout components
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/
│   │   ├── revenues/
│   │   ├── expenses/
│   │   ├── categories/
│   │   ├── simulation/
│   │   └── ...
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useRevenues.ts
│   │   └── ...
│   ├── services/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── revenues.ts
│   │   │   └── ...
│   │   └── storage.ts
│   ├── stores/
│   │   ├── authStore.ts
│   │   └── ...
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── ...
│   ├── types/
│   │   ├── api.ts
│   │   ├── domain.ts
│   │   └── ...
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

### 3.2 Backend Structure

```
backend/
├── src/
│   ├── presentation/
│   │   ├── http/
│   │   │   ├── routes/
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── revenues.routes.ts
│   │   │   │   └── ...
│   │   │   ├── middleware/
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── error.middleware.ts
│   │   │   │   └── validation.middleware.ts
│   │   │   └── server.ts
│   │   └── dto/
│   │       ├── create-revenue.dto.ts
│   │       └── ...
│   ├── application/
│   │   ├── use-cases/
│   │   │   ├── revenue/
│   │   │   │   ├── create-revenue.use-case.ts
│   │   │   │   ├── get-revenues.use-case.ts
│   │   │   │   └── ...
│   │   │   └── ...
│   │   ├── services/
│   │   │   └── ...
│   │   └── mappers/
│   │       └── ...
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── user.entity.ts
│   │   │   ├── revenue.entity.ts
│   │   │   ├── expense.entity.ts
│   │   │   └── ...
│   │   ├── value-objects/
│   │   │   ├── money.vo.ts
│   │   │   └── date-range.vo.ts
│   │   ├── services/
│   │   │   ├── budget-calculator.service.ts
│   │   │   └── simulation-engine.service.ts
│   │   └── repositories/
│   │       ├── revenue.repository.interface.ts
│   │       └── ...
│   ├── infrastructure/
│   │   ├── database/
│   │   │   ├── knex.config.ts
│   │   │   ├── migrations/
│   │   │   └── seeds/
│   │   ├── repositories/
│   │   │   ├── postgres-revenue.repository.ts
│   │   │   └── ...
│   │   └── cache/
│   │       └── redis-cache.service.ts
│   └── shared/
│       ├── errors/
│       │   ├── app-error.ts
│       │   ├── not-found-error.ts
│       │   └── ...
│       └── utils/
│           └── ...
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── package.json
├── tsconfig.json
└── .env.example
```

---

## 4. Padrões de Desenvolvimento

### 4.1 Convenções de Nomenclatura

#### Arquivos e Diretórios
- **Componentes React**: PascalCase (`RevenueCard.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useRevenues.ts`)
- **Utils/Services**: camelCase (`formatters.ts`)
- **Types/Interfaces**: PascalCase (`Revenue.ts`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`)

#### Código
- **Variáveis/Funções**: camelCase (`getUserRevenue`)
- **Classes**: PascalCase (`RevenueRepository`)
- **Interfaces/Types**: PascalCase (`IRevenueRepository`)
- **Enums**: PascalCase (`TransactionType`)
- **Constantes**: UPPER_SNAKE_CASE ou camelCase (contexto)

---

### 4.2 Padrões de Design

#### Repository Pattern
```typescript
// Interface no Domain
interface IRepository<T> {
  create(entity: T): Promise<T>;
  findById(id: string): Promise<T | null>;
  update(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}

// Implementação na Infrastructure
class PostgreSQLRepository<T> implements IRepository<T> {
  // ...
}
```

#### Use Case Pattern
```typescript
class CreateRevenueUseCase {
  constructor(
    private revenueRepository: IRevenueRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(input: CreateRevenueDTO): Promise<Revenue> {
    // 1. Validar input
    // 2. Buscar usuário
    // 3. Criar entidade
    // 4. Persistir
    // 5. Retornar
  }
}
```

#### Dependency Injection
```typescript
// Container de DI (usando inversify ou similar)
container.bind<IRevenueRepository>('RevenueRepository')
  .to(PostgreSQLRevenueRepository);

container.bind<CreateRevenueUseCase>('CreateRevenueUseCase')
  .to(CreateRevenueUseCase);
```

---

### 4.3 Tratamento de Erros

#### Hierarquia de Erros

```typescript
// Base Error
class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
  }
}

// Specific Errors
class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

class ValidationError extends AppError {
  constructor(message: string, public errors: any[]) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

class UnauthorizedError extends AppError {
  constructor() {
    super('Unauthorized', 401, 'UNAUTHORIZED');
  }
}
```

#### Error Handler Middleware

```typescript
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
  
  // Log error
  logger.error(error);
  
  // Generic error
  return reply.status(500).send({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error'
    }
  });
});
```

---

## 5. Banco de Dados

### 5.1 Schema Design

#### Tabela: users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

#### Tabela: revenues
```sql
CREATE TABLE revenues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_revenues_user_id ON revenues(user_id);
CREATE INDEX idx_revenues_date ON revenues(date);
```

#### Tabela: categories
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  budget_max DECIMAL(10, 2) NOT NULL DEFAULT 0,
  color VARCHAR(7),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, name)
);

CREATE INDEX idx_categories_user_id ON categories(user_id);
```

#### Tabela: expenses
```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_category_id ON expenses(category_id);
CREATE INDEX idx_expenses_date ON expenses(date);
```

---

### 5.2 Migrations

Usar Knex.js migrations para versionamento do schema:

```typescript
// migrations/001_create_users.ts
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email').unique().notNullable();
    table.string('password_hash').notNullable();
    table.string('name').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
```

---

### 5.3 Queries Otimizadas

#### Exemplo: Dashboard Statistics

```typescript
// Otimizada com agregações no banco
async getDashboardStats(userId: string): Promise<DashboardStats> {
  const [revenues, expenses] = await Promise.all([
    this.knex('revenues')
      .where('user_id', userId)
      .sum('amount as total')
      .first(),
    this.knex('expenses')
      .where('user_id', userId)
      .sum('amount as total')
      .first()
  ]);
  
  return {
    totalRevenue: revenues?.total || 0,
    totalExpense: expenses?.total || 0,
    balance: (revenues?.total || 0) - (expenses?.total || 0)
  };
}
```

---

## 6. Autenticação e Autorização

### 6.1 JWT Strategy

```typescript
// Geração de Token
function generateToken(userId: string): string {
  return jwt.sign(
    { userId, type: 'access' },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );
}

// Middleware de Autenticação
async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const token = request.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    throw new UnauthorizedError();
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    request.userId = decoded.userId;
  } catch (error) {
    throw new UnauthorizedError();
  }
}
```

### 6.2 Row Level Security (RLS)

Implementar no PostgreSQL para garantir isolamento de dados:

```sql
-- Habilitar RLS
ALTER TABLE revenues ENABLE ROW LEVEL SECURITY;

-- Policy: usuários só veem seus próprios dados
CREATE POLICY user_revenues_policy ON revenues
  FOR ALL
  USING (user_id = current_setting('app.user_id')::uuid);
```

---

## 7. Validação

### 7.1 Backend (Zod)

```typescript
import { z } from 'zod';

const createRevenueSchema = z.object({
  name: z.string().min(2).max(100),
  amount: z.number().positive().max(999999.99),
  date: z.date().max(new Date()), // Não pode ser futura
  notes: z.string().max(500).optional()
});

// No middleware
async function validateRequest(
  request: FastifyRequest,
  reply: FastifyReply,
  schema: z.ZodSchema
) {
  try {
    request.body = schema.parse(request.body);
  } catch (error) {
    throw new ValidationError('Invalid input', error.errors);
  }
}
```

### 7.2 Frontend (React Hook Form + Zod)

```typescript
const revenueSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  amount: z.number().positive('Valor deve ser positivo'),
  date: z.date().max(new Date(), 'Data não pode ser futura'),
  notes: z.string().max(500).optional()
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(revenueSchema)
});
```

---

## 8. Performance

### 8.1 Otimizações Frontend

- **Code Splitting**: Lazy loading de rotas
- **Memoization**: React.memo, useMemo, useCallback
- **Virtual Scrolling**: Para listas grandes
- **Image Optimization**: Lazy loading de imagens
- **Bundle Size**: Tree shaking, análise de bundle

### 8.2 Otimizações Backend

- **Connection Pooling**: Knex.js connection pool
- **Query Optimization**: Índices, joins eficientes
- **Caching**: Redis para dados frequentes
- **Pagination**: Todas as listas paginadas
- **Compression**: Gzip/Brotli

---

## 9. Testes

### 9.1 Estratégia de Testes

#### Frontend
- **Unit Tests**: Jest + React Testing Library
- **Component Tests**: Testes de componentes isolados
- **Integration Tests**: Testes de fluxos completos
- **E2E Tests**: Playwright ou Cypress

#### Backend
- **Unit Tests**: Jest
- **Integration Tests**: Testes de use cases
- **API Tests**: Testes de endpoints
- **Database Tests**: Testes com banco de teste

### 9.2 Cobertura

- **Meta**: > 70% de cobertura
- **Crítico**: > 90% para lógica de negócio
- **Aceitável**: > 60% para componentes UI

---

## 10. Segurança

### 10.1 Práticas de Segurança

- **HTTPS**: Obrigatório em produção
- **CORS**: Configurado adequadamente
- **Rate Limiting**: Proteção contra abuse
- **Input Sanitization**: Todos os inputs validados
- **SQL Injection**: Prevenido com parameterized queries
- **XSS**: Prevenido com sanitização
- **CSRF**: Tokens CSRF (se necessário)
- **Secrets**: Variáveis de ambiente, nunca no código

---

## 11. Deploy e DevOps

### 11.1 Docker

```dockerfile
# Dockerfile Backend
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["node", "dist/server.js"]
```

### 11.2 Docker Compose

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/finance
    depends_on:
      - db
  
  db:
    image: postgres:16
    environment:
      - POSTGRES_DB=finance
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## 12. Monitoramento

### 12.1 Logging

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### 12.2 Métricas

- **Response Time**: Tempo de resposta das APIs
- **Error Rate**: Taxa de erros
- **Throughput**: Requisições por segundo
- **Database Performance**: Query times

---

**Documentação técnica gerada pelo Arquiteto de Software**  
**Baseado nos requisitos do Product Owner**  
**Versão 1.0**





