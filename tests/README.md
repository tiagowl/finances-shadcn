# Estrutura de Testes

Este diretório contém a estrutura de testes para o projeto de Controle Financeiro.

## Estrutura

```
tests/
├── README.md (este arquivo)
├── backend/
│   ├── unit/          # Testes unitários do backend
│   └── integration/   # Testes de integração do backend
└── frontend/
    ├── unit/          # Testes unitários do frontend
    └── e2e/           # Testes E2E (quando configurado)
```

## Backend

Os testes do backend estão localizados em `src/backend/tests/` e usam Jest.

### Executar Testes

```bash
cd src/backend

# Instalar dependências (se necessário)
npm install

# Executar todos os testes
npm test

# Executar em modo watch
npm run test:watch

# Executar com cobertura
npm run test:coverage
```

### Estrutura de Testes do Backend

- `tests/setup.ts` - Configuração global dos testes
- `tests/helpers/` - Helpers e utilitários para testes
- `tests/integration/` - Testes de integração (APIs)
- `src/**/__tests__/` - Testes unitários próximos ao código

## Frontend

Os testes do frontend estão localizados em `src/frontend/tests/` e usam Vitest.

### Executar Testes

```bash
cd src/frontend

# Instalar dependências (se necessário)
npm install

# Executar todos os testes
npm test

# Executar com UI
npm run test:ui

# Executar com cobertura
npm run test:coverage
```

### Estrutura de Testes do Frontend

- `tests/setup.ts` - Configuração global dos testes
- `src/**/__tests__/` - Testes unitários próximos ao código
- `tests/e2e/` - Testes E2E (quando configurado com Playwright)

## Tipos de Testes

### Testes Unitários

Testam unidades isoladas de código (funções, classes, componentes).

- **Backend**: Use cases, entidades, utilitários
- **Frontend**: Componentes, hooks, stores, utilitários

### Testes de Integração

Testam a integração entre diferentes partes do sistema.

- **Backend**: Endpoints da API, integração com banco de dados
- **Frontend**: Integração entre componentes, stores e serviços

### Testes E2E

Testam fluxos completos do ponto de vista do usuário.

- Configurados com Playwright ou Cypress
- Testam fluxos críticos de negócio

## Helpers e Fixtures

### Backend

- `tests/helpers/auth.ts` - Criação de usuários e tokens de teste
- `tests/helpers/test-setup.ts` - Configuração do app Fastify para testes

### Frontend

- `tests/setup.ts` - Mocks globais (matchMedia, IntersectionObserver, etc.)

## Cobertura de Código

Os relatórios de cobertura são gerados em:

- **Backend**: `src/backend/coverage/`
- **Frontend**: `src/frontend/coverage/`

## CI/CD

Os testes devem ser executados automaticamente em:

- Pull Requests
- Commits na branch main
- Deploy de produção

## Notas

- Os testes usam um banco de dados de teste separado
- Dados de teste são limpos após cada execução
- Testes devem ser isolados e não depender uns dos outros



