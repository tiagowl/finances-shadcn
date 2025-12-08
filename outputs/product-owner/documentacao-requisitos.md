# Documentação de Requisitos - Sistema de Controle Financeiro

## 1. Visão Geral do Projeto

### 1.1 Objetivo do Sistema
Desenvolver uma aplicação web completa para controle financeiro pessoal, permitindo que usuários gerenciem receitas, despesas, categorias, despesas/receitas mensais recorrentes, lista de compras, desejos e simulação de gastos futuros.

### 1.2 Escopo
- **Incluso**: Todas as funcionalidades descritas nas user stories
- **Não Incluído**: 
  - Aplicativo mobile nativo (apenas web responsivo)
  - Integração com bancos
  - Relatórios em PDF
  - Multi-moeda
  - Compartilhamento de dados entre usuários

### 1.3 Público-Alvo
- Pessoas que precisam gerenciar finanças pessoais
- Usuários que desejam planejamento financeiro
- Pessoas que buscam controle de orçamento por categoria

---

## 2. Objetivos de Negócio

### 2.1 Objetivos Principais
1. **Controle Financeiro**: Permitir registro e acompanhamento de todas as transações financeiras
2. **Organização**: Facilitar categorização e organização de despesas
3. **Planejamento**: Oferecer ferramentas de simulação e projeção financeira
4. **Visibilidade**: Fornecer dashboards e estatísticas para tomada de decisão

### 2.2 Métricas de Sucesso
- Usuários conseguem registrar 100% das transações relevantes
- Tempo médio de registro de transação < 30 segundos
- Usuários utilizam simulação de gastos para planejamento
- Taxa de retenção de usuários > 60% após 30 dias

---

## 3. Usuários-Alvo e Personas

### 3.1 Persona Principal: Usuário Financeiro

**Perfil Demográfico:**
- Idade: 25-45 anos
- Renda: Variada
- Conhecimento técnico: Básico a intermediário
- Dispositivos: Desktop e mobile

**Necessidades:**
- Controle de receitas e despesas
- Organização por categorias
- Planejamento financeiro
- Visibilidade da situação financeira

**Objetivos:**
- Ter controle total sobre finanças pessoais
- Evitar gastos desnecessários
- Planejar compras futuras
- Acompanhar orçamentos por categoria

**Dores:**
- Falta de visibilidade sobre gastos
- Dificuldade em planejar finanças futuras
- Organização manual de despesas
- Falta de controle sobre orçamentos

**Comportamento:**
- Acessa sistema diariamente ou semanalmente
- Registra transações regularmente
- Consulta estatísticas frequentemente
- Usa simulação para planejamento mensal

---

## 4. Funcionalidades Principais

### 4.1 Autenticação e Acesso
- **Login**: Autenticação com email e senha
- **Cadastro**: Criação de conta com validações
- **Sessão**: Manutenção de sessão autenticada

### 4.2 Dashboard
- **Visão Geral**: Saldo total, receitas totais, despesas totais
- **Transações Recentes**: Lista das últimas 10 transações
- **Cards Estatísticos**: Utilizando componentes shadcn

### 4.3 Gestão de Receitas
- **CRUD Completo**: Criar, visualizar, editar, excluir receitas
- **Campos**: Nome, preço, data de recebimento, observações
- **Interface**: Lista com estatísticas e drawer para formulários

### 4.4 Gestão de Despesas
- **CRUD Completo**: Criar, visualizar, editar, excluir despesas
- **Campos**: Nome, preço, data de despesa, categoria, observações
- **Estatísticas**: Total geral e por categoria
- **Interface**: Lista com estatísticas e drawer para formulários

### 4.5 Gestão de Despesas Mensais
- **CRUD Completo**: Gerenciar despesas recorrentes mensais
- **Campos**: Nome, preço, dia do mês da cobrança, link de cancelamento
- **Funcionalidades**: Acessar e copiar link de cancelamento
- **Interface**: Lista com estatísticas e drawer para formulários

### 4.6 Gestão de Receitas Mensais
- **CRUD Completo**: Gerenciar receitas recorrentes mensais
- **Campos**: Nome, preço, dia do mês do recebimento
- **Interface**: Lista com estatísticas e drawer para formulários

### 4.7 Gestão de Categorias
- **CRUD Completo**: Gerenciar categorias de despesas
- **Campos**: Nome, orçamento máximo
- **Estatísticas**: Total de orçamentos, total gasto, restante por categoria
- **Controle de Orçamento**: Visualização de status (dentro/fora do orçamento)
- **Interface**: Lista com estatísticas e drawer para formulários

### 4.8 Gestão de Desejos
- **CRUD Completo**: Gerenciar lista de desejos de compra
- **Campos**: Nome, link de compra
- **Funcionalidades**: Acessar e copiar link de compra
- **Interface**: Lista com estatísticas e drawer para formulários

### 4.9 Lista de Compras
- **CRUD Completo**: Gerenciar lista de itens a comprar
- **Campos**: Nome, preço, status (comprado/pendente)
- **Estatísticas**: Total de itens, comprados, pendentes, total de despesas
- **Interface**: Lista com checkbox de status e drawer para formulários

