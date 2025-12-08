# Backlog Priorizado - Sistema de Controle Financeiro

## Metodologia de Priorização

A priorização foi realizada considerando:
- **Valor de Negócio**: Impacto na capacidade do usuário de gerenciar suas finanças
- **Esforço de Desenvolvimento**: Complexidade técnica estimada em pontos (Fibonacci: 1, 2, 3, 5, 8)
- **Dependências**: Funcionalidades que são pré-requisitos para outras
- **Riscos**: Complexidade técnica e impacto no projeto

## Legenda de Prioridades

- **P0 - Crítica**: Bloqueadores para o MVP, devem ser implementadas primeiro
- **P1 - Alta**: Funcionalidades core do produto, essenciais para o valor mínimo
- **P2 - Média**: Funcionalidades importantes que agregam valor significativo
- **P3 - Baixa**: Melhorias e funcionalidades secundárias

---

## Sprint 0 - Fundação (MVP Mínimo)

### Fase 1: Infraestrutura e Autenticação
**Objetivo**: Permitir que usuários acessem o sistema

| ID | User Story | Prioridade | Pontos | Dependências |
|----|-----------|------------|--------|--------------|
| US-001 | Login de Usuário | P0 | 3 | - |
| US-002 | Cadastro de Usuário | P0 | 3 | - |
| US-044 | Navegação com Sidebar | P1 | 5 | US-001 |
| US-045 | Navegação com Navbar | P1 | 5 | US-001 |
| US-046 | Layout Responsivo | P1 | 8 | US-044, US-045 |

**Total Sprint 0**: 24 pontos

---

## Sprint 1 - Core Financeiro (MVP Essencial)

### Fase 2: Gestão Básica de Receitas e Despesas
**Objetivo**: Permitir registro e visualização básica de transações

| ID | User Story | Prioridade | Pontos | Dependências |
|----|-----------|------------|--------|--------------|
| US-004 | Visualizar Lista de Receitas | P1 | 3 | US-001 |
| US-005 | Criar Nova Receita | P1 | 5 | US-004 |
| US-008 | Visualizar Lista de Despesas | P1 | 5 | US-001 |
| US-009 | Criar Nova Despesa | P1 | 5 | US-008 |
| US-003 | Dashboard com Estatísticas | P1 | 5 | US-004, US-008 |

**Total Sprint 1**: 23 pontos

---

## Sprint 2 - Organização e Categorização

### Fase 3: Sistema de Categorias
**Objetivo**: Permitir organização de despesas por categoria

| ID | User Story | Prioridade | Pontos | Dependências |
|----|-----------|------------|--------|--------------|
| US-023 | Criar Categoria | P1 | 3 | US-001 |
| US-022 | Visualizar Categorias | P1 | 5 | US-023 |
| US-024 | Visualizar Status de Orçamento | P1 | 5 | US-022, US-008 |
| US-009 | Criar Nova Despesa (atualizar) | P1 | - | US-023 |

**Total Sprint 2**: 13 pontos (sem contar atualização de US-009)

---

## Sprint 3 - Edição e Exclusão

### Fase 4: Operações CRUD Completas
**Objetivo**: Permitir edição e exclusão de registros

| ID | User Story | Prioridade | Pontos | Dependências |
|----|-----------|------------|--------|--------------|
| US-006 | Editar Receita | P2 | 3 | US-005 |
| US-007 | Excluir Receita | P2 | 2 | US-005 |
| US-010 | Editar Despesa | P2 | 3 | US-009 |
| US-011 | Excluir Despesa | P2 | 2 | US-009 |
| US-025 | Editar Categoria | P2 | 3 | US-023 |
| US-026 | Excluir Categoria | P2 | 2 | US-023 |

**Total Sprint 3**: 15 pontos

---

## Sprint 4 - Transações Recorrentes

### Fase 5: Receitas e Despesas Mensais
**Objetivo**: Gerenciar compromissos financeiros recorrentes

| ID | User Story | Prioridade | Pontos | Dependências |
|----|-----------|------------|--------|--------------|
| US-012 | Visualizar Despesas Mensais | P1 | 3 | US-001 |
| US-013 | Criar Despesa Mensal | P1 | 5 | US-012 |
| US-014 | Acessar Link de Cancelamento | P2 | 2 | US-013 |
| US-015 | Copiar Link de Cancelamento | P2 | 1 | US-013 |
| US-016 | Editar Despesa Mensal | P2 | 3 | US-013 |
| US-017 | Excluir Despesa Mensal | P2 | 2 | US-013 |
| US-018 | Visualizar Receitas Mensais | P1 | 3 | US-001 |
| US-019 | Criar Receita Mensal | P1 | 5 | US-018 |
| US-020 | Editar Receita Mensal | P2 | 3 | US-019 |
| US-021 | Excluir Receita Mensal | P2 | 2 | US-019 |

**Total Sprint 4**: 29 pontos

---

## Sprint 5 - Planejamento e Simulação

