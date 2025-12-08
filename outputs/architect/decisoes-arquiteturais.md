# Decisões Arquiteturais (ADRs) - Sistema de Controle Financeiro

## 1. Introdução

Este documento registra as decisões arquiteturais importantes tomadas durante o desenvolvimento do Sistema de Controle Financeiro. Cada ADR segue o formato padrão: Contexto, Decisão, Consequências.

---

## ADR-001: Uso de Clean Architecture

**Status**: Aceito  
**Data**: 2024-01-XX  
**Decisores**: Arquiteto de Software, Tech Lead

### Contexto

O sistema precisa ser mantível, testável e escalável. A equipe precisa de uma arquitetura que separe claramente as responsabilidades e permita evolução do sistema sem grandes refatorações.

### Decisão

Adotar Clean Architecture com as seguintes camadas:
- **Presentation Layer**: Interface com o usuário (React)
- **Application Layer**: Casos de uso e lógica de aplicação
- **Domain Layer**: Entidades e regras de negócio
- **Infrastructure Layer**: Implementações técnicas (banco, cache, etc.)

### Consequências

**Positivas:**
- Separação clara de responsabilidades
- Fácil testabilidade (camadas isoladas)
- Independência de frameworks
- Facilita manutenção e evolução

**Negativas:**
- Maior complexidade inicial
- Mais arquivos e estrutura
- Curva de aprendizado para novos desenvolvedores
- Overhead para projetos pequenos (mas aceitável para este projeto)

---

## ADR-002: Stack Tecnológica - Fastify + TypeScript

**Status**: Aceito  
**Data**: 2024-01-XX  
**Decisores**: Arquiteto de Software, Product Owner

### Contexto

O requisito especifica Fastify e TypeScript. Precisamos justificar essa escolha e documentar alternativas consideradas.

### Decisão

Usar **Fastify** como framework HTTP e **TypeScript** como linguagem principal.

**Fastify:**
- Framework rápido e eficiente
- Suporte nativo a TypeScript
- Plugin system robusto
- Boa performance (comparado ao Express)

**TypeScript:**
- Type safety
- Melhor DX (Developer Experience)
- Facilita refatoração
- Reduz bugs em tempo de compilação

### Alternativas Consideradas

- **Express.js**: Mais popular, mas menos performático
- **NestJS**: Mais opinionated, mas pode ser overkill
- **JavaScript**: Sem type safety, maior propensão a erros

### Consequências

**Positivas:**
- Performance superior ao Express
- Type safety reduz bugs
- Melhor autocomplete e IntelliSense
- Código mais autodocumentado

**Negativas:**
- Curva de aprendizado do Fastify (menor que NestJS)
- TypeScript adiciona complexidade de build
- Alguns desenvolvedores podem preferir Express

---

## ADR-003: Repository Pattern para Persistência

**Status**: Aceito  
**Data**: 2024-01-XX  
**Decisores**: Arquiteto de Software

### Contexto

Precisamos abstrair a camada de persistência para permitir troca de banco de dados no futuro e facilitar testes.

### Decisão

Implementar Repository Pattern:
- Interfaces no Domain Layer
- Implementações no Infrastructure Layer
- Injeção de dependência para usar repositórios

### Consequências

**Positivas:**
- Abstração da persistência
- Fácil mockar em testes
- Possibilidade de trocar banco sem afetar lógica de negócio
- Alinhado com Clean Architecture

**Negativas:**
- Mais código (interfaces + implementações)
- Overhead para operações simples
- Pode ser considerado over-engineering por alguns

---

## ADR-004: PostgreSQL como Banco de Dados

**Status**: Aceito  
**Data**: 2024-01-XX  
**Decisores**: Product Owner, Arquiteto de Software

### Contexto

O requisito especifica PostgreSQL. Precisamos documentar por que essa escolha faz sentido.

### Decisão

Usar **PostgreSQL 16** como banco de dados principal.

### Justificativa