### 4.10 Simulação de Gastos Futuros
- **Visualização**: Gráfico com projeção de meses futuros
- **Séries do Gráfico**: 
  - Despesas do mês (soma de despesas da simulação)
  - Mensalidades do crédito
  - Receitas do mês (soma de receitas da simulação)
- **Cadastro**: Despesas, receitas e compras no crédito para simulação
- **Estatísticas**: Receitas totais, gastos de crédito, gastos totais, saldo médio
- **Projeção**: Visualização de múltiplos meses futuros

### 4.11 Layout e Navegação
- **Sidebar**: Navegação lateral usando componente shadcn
- **Navbar**: Barra de navegação superior usando componente shadcn
- **Design System**: Inspirado no shadcn/ui
- **Responsividade**: Layout adaptável para mobile, tablet e desktop

---

## 5. Restrições e Limitações

### 5.1 Restrições Técnicas

#### Frontend
- **Framework**: React 19 e seu ecossistema
- **UI Library**: shadcn/ui (usando MCP configurado no Cursor)
- **Design System**: Baseado no shadcn
- **Componentes**: Sidebar, Navbar, Card, Drawer do shadcn
- **Responsividade**: Obrigatória para todos os dispositivos

#### Backend
- **Runtime**: Node.js
- **Framework**: Fastify
- **ORM/Query Builder**: Knex.js
- **Arquitetura**: Clean Architecture, DDD (Domain-Driven Design), Repository Pattern
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL

#### Infraestrutura
- **Banco de Dados**: PostgreSQL (especificado)
- **Deploy**: A definir (não especificado nos requisitos)

### 5.2 Restrições Funcionais
- **Isolamento de Dados**: Cada usuário vê apenas seus próprios dados
- **Simulação**: Dados de simulação não afetam dados reais
- **Validações**: Todas as operações devem ser validadas
- **Segurança**: Autenticação obrigatória para acesso às funcionalidades

### 5.3 Restrições de Negócio
- **Monetização**: Não especificada nos requisitos
- **Limites**: Não há limites de uso especificados
- **Integrações**: Não há integrações externas especificadas

---

## 6. Requisitos Não-Funcionais

### 6.1 Performance
- **Tempo de Carregamento**: Página inicial < 3 segundos
- **Tempo de Resposta**: Operações CRUD < 2 segundos
- **Scroll**: 60 FPS garantido
- **Otimização**: Lazy loading para listas grandes (> 100 itens)

### 6.2 Segurança
- **Autenticação**: JWT com expiração
- **Validação**: Inputs validados no frontend e backend
- **Sanitização**: Proteção contra XSS e SQL Injection
- **HTTPS**: Obrigatório em produção
- **Rate Limiting**: Proteção contra ataques de força bruta

### 6.3 Usabilidade
- **Interface**: Intuitiva e fácil de usar
- **Feedback**: Mensagens claras para todas as ações
- **Acessibilidade**: Conformidade com WCAG AA
- **Responsividade**: Funcional em mobile, tablet e desktop

### 6.4 Confiabilidade
- **Disponibilidade**: 99% de uptime (objetivo)
- **Backup**: Backup diário do banco de dados
- **Recuperação**: Plano de recuperação de desastres
- **Logs**: Sistema de logs para debugging e auditoria

### 6.5 Manutenibilidade
- **Código**: Código limpo e bem documentado
- **Arquitetura**: Clean Architecture facilita manutenção
- **Testes**: Cobertura de testes > 70%
- **Documentação**: Documentação técnica atualizada

---

## 7. Regras de Negócio

### 7.1 Receitas
- Receitas não podem ter data futura
- Preço deve ser número positivo
- Nome é obrigatório (mínimo 2 caracteres)

### 7.2 Despesas
- Despesas devem estar vinculadas a uma categoria
- Despesas não podem ter data futura
- Preço deve ser número positivo
- Sistema deve alertar quando despesa ultrapassa orçamento da categoria

### 7.3 Categorias
- Nome de categoria deve ser único por usuário
- Orçamento máximo pode ser zero (sem limite)
- Orçamento máximo deve ser número positivo ou zero
- Cálculo de restante: Orçamento Máximo - Total Gasto

### 7.4 Despesas/Receitas Mensais
- Dia do mês deve estar entre 1 e 31
- Link de cancelamento é opcional
- Link de cancelamento deve ser URL válida

### 7.5 Lista de Compras
- Status pode ser alternado (comprado/pendente)
- Preço deve ser número positivo
- Estatísticas são calculadas em tempo real

### 7.6 Simulação
- Dados de simulação são isolados dos dados reais
- Simulação não afeta cálculos de orçamentos reais
- Projeção considera itens cadastrados na simulação
- Projeção pode ser ajustada para diferentes períodos

### 7.7 Autenticação
- Email deve ser único no sistema
- Senha deve ter no mínimo 8 caracteres
- Sessão expira após período de inatividade
- Usuário autenticado não pode acessar páginas de login/cadastro