### Fase 6: Simulação de Gastos Futuros
**Objetivo**: Permitir planejamento financeiro de longo prazo

| ID | User Story | Prioridade | Pontos | Dependências |
|----|-----------|------------|--------|--------------|
| US-038 | Visualizar Simulação de Gastos | P1 | 8 | US-001 |
| US-039 | Cadastrar Despesas na Simulação | P1 | 5 | US-038 |
| US-040 | Cadastrar Receitas na Simulação | P1 | 5 | US-038 |
| US-041 | Cadastrar Compras no Crédito | P1 | 5 | US-038 |
| US-042 | Visualizar Projeção de Meses Futuros | P1 | 8 | US-039, US-040, US-041 |
| US-043 | Visualizar Estatísticas da Simulação | P1 | 5 | US-042 |

**Total Sprint 5**: 36 pontos

---

## Sprint 6 - Funcionalidades Adicionais

### Fase 7: Lista de Compras e Desejos
**Objetivo**: Funcionalidades complementares de organização

| ID | User Story | Prioridade | Pontos | Dependências |
|----|-----------|------------|--------|--------------|
| US-033 | Visualizar Lista de Compras | P2 | 5 | US-001 |
| US-034 | Adicionar Item à Lista de Compras | P2 | 3 | US-033 |
| US-035 | Marcar Item como Comprado | P2 | 2 | US-034 |
| US-036 | Editar Item da Lista de Compras | P3 | 2 | US-034 |
| US-037 | Excluir Item da Lista de Compras | P3 | 1 | US-034 |
| US-027 | Visualizar Lista de Desejos | P2 | 3 | US-001 |
| US-028 | Criar Desejo | P2 | 3 | US-027 |
| US-029 | Acessar Link de Compra do Desejo | P2 | 1 | US-028 |
| US-030 | Copiar Link de Compra do Desejo | P3 | 1 | US-028 |
| US-031 | Editar Desejo | P3 | 2 | US-028 |
| US-032 | Excluir Desejo | P3 | 1 | US-028 |

**Total Sprint 6**: 24 pontos

---

## Roadmap Consolidado

### MVP (Minimum Viable Product)
**Sprints 0-2**: Funcionalidades essenciais para uso básico
- Autenticação
- CRUD básico de Receitas e Despesas
- Sistema de Categorias
- Dashboard com estatísticas

**Total MVP**: ~60 pontos

### V1.0 (Versão Completa)
**Sprints 0-6**: Todas as funcionalidades planejadas
- Todas as funcionalidades do MVP
- Transações recorrentes
- Simulação de gastos futuros
- Lista de compras e desejos

**Total V1.0**: ~164 pontos

---

## Análise de Dependências Críticas

### Bloqueadores Técnicos
1. **Autenticação (US-001, US-002)**: Bloqueia todas as outras funcionalidades
2. **Layout Base (US-044, US-045, US-046)**: Necessário para todas as páginas
3. **Categorias (US-023)**: Necessário para vincular despesas a categorias
4. **Receitas/Despesas Básicas**: Base para funcionalidades mais complexas

### Dependências Funcionais
- **Dashboard (US-003)** depende de Receitas e Despesas
- **Status de Orçamento (US-024)** depende de Categorias e Despesas
- **Simulação (US-038-043)** pode ser desenvolvida em paralelo, mas agrega mais valor após ter dados reais
- **Lista de Compras e Desejos** são independentes e podem ser desenvolvidas em paralelo

---

## Riscos Identificados

### Alto Risco
- **US-038, US-042**: Simulação com gráficos e projeções - complexidade alta
- **US-046**: Layout responsivo completo - requer testes extensivos

### Médio Risco
- **US-024**: Cálculo de orçamentos e restantes - lógica de negócio complexa
- **US-043**: Estatísticas agregadas da simulação - cálculos complexos

### Baixo Risco
- Operações CRUD básicas
- Funcionalidades de visualização simples

---

## Recomendações de Implementação

### Abordagem Incremental
1. **Fase 1 (Sprints 0-2)**: MVP funcional com valor imediato
2. **Fase 2 (Sprints 3-4)**: Completar operações CRUD e adicionar recorrentes
3. **Fase 3 (Sprint 5)**: Funcionalidade diferenciada (simulação)
4. **Fase 4 (Sprint 6)**: Funcionalidades complementares

### Decisões Técnicas Recomendadas
- Implementar autenticação JWT desde o início
- Criar componentes reutilizáveis de formulários e drawers
- Implementar sistema de categorias antes de despesas para evitar refatoração
- Considerar cache para estatísticas e cálculos agregados
- Implementar validações robustas desde o início

### Métricas de Sucesso
- **MVP**: Usuário consegue registrar e visualizar receitas/despesas básicas
- **V1.0**: Usuário consegue planejar finanças futuras com simulação
- **Qualidade**: Zero bugs críticos em produção
- **Performance**: Tempo de resposta < 2s para operações principais