- **ACID Compliance**: Garante consistência dos dados financeiros
- **Relacionamentos**: Suporta bem relacionamentos complexos
- **Performance**: Excelente para queries complexas e agregações
- **Recursos Avançados**: JSON, arrays, full-text search
- **Row Level Security**: Suporte nativo para segurança
- **Maturidade**: Banco maduro e confiável

### Alternativas Consideradas

- **MySQL/MariaDB**: Similar, mas menos recursos avançados
- **MongoDB**: NoSQL, mas dados financeiros são relacionais
- **SQLite**: Muito limitado para produção

### Consequências

**Positivas:**
- Dados financeiros seguros e consistentes
- Suporte a transações complexas
- Boa performance para agregações
- Recursos avançados disponíveis

**Negativas:**
- Requer servidor dedicado (não serverless fácil)
- Mais complexo que SQLite
- Pode ser overkill para MVP, mas necessário para escalar

---

## ADR-005: Knex.js como Query Builder

**Status**: Aceito  
**Data**: 2024-01-XX  
**Decisores**: Arquiteto de Software

### Contexto

Precisamos de uma ferramenta para gerenciar queries SQL e migrations. O requisito especifica Knex.js.

### Decisão

Usar **Knex.js** como query builder e migration tool.

### Justificativa

- **Type Safety**: Suporte a TypeScript
- **Migrations**: Versionamento de schema nativo
- **Query Builder**: Facilita construção de queries complexas
- **Raw SQL**: Permite SQL puro quando necessário
- **Connection Pooling**: Gerenciamento automático de conexões

### Alternativas Consideradas

- **TypeORM**: Mais features, mas mais complexo
- **Prisma**: Moderno, mas muda paradigma
- **Sequelize**: Mais antigo, menos type-safe
- **SQL Puro**: Mais controle, mas menos produtivo

### Consequências

**Positivas:**
- Migrations versionadas
- Queries type-safe
- Produtividade aumentada
- Fácil de aprender

**Negativas:**
- Ainda precisa conhecer SQL
- Pode gerar queries não otimizadas (requer atenção)
- Menos features que ORMs completos

---

## ADR-006: JWT para Autenticação

**Status**: Aceito  
**Data**: 2024-01-XX  
**Decisores**: Arquiteto de Software

### Contexto

Precisamos de um mecanismo de autenticação stateless, escalável e seguro.

### Decisão

Usar **JWT (JSON Web Tokens)** para autenticação.

### Justificativa

- **Stateless**: Não requer sessão no servidor
- **Escalável**: Funciona bem com múltiplas instâncias
- **Padrão**: Amplamente adotado
- **Flexível**: Pode incluir claims customizados

### Alternativas Consideradas

- **Session-based**: Requer armazenamento de sessão (Redis)
- **OAuth 2.0**: Mais complexo, overkill para este caso
- **API Keys**: Menos seguro, não adequado para usuários

### Consequências

**Positivas:**
- Stateless e escalável
- Fácil implementação
- Padrão conhecido
- Funciona bem com SPA

**Negativas:**
- Tokens não podem ser revogados facilmente (sem blacklist)
- Tokens grandes (podem ser problema em mobile)
- Requer cuidado com expiração e refresh

**Mitigações:**
- Tokens com expiração curta (24h)
- Implementar refresh tokens (futuro)
- Blacklist de tokens (futuro, se necessário)

---

## ADR-007: React 19 + shadcn/ui para Frontend

**Status**: Aceito  
**Data**: 2024-01-XX  
**Decisores**: Product Owner, Arquiteto de Software

### Contexto

O requisito especifica React 19 e shadcn/ui. Precisamos documentar essa escolha.

### Decisão

Usar **React 19** como framework e **shadcn/ui** como biblioteca de componentes.

### Justificativa

**React 19:**
- Framework maduro e popular
- Grande ecossistema
- Suporte a Server Components (futuro)
- Boa performance

