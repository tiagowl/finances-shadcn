# Diagramas de Arquitetura - Sistema de Controle Financeiro

## 1. Visão Geral do Sistema

### 1.1 Arquitetura de Alto Nível

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Browser)                        │
│                    React 19 + shadcn/ui                          │
└────────────────────────────┬──────────────────────────────────────┘
                             │ HTTPS
                             │ REST API
┌────────────────────────────▼──────────────────────────────────────┐
│                    API GATEWAY / LOAD BALANCER                    │
│                    (Nginx / Cloudflare)                          │
└────────────────────────────┬──────────────────────────────────────┘
                             │
┌────────────────────────────▼──────────────────────────────────────┐
│                    BACKEND APPLICATION                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Fastify HTTP Server                          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │   │
│  │  │  Auth    │  │  Routes   │  │  Middle  │              │   │
│  │  │  Layer   │  │  Handler  │  │  wares   │              │   │
│  │  └──────────┘  └──────────┘  └──────────┘              │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         Application Layer (Clean Architecture)            │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │   │
│  │  │  Use     │  │  Domain  │  │  DTOs    │              │   │
│  │  │  Cases   │  │  Models  │  │  /      │              │   │
│  │  │          │  │          │  │  Mappers│              │   │
│  │  └──────────┘  └──────────┘  └──────────┘              │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         Infrastructure Layer                               │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │   │
│  │  │ Repository│  │  Knex.js │  │  Cache   │              │   │
│  │  │  Pattern  │  │  (Query  │  │  (Redis) │              │   │
│  │  │           │  │  Builder)│  │          │              │   │
│  │  └──────────┘  └──────────┘  └──────────┘              │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬──────────────────────────────────────┘
                             │
┌────────────────────────────▼──────────────────────────────────────┐
│                    POSTGRESQL DATABASE                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Users      │  │ Transactions │  │  Categories   │          │
│  │   Table      │  │   Tables     │  │   Table       │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└───────────────────────────────────────────────────────────────────┘
```

---

## 2. Arquitetura de Camadas (Clean Architecture)

### 2.1 Estrutura de Camadas

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  React Components (shadcn/ui)                         │  │
│  │  - Pages                                               │  │
│  │  - Components                                          │  │
│  │  - Hooks                                               │  │
│  │  - Services (API Client)                               │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────────┬──────────────────────────────────┘
                             │ HTTP/REST
┌────────────────────────────▼──────────────────────────────────┐
│                    APPLICATION LAYER                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Use Cases / Application Services                      │  │
│  │  - CreateRevenueUseCase                               │  │
│  │  - CreateExpenseUseCase                                │  │
│  │  - CalculateBudgetUseCase                             │  │
│  │  - SimulateFutureExpensesUseCase                      │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────────┬──────────────────────────────────┘
                             │
┌────────────────────────────▼──────────────────────────────────┐
│                    DOMAIN LAYER                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Domain Entities                                       │  │
│  │  - User                                                │  │
│  │  - Revenue                                             │  │
│  │  - Expense                                             │  │
│  │  - Category                                            │  │
│  │  - Budget                                              │  │
│  │                                                        │  │
│  │  Domain Services                                       │  │
│  │  - BudgetCalculator                                    │  │
│  │  - SimulationEngine                                    │  │
│  │                                                        │  │
│  │  Value Objects                                         │  │
│  │  - Money                                               │  │
│  │  - DateRange                                           │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────────┬──────────────────────────────────┘
                             │
┌────────────────────────────▼──────────────────────────────────┐
│                    INFRASTRUCTURE LAYER                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Repositories (Implementations)                        │  │
│  │  - UserRepository (PostgreSQL)                        │  │
│  │  - RevenueRepository (PostgreSQL)                      │  │
│  │  - ExpenseRepository (PostgreSQL)                     │  │
│  │                                                        │  │
│  │  External Services                                     │  │
│  │  - Database (Knex.js)                                 │  │
│  │  - Cache (Redis - futuro)                            │  │
│  │  - File Storage (futuro)                             │  │
│  └───────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

---

## 3. Fluxo de Dados

### 3.1 Fluxo de Criação de Receita

```
┌──────────┐
│  User    │
│ (Browser)│
└────┬─────┘
     │ 1. Submit Form
     ▼
┌─────────────────┐
│ React Component │
│ (CreateRevenue) │
└────┬────────────┘
     │ 2. API Call
     ▼
┌─────────────────┐
│  API Client     │
│  (Axios/Fetch)  │
└────┬────────────┘
     │ 3. HTTP POST /api/revenues
     ▼
┌─────────────────┐
│  Fastify Route  │
│  Handler        │
└────┬────────────┘
     │ 4. Validate & Auth
     ▼
┌─────────────────┐
│  Middleware     │
│  - Auth JWT     │
│  - Validation  │
└────┬────────────┘
     │ 5. Call Use Case
     ▼
┌─────────────────┐
│  Use Case       │
│ CreateRevenue   │
└────┬────────────┘
     │ 6. Business Logic
     ▼
