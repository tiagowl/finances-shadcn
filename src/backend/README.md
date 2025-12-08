# Finance Control Backend API

Backend API para o Sistema de Controle Financeiro, desenvolvido com Fastify, TypeScript, PostgreSQL e Clean Architecture.

## 🚀 Tecnologias

- **Fastify** - Framework HTTP rápido
- **TypeScript** - Type safety
- **PostgreSQL** - Banco de dados relacional
- **Knex.js** - Query builder e migrations
- **Zod** - Validação de schemas
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas

## 📋 Pré-requisitos

- Node.js 20+
- PostgreSQL 16+
- npm/yarn/pnpm

## 🔧 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp env.example .env
# Edite o arquivo .env com suas configurações
```

3. Execute as migrations:
```bash
npm run migrate
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 🌐 Variáveis de Ambiente

Veja o arquivo `env.example` para todas as variáveis necessárias.

## 📚 Estrutura do Projeto

```
src/
├── domain/              # Camada de domínio
│   ├── entities/       # Entidades de negócio
│   └── repositories/   # Interfaces de repositórios
├── application/        # Camada de aplicação
│   ├── use-cases/     # Casos de uso
│   └── dto/           # Data Transfer Objects
├── infrastructure/     # Camada de infraestrutura
│   ├── database/      # Configuração do banco
│   └── repositories/  # Implementações dos repositórios
├── presentation/       # Camada de apresentação
│   └── http/          # Rotas e middlewares
└── shared/            # Código compartilhado
    ├── errors/        # Erros customizados
    └── logger.ts      # Logger
```

## 🔐 Autenticação

A API usa JWT para autenticação. Após fazer login ou registro, você receberá um token que deve ser enviado no header:

```
Authorization: Bearer <token>
```

## 📡 Endpoints Principais

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login

### Receitas
- `GET /api/revenues` - Listar receitas
- `POST /api/revenues` - Criar receita
- `GET /api/revenues/:id` - Obter receita
- `PUT /api/revenues/:id` - Atualizar receita
- `DELETE /api/revenues/:id` - Excluir receita

### Despesas
- `GET /api/expenses` - Listar despesas
- `POST /api/expenses` - Criar despesa

### Categorias
- `GET /api/categories` - Listar categorias
- `POST /api/categories` - Criar categoria

### Dashboard
- `GET /api/dashboard` - Estatísticas do dashboard

## 🧪 Testes

```bash
npm test
npm run test:watch
npm run test:coverage
```

## 🚢 Deploy na Vercel

1. Instale a CLI da Vercel:
```bash
npm i -g vercel
```

2. Faça login:
```bash
vercel login
```

3. Configure o projeto:
```bash
vercel
```

4. Configure as variáveis de ambiente no dashboard da Vercel

5. Deploy:
```bash
vercel --prod
```

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Compila TypeScript
- `npm start` - Inicia servidor de produção
- `npm run migrate` - Executa migrations
- `npm run migrate:make <name>` - Cria nova migration
- `npm test` - Executa testes
- `npm run lint` - Executa linter

## 🔒 Segurança

- Autenticação JWT
- Validação de entrada com Zod
- Rate limiting
- CORS configurado
- Helmet para headers de segurança
- SQL injection prevenido (parameterized queries)

## 📄 Licença

MIT