**shadcn/ui:**
- Componentes copiáveis (não dependência)
- Baseado em Radix UI (acessível)
- Customizável
- Design moderno
- TypeScript nativo

### Alternativas Consideradas

- **Vue.js**: Alternativa válida, mas requisito especifica React
- **Material-UI**: Mais pesado, menos customizável
- **Ant Design**: Menos moderno, mais opinionated
- **Chakra UI**: Similar, mas shadcn mais flexível

### Consequências

**Positivas:**
- Componentes acessíveis por padrão
- Fácil customização
- Não adiciona dependências pesadas
- Design moderno e consistente

**Negativas:**
- shadcn requer configuração inicial
- Componentes precisam ser copiados (mais arquivos)
- Requer conhecimento de Tailwind CSS

---

## ADR-008: Domain-Driven Design (DDD)

**Status**: Aceito  
**Data**: 2024-01-XX  
**Decisores**: Arquiteto de Software

### Contexto

O sistema tem domínio rico (finanças) com regras de negócio complexas. Precisamos organizar o código de forma que reflita o domínio.

### Decisão

Adotar princípios de **Domain-Driven Design**:
- Entidades de domínio ricas
- Value Objects para conceitos imutáveis
- Domain Services para lógica de domínio
- Bounded Contexts para separação de conceitos

### Consequências

**Positivas:**
- Código reflete o domínio
- Regras de negócio centralizadas
- Facilita comunicação com stakeholders
- Código mais expressivo

**Negativas:**
- Mais complexidade inicial
- Requer conhecimento de DDD
- Pode ser overkill para partes simples do sistema

---

## ADR-009: Validação com Zod

**Status**: Aceito  
**Data**: 2024-01-XX  
**Decisores**: Arquiteto de Software

### Contexto

Precisamos validar dados tanto no frontend quanto no backend de forma consistente.

### Decisão

Usar **Zod** para validação em ambos frontend e backend.

### Justificativa

- **Type-safe**: Gera tipos TypeScript automaticamente
- **Runtime Validation**: Valida em runtime
- **Compartilhável**: Mesmo schema no frontend e backend
- **Expressivo**: API clara e intuitiva
- **Popular**: Boa comunidade e suporte

### Alternativas Consideradas

- **Yup**: Similar, mas menos type-safe
- **Joi**: Mais antigo, menos integrado com TypeScript
- **class-validator**: Baseado em decorators, menos flexível

### Consequências

**Positivas:**
- Validação consistente frontend/backend
- Type safety automático
- Menos código duplicado
- Mensagens de erro claras

**Negativas:**
- Requer aprender Zod
- Schemas podem ficar verbosos
- Performance ligeiramente inferior a validação manual (negligível)

---

## ADR-010: Cache com Redis (Futuro)

**Status**: Proposto  
**Data**: 2024-01-XX  
**Decisores**: Arquiteto de Software

### Contexto

Estatísticas e dados agregados são calculados frequentemente e podem ser custosos.

### Decisão

Implementar **Redis** como cache para:
- Estatísticas do dashboard
- Agregações de receitas/despesas
- Dados frequentemente acessados

**Nota**: Não será implementado no MVP, mas arquitetura deve suportar.

### Justificativa

- **Performance**: Reduz carga no banco
- **Escalabilidade**: Permite múltiplas instâncias compartilharem cache
- **TTL**: Expiração automática de dados
- **Popular**: Amplamente usado

### Consequências

**Positivas:**
- Melhor performance
- Reduz carga no banco
- Escalável

**Negativas:**
- Infraestrutura adicional
- Complexidade de sincronização
- Cache invalidation pode ser complexo

**Implementação Futura:**
- Abstrair cache em interface
- Implementar cache in-memory primeiro (dev)
- Adicionar Redis depois (produção)

---

## ADR-011: Estrutura de Pastas por Feature

**Status**: Aceito  
**Data**: 2024-01-XX  
**Decisores**: Arquiteto de Software

### Contexto

Precisamos organizar o código de forma que seja fácil encontrar e manter.