---

## 8. Jornada do Usuário

### 8.1 Primeiro Acesso
1. Usuário acessa sistema
2. Visualiza página de cadastro
3. Preenche formulário de cadastro
4. Recebe confirmação
5. É redirecionado para login
6. Faz login
7. Visualiza dashboard vazio
8. Recebe orientações (onboarding opcional)

### 8.2 Uso Regular - Registro de Transação
1. Usuário acessa sistema (já autenticado)
2. Navega para página de Receitas ou Despesas
3. Clica em "Adicionar"
4. Drawer abre com formulário
5. Preenche dados
6. Salva transação
7. Drawer fecha
8. Lista é atualizada automaticamente
9. Dashboard é atualizado automaticamente

### 8.3 Planejamento Mensal
1. Usuário acessa página de Simulação
2. Cadastra despesas, receitas e compras no crédito
3. Visualiza gráfico com projeção
4. Analisa estatísticas
5. Toma decisões baseadas na projeção

### 8.4 Controle de Orçamento
1. Usuário cria categorias com orçamentos
2. Registra despesas vinculadas a categorias
3. Visualiza status de orçamento na página de Categorias
4. Recebe alertas quando próximo do limite
5. Ajusta comportamento baseado nos alertas

---

## 9. Dependências Técnicas

### 9.1 Frontend
- React 19
- shadcn/ui (via MCP)
- Bibliotecas de gráficos (ex: Recharts, Chart.js)
- Bibliotecas de formatação (ex: date-fns, numeral)
- Bibliotecas de validação (ex: zod, yup)

### 9.2 Backend
- Fastify
- Knex.js
- PostgreSQL driver
- JWT para autenticação
- Bibliotecas de validação
- Bibliotecas de segurança (ex: bcrypt, helmet)

### 9.3 Infraestrutura
- PostgreSQL (banco de dados)
- Servidor de aplicação (Node.js)
- Servidor web (Nginx ou similar - opcional)

---

## 10. Riscos e Mitigações

### 10.1 Riscos Técnicos

#### Risco: Complexidade da Simulação
- **Probabilidade**: Média
- **Impacto**: Alto
- **Mitigação**: 
  - Desenvolver algoritmo de projeção em etapas
  - Testes extensivos com diferentes cenários
  - Validação com usuários beta

#### Risco: Performance com Grande Volume de Dados
- **Probabilidade**: Média
- **Impacto**: Médio
- **Mitigação**:
  - Implementar paginação/virtualização
  - Otimizar queries do banco
  - Implementar cache para estatísticas

#### Risco: Integração com shadcn via MCP
- **Probabilidade**: Baixa
- **Impacto**: Médio
- **Mitigação**:
  - Testar MCP antes de começar desenvolvimento
  - Ter plano B (instalação manual do shadcn)

### 10.2 Riscos de Negócio

#### Risco: Complexidade Percebida pelo Usuário
- **Probabilidade**: Média
- **Impacto**: Alto
- **Mitigação**:
  - Design intuitivo
  - Onboarding bem estruturado
  - Documentação de usuário

#### Risco: Falta de Engajamento
- **Probabilidade**: Média
- **Impacto**: Alto
- **Mitigação**:
  - Notificações (futuro)
  - Lembretes de uso
  - Gamificação (futuro)

---

## 11. Definições e Glossário

### 11.1 Termos Técnicos
- **MVP**: Minimum Viable Product - versão mínima funcional
- **CRUD**: Create, Read, Update, Delete - operações básicas
- **DDD**: Domain-Driven Design - abordagem de design de software
- **JWT**: JSON Web Token - padrão de autenticação
- **MCP**: Model Context Protocol - protocolo para integração

### 11.2 Termos de Negócio
- **Receita**: Entrada de dinheiro
- **Despesa**: Saída de dinheiro
- **Despesa Mensal**: Despesa recorrente que ocorre todo mês
- **Receita Mensal**: Receita recorrente que ocorre todo mês
- **Categoria**: Agrupamento de despesas por tipo
- **Orçamento Máximo**: Limite de gasto definido para uma categoria
- **Simulação**: Projeção de gastos futuros sem afetar dados reais
- **Desejo**: Item que o usuário deseja comprar no futuro
- **Lista de Compras**: Lista de itens que o usuário precisa comprar

---

## 12. Anexos

### 12.1 Referências
- Documentação oficial do shadcn/ui
- Documentação do React 19
- Documentação do Fastify
- Documentação do Knex.js
- Documentação do PostgreSQL

### 12.2 Protótipos e Mockups
- (A ser desenvolvido pela equipe de UX)

### 12.3 Diagramas
- (A ser desenvolvido pela equipe de Arquitetura)

---

## Histórico de Revisões

| Data | Versão | Autor | Descrição |
|------|--------|-------|-----------|
| 2024-01-XX | 1.0 | Product Owner | Documento inicial baseado nos requisitos fornecidos |

---

**Documento gerado automaticamente pelo Product Owner**  
**Baseado nos requisitos fornecidos no template de prompt**