┌─────────────────┐
│  Domain Entity  │
│  Revenue        │
└────┬────────────┘
     │ 7. Save via Repository
     ▼
┌─────────────────┐
│  Repository     │
│  (Implementation)│
└────┬────────────┘
     │ 8. Knex Query
     ▼
┌─────────────────┐
│  PostgreSQL     │
│  Database       │
└─────────────────┘
     │ 9. Response
     ▼
[Retorna ao usuário via mesma cadeia]
```

---

### 3.2 Fluxo de Consulta com Cache

```
┌──────────┐
│  User    │
│ (Browser)│
└────┬─────┘
     │ 1. Request Dashboard
     ▼
┌─────────────────┐
│  API Route      │
│  /api/dashboard │
└────┬────────────┘
     │ 2. Check Cache
     ▼
┌─────────────────┐
│  Cache Layer    │
│  (Redis)        │
└────┬────────────┘
     │ 3a. Cache Hit → Return
     │ 3b. Cache Miss
     ▼
┌─────────────────┐
│  Use Case       │
│  GetDashboard   │
└────┬────────────┘
     │ 4. Aggregate Data
     ▼
┌─────────────────┐
│  Repositories   │
│  - Revenue      │
│  - Expense      │
└────┬────────────┘
     │ 5. Database Queries
     ▼
┌─────────────────┐
│  PostgreSQL     │
└────┬────────────┘
     │ 6. Return Data
     ▼
┌─────────────────┐
│  Cache Store    │
│  (TTL: 5min)    │
└────┬────────────┘
     │ 7. Return to User
     ▼
[Response]
```

---

## 4. Arquitetura de Banco de Dados

### 4.1 Modelo de Dados (ER Simplificado)

```
┌──────────────┐
│    Users     │
├──────────────┤
│ id (PK)      │
│ email (UK)   │
│ password     │
│ name         │
│ created_at   │
└──────┬───────┘
       │ 1
       │
       │ N
┌──────▼──────────┐
│   Revenues      │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ name            │
│ amount          │
│ date            │
│ notes           │
│ created_at      │
└─────────────────┘

┌──────────────┐
│  Categories   │
├──────────────┤
│ id (PK)      │
│ user_id (FK) │
│ name (UK)    │
│ budget_max   │
│ color        │
│ created_at   │
└──────┬───────┘
       │ 1
       │
       │ N
┌──────▼──────────┐
│   Expenses      │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ category_id(FK) │
│ name            │
│ amount          │
│ date            │
│ notes           │
│ created_at      │
└─────────────────┘

┌──────────────────┐
│ Monthly Expenses │
├──────────────────┤
│ id (PK)          │
│ user_id (FK)     │
│ name             │
│ amount           │
│ day_of_month     │
│ cancel_link      │
│ created_at       │
└──────────────────┘

┌──────────────────┐
│ Monthly Revenues  │
├──────────────────┤
│ id (PK)          │
│ user_id (FK)     │
│ name             │
│ amount           │
│ day_of_month     │
│ created_at       │
└──────────────────┘

┌──────────────┐
│   Wishes     │
├──────────────┤
│ id (PK)      │
│ user_id (FK) │
│ name         │
│ purchase_link│
│ created_at   │
└──────────────┘

┌──────────────────┐
│  Shopping Lists   │
├──────────────────┤
│ id (PK)          │
│ user_id (FK)     │
│ name             │
│ price            │
│ is_purchased     │
│ created_at       │
└──────────────────┘

┌──────────────────┐
│  Simulations      │
├──────────────────┤
│ id (PK)          │
│ user_id (FK)     │
│ type             │
│ name             │
│ amount           │
│ month            │
│ created_at       │
└──────────────────┘
```

---

## 5. Arquitetura de Segurança

### 5.1 Camadas de Segurança

```
┌─────────────────────────────────────────┐
│         CLIENT SIDE                     │
│  ┌───────────────────────────────────┐ │
│  │  - Input Validation               │ │
│  │  - XSS Protection                 │ │
│  │  - HTTPS Only                     │ │
│  └───────────────────────────────────┘ │
└─────────────────┬───────────────────────┘
                  │ HTTPS/TLS
┌─────────────────▼───────────────────────┐
│         API GATEWAY                    │
│  ┌───────────────────────────────────┐ │
│  │  - Rate Limiting                 │ │
│  │  - DDoS Protection               │ │
│  │  - CORS Configuration            │ │
│  └───────────────────────────────────┘ │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         APPLICATION LAYER               │
│  ┌───────────────────────────────────┐ │
│  │  - JWT Authentication            │ │
│  │  - Authorization Middleware       │ │
│  │  - Input Sanitization            │ │
│  │  - SQL Injection Prevention      │ │
│  └───────────────────────────────────┘ │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         DATABASE LAYER                  │
│  ┌───────────────────────────────────┐ │
│  │  - Parameterized Queries         │ │
│  │  - Row Level Security (RLS)      │ │
│  │  - Encrypted Connections          │ │
│  │  - Backup & Recovery             │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 6. Arquitetura de Deploy