### Decisão

Organizar código por **camadas** (Clean Architecture) dentro de cada módulo, não por features completas.

**Estrutura:**
```
src/
├── presentation/
├── application/
├── domain/
└── infrastructure/
```

**Não:**
```
src/
├── revenues/
│   ├── controller/
│   ├── service/
│   └── repository/
```

### Justificativa

- Alinhado com Clean Architecture
- Facilita ver dependências entre camadas
- Evita acoplamento entre features
- Permite reutilização de infraestrutura

### Consequências

**Positivas:**
- Separação clara de responsabilidades
- Fácil identificar camadas
- Reutilização de código

**Negativas:**
- Features espalhadas entre pastas
- Pode ser menos intuitivo para alguns
- Requer disciplina para manter organização

---

## ADR-012: Testes com Jest

**Status**: Aceito  
**Data**: 2024-01-XX  
**Decisores**: Arquiteto de Software

### Contexto

Precisamos de uma ferramenta de testes robusta e popular.

### Decisão

Usar **Jest** para testes unitários e de integração.

### Justificativa

- **Popular**: Padrão da indústria
- **TypeScript**: Suporte nativo
- **Mocking**: Sistema de mocks poderoso
- **Coverage**: Relatórios de cobertura integrados
- **Fast**: Execução rápida

### Alternativas Consideradas

- **Vitest**: Mais rápido, mas menos maduro
- **Mocha**: Mais antigo, menos features
- **Ava**: Alternativa, mas menos popular

### Consequências

**Positivas:**
- Ferramenta madura e confiável
- Boa integração com TypeScript
- Fácil de configurar
- Grande comunidade

**Negativas:**
- Pode ser mais lento que alternativas
- Configuração pode ser complexa para casos avançados

---

## ADR-013: Docker para Deploy

**Status**: Aceito  
**Data**: 2024-01-XX  
**Decisores**: Arquiteto de Software, DevOps

### Contexto

Precisamos de uma forma consistente de deploy e desenvolvimento local.

### Decisão

Usar **Docker** e **Docker Compose** para:
- Ambiente de desenvolvimento local
- Deploy em produção
- CI/CD

### Justificativa

- **Consistência**: Mesmo ambiente em dev e prod
- **Isolamento**: Dependências isoladas
- **Portabilidade**: Funciona em qualquer OS
- **Padrão**: Amplamente adotado

### Consequências

**Positivas:**
- Ambiente consistente
- Fácil onboarding de novos devs
- Deploy simplificado
- Isolamento de dependências

**Negativas:**
- Curva de aprendizado do Docker
- Overhead de recursos
- Complexidade adicional

---

## ADR-014: Monorepo vs Multi-repo

**Status**: Aceito  
**Data**: 2024-01-XX  
**Decisores**: Arquiteto de Software

### Contexto

Precisamos decidir como organizar frontend e backend.

### Decisão

Usar **multi-repo** (repositórios separados) para frontend e backend.

### Justificativa

- **Separação de Concerns**: Frontend e backend são independentes
- **Deploy Independente**: Podem ser deployados separadamente
- **Equipes Diferentes**: Podem trabalhar independentemente
- **Menos Complexidade**: Não precisa de ferramentas de monorepo

### Alternativas Consideradas

- **Monorepo**: Nx, Turborepo, mas adiciona complexidade

### Consequências

**Positivas:**
- Separação clara
- Deploy independente
- Menos complexidade

**Negativas:**
- Código compartilhado (types) precisa ser sincronizado
- Mais repositórios para gerenciar

**Mitigação:**
- Compartilhar types via package privado ou git submodule

---

## 15. Histórico de Mudanças

| ADR | Data | Mudança | Motivo |
|-----|------|---------|--------|
| ADR-010 | 2024-01-XX | Criado | Proposta para futuro |

---

**Documento gerado pelo Arquiteto de Software**  
**Baseado nos requisitos do Product Owner**  
**Versão 1.0**