### 6.1 Ambiente de Produção

```
┌─────────────────────────────────────────────┐
│         CDN / Static Assets                 │
│         (Cloudflare / Vercel)               │
└─────────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         Load Balancer                       │
│         (Nginx / Cloud Load Balancer)       │
└─────┬───────────────────────┬───────────────┘
      │                       │
┌─────▼──────┐        ┌───────▼────────┐
│  Backend   │        │  Backend       │
│  Instance 1│        │  Instance 2    │
│  (Node.js) │        │  (Node.js)     │
└─────┬──────┘        └───────┬────────┘
      │                       │
      └───────────┬────────────┘
                  │
      ┌───────────▼───────────┐
      │   PostgreSQL          │
      │   (Primary + Replica)  │
      └───────────────────────┘
                  │
      ┌───────────▼───────────┐
      │   Redis Cache         │
      │   (Optional)          │
      └───────────────────────┘
```

---

## 7. Componentes e Responsabilidades

### 7.1 Frontend (React)

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/            # shadcn/ui components
│   ├── forms/         # Formulários
│   └── charts/        # Gráficos
├── pages/              # Páginas da aplicação
│   ├── dashboard/
│   ├── revenues/
│   ├── expenses/
│   └── simulation/
├── hooks/              # Custom hooks
├── services/           # API clients
├── stores/             # State management (Zustand/Redux)
├── utils/              # Funções utilitárias
└── types/              # TypeScript types
```

### 7.2 Backend (Fastify + Clean Architecture)

```
src/
├── presentation/       # Camada de apresentação
│   ├── http/          # Fastify routes
│   ├── middleware/    # Middlewares
│   └── dto/           # Data Transfer Objects
├── application/        # Camada de aplicação
│   ├── use-cases/    # Casos de uso
│   └── services/      # Serviços de aplicação
├── domain/             # Camada de domínio
│   ├── entities/     # Entidades
│   ├── value-objects/ # Value Objects
│   └── services/      # Serviços de domínio
├── infrastructure/      # Camada de infraestrutura
│   ├── database/     # Knex.js
│   ├── repositories/ # Implementações
│   └── cache/         # Cache (Redis)
└── shared/             # Código compartilhado
    ├── errors/        # Erros customizados
    └── utils/         # Utilitários
```

---

## 8. Fluxo de Autenticação

### 8.1 Login Flow

```
┌──────────┐
│  Client  │
└────┬─────┘
     │ 1. POST /api/auth/login
     │    { email, password }
     ▼
┌─────────────────┐
│  Auth Route     │
└────┬────────────┘
     │ 2. Validate Input
     ▼
┌─────────────────┐
│  LoginUseCase   │
└────┬────────────┘
     │ 3. Find User
     ▼
┌─────────────────┐
│ UserRepository  │
└────┬────────────┘
     │ 4. Verify Password (bcrypt)
     ▼
┌─────────────────┐
│  Generate JWT   │
│  (Access Token) │
└────┬────────────┘
     │ 5. Return Token
     ▼
┌─────────────────┐
│  Client Stores  │
│  Token (localStorage)│
└─────────────────┘
     │ 6. Include in Headers
     ▼
[Subsequent Requests]
```

---

## 9. Integrações Futuras

### 9.1 Possíveis Integrações

```
┌─────────────────┐
│  Main App       │
└────────┬────────┘
         │
    ┌────┴────┬──────────────┬─────────────┐
    │        │              │             │
┌───▼───┐ ┌─▼──────┐  ┌────▼────┐  ┌─────▼────┐
│ Email │ │ Banking│  │ Analytics│  │ File      │
│ Service│ │ API   │  │ (Google)│  │ Storage   │
│(SendGrid)│       │  │         │  │ (S3)      │
└────────┘ └───────┘  └─────────┘  └───────────┘
```

---

## 10. Escalabilidade

### 10.1 Estratégias de Escala

**Horizontal Scaling:**
- Múltiplas instâncias do backend
- Load balancer distribui requisições
- Stateless application (JWT)

**Vertical Scaling:**
- Aumentar recursos do servidor
- Otimizar queries do banco
- Cache para reduzir carga

**Database Scaling:**
- Read replicas para consultas
- Connection pooling
- Índices otimizados

---

## 11. Monitoramento e Observabilidade

### 11.1 Stack de Monitoramento

```
┌─────────────────┐
│  Application    │
└────────┬────────┘
         │
    ┌────┴────┬──────────────┬─────────────┐
    │        │              │             │
┌───▼───┐ ┌─▼──────┐  ┌────▼────┐  ┌─────▼────┐
│ Logs  │ │ Metrics│  │ Traces  │  │ Alerts   │
│(Winston)│(Prometheus)│(OpenTelemetry)│(PagerDuty)│
└───────┘ └─────────┘  └─────────┘  └──────────┘
```

---

**Diagramas gerados pelo Arquiteto de Software**  
**Baseado nos requisitos do Product Owner**  
**Versão 1.0**





