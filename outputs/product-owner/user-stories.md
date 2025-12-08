# User Stories - Sistema de Controle Financeiro

## Personas Identificadas

### Persona Principal: Usuário Financeiro
- **Perfil**: Pessoa que precisa gerenciar suas finanças pessoais
- **Necessidades**: Controle de receitas, despesas, planejamento financeiro e organização de compras
- **Objetivos**: Ter visibilidade completa de sua situação financeira e tomar decisões informadas

---

## User Stories por Funcionalidade

### Autenticação e Acesso

#### US-001: Login de Usuário
**Como** usuário do sistema  
**Eu quero** fazer login com minhas credenciais  
**Para que** eu possa acessar minhas informações financeiras de forma segura

**Prioridade**: Crítica (P0)  
**Estimativa**: 3 pontos

---

#### US-002: Cadastro de Usuário
**Como** novo usuário  
**Eu quero** criar uma conta no sistema  
**Para que** eu possa começar a gerenciar minhas finanças

**Prioridade**: Crítica (P0)  
**Estimativa**: 3 pontos

---

### Dashboard / Página Inicial

#### US-003: Visualizar Dashboard com Estatísticas
**Como** usuário logado  
**Eu quero** visualizar na página inicial estatísticas de saldo total, receitas e despesas, além de uma lista de transações recentes  
**Para que** eu tenha uma visão geral rápida da minha situação financeira

**Prioridade**: Alta (P1)  
**Estimativa**: 5 pontos

---

### Gestão de Receitas

#### US-004: Visualizar Lista de Receitas
**Como** usuário  
**Eu quero** visualizar uma lista de todas as minhas receitas com estatística do total  
**Para que** eu possa acompanhar todas as minhas entradas de dinheiro

**Prioridade**: Alta (P1)  
**Estimativa**: 3 pontos

---

#### US-005: Criar Nova Receita
**Como** usuário  
**Eu quero** adicionar uma nova receita através de um formulário em drawer  
**Para que** eu possa registrar minhas entradas de dinheiro com nome, preço, data de recebimento e observações

**Prioridade**: Alta (P1)  
**Estimativa**: 5 pontos

---

#### US-006: Editar Receita
**Como** usuário  
**Eu quero** editar uma receita existente  
**Para que** eu possa corrigir informações ou atualizar valores

**Prioridade**: Média (P2)  
**Estimativa**: 3 pontos

---

#### US-007: Excluir Receita
**Como** usuário  
**Eu quero** excluir uma receita  
**Para que** eu possa remover registros incorretos ou duplicados

**Prioridade**: Média (P2)  
**Estimativa**: 2 pontos

---

### Gestão de Despesas

#### US-008: Visualizar Lista de Despesas
**Como** usuário  
**Eu quero** visualizar uma lista de todas as minhas despesas com estatísticas de total geral e por categoria  
**Para que** eu possa acompanhar todos os meus gastos e entender a distribuição por categoria

**Prioridade**: Alta (P1)  
**Estimativa**: 5 pontos

---

#### US-009: Criar Nova Despesa
**Como** usuário  
**Eu quero** adicionar uma nova despesa através de um formulário em drawer  
**Para que** eu possa registrar meus gastos com nome, preço, data, categoria e observações

**Prioridade**: Alta (P1)  
**Estimativa**: 5 pontos

---

#### US-010: Editar Despesa
**Como** usuário  
**Eu quero** editar uma despesa existente  
**Para que** eu possa corrigir informações ou atualizar valores

**Prioridade**: Média (P2)  
**Estimativa**: 3 pontos

---

#### US-011: Excluir Despesa
**Como** usuário  
**Eu quero** excluir uma despesa  
**Para que** eu possa remover registros incorretos ou duplicados

**Prioridade**: Média (P2)  
**Estimativa**: 2 pontos

---

### Gestão de Despesas Mensais

#### US-012: Visualizar Despesas Mensais
**Como** usuário  
**Eu quero** visualizar uma lista de todas as minhas despesas mensais recorrentes com estatística do total  
**Para que** eu possa acompanhar minhas assinaturas e compromissos fixos

**Prioridade**: Alta (P1)  
**Estimativa**: 3 pontos

---

#### US-013: Criar Despesa Mensal
**Como** usuário  
**Eu quero** adicionar uma nova despesa mensal através de um formulário em drawer  
**Para que** eu possa registrar assinaturas e compromissos recorrentes com nome, preço, dia do mês da cobrança e link de cancelamento

**Prioridade**: Alta (P1)  
**Estimativa**: 5 pontos

---

#### US-014: Acessar Link de Cancelamento
**Como** usuário  
**Eu quero** acessar o link de cancelamento de uma despesa mensal  
**Para que** eu possa cancelar assinaturas diretamente

**Prioridade**: Média (P2)  
**Estimativa**: 2 pontos

---

#### US-015: Copiar Link de Cancelamento
**Como** usuário  
**Eu quero** copiar o link de cancelamento de uma despesa mensal  
**Para que** eu possa compartilhar ou acessar posteriormente

**Prioridade**: Média (P2)  
**Estimativa**: 1 ponto

---

#### US-016: Editar Despesa Mensal
**Como** usuário  
**Eu quero** editar uma despesa mensal existente  
**Para que** eu possa atualizar informações como valor ou dia de cobrança

**Prioridade**: Média (P2)  
**Estimativa**: 3 pontos

---

#### US-017: Excluir Despesa Mensal
**Como** usuário  
**Eu quero** excluir uma despesa mensal  
**Para que** eu possa remover compromissos que não são mais válidos

**Prioridade**: Média (P2)  
**Estimativa**: 2 pontos

---

### Gestão de Receitas Mensais

#### US-018: Visualizar Receitas Mensais
**Como** usuário  
**Eu quero** visualizar uma lista de todas as minhas receitas mensais recorrentes com estatística do total  
**Para que** eu possa acompanhar minhas fontes de renda fixas

**Prioridade**: Alta (P1)  
**Estimativa**: 3 pontos

---

#### US-019: Criar Receita Mensal
**Como** usuário  
**Eu quero** adicionar uma nova receita mensal através de um formulário em drawer  
**Para que** eu possa registrar fontes de renda recorrentes com nome, preço e dia do mês do recebimento

**Prioridade**: Alta (P1)  
**Estimativa**: 5 pontos

---

#### US-020: Editar Receita Mensal
**Como** usuário  
**Eu quero** editar uma receita mensal existente  
**Para que** eu possa atualizar informações como valor ou dia de recebimento

**Prioridade**: Média (P2)  
**Estimativa**: 3 pontos

---

#### US-021: Excluir Receita Mensal
**Como** usuário  
**Eu quero** excluir uma receita mensal  
**Para que** eu possa remover fontes de renda que não são mais válidas

**Prioridade**: Média (P2)  
**Estimativa**: 2 pontos

---

### Gestão de Categorias

#### US-022: Visualizar Categorias
**Como** usuário  
**Eu quero** visualizar uma lista de todas as minhas categorias com estatísticas de total de orçamentos máximos, total gasto e lista de categorias  
**Para que** eu possa acompanhar meus orçamentos por categoria

**Prioridade**: Alta (P1)  
**Estimativa**: 5 pontos

---

#### US-023: Criar Categoria
**Como** usuário  
**Eu quero** adicionar uma nova categoria através de um formulário em drawer  
**Para que** eu possa organizar minhas despesas e definir orçamentos máximos por categoria

**Prioridade**: Alta (P1)  
**Estimativa**: 3 pontos

---

#### US-024: Visualizar Status de Orçamento
**Como** usuário  
**Eu quero** visualizar para cada categoria o nome, orçamento máximo, total gasto e restante do orçamento  
**Para que** eu possa controlar meus gastos e evitar ultrapassar os limites definidos

**Prioridade**: Alta (P1)  
**Estimativa**: 5 pontos

---

#### US-025: Editar Categoria
**Como** usuário  
**Eu quero** editar uma categoria existente  
**Para que** eu possa ajustar o orçamento máximo ou renomear a categoria

**Prioridade**: Média (P2)  
**Estimativa**: 3 pontos

---

#### US-026: Excluir Categoria
**Como** usuário  
**Eu quero** excluir uma categoria  
**Para que** eu possa remover categorias que não são mais utilizadas

**Prioridade**: Média (P2)  
**Estimativa**: 2 pontos

---

### Gestão de Desejos

#### US-027: Visualizar Lista de Desejos
**Como** usuário  
**Eu quero** visualizar uma lista de todos os meus desejos com estatística do total  
**Para que** eu possa acompanhar itens que desejo comprar no futuro

**Prioridade**: Média (P2)  
**Estimativa**: 3 pontos

---

#### US-028: Criar Desejo
**Como** usuário  
**Eu quero** adicionar um novo desejo através de um formulário em drawer  
**Para que** eu possa registrar itens que desejo comprar com nome e link de compra

**Prioridade**: Média (P2)  
**Estimativa**: 3 pontos

---

#### US-029: Acessar Link de Compra do Desejo
**Como** usuário  
**Eu quero** acessar o link de compra de um desejo  
**Para que** eu possa comprar o item diretamente

**Prioridade**: Média (P2)  
**Estimativa**: 1 ponto

---

#### US-030: Copiar Link de Compra do Desejo
**Como** usuário  
**Eu quero** copiar o link de compra de um desejo  
**Para que** eu possa compartilhar ou acessar posteriormente

**Prioridade**: Baixa (P3)  
**Estimativa**: 1 ponto

---

#### US-031: Editar Desejo
**Como** usuário  
**Eu quero** editar um desejo existente  
**Para que** eu possa atualizar informações como nome ou link

**Prioridade**: Baixa (P3)  
**Estimativa**: 2 pontos

---

#### US-032: Excluir Desejo
**Como** usuário  
**Eu quero** excluir um desejo  
**Para que** eu possa remover itens que não desejo mais comprar

**Prioridade**: Baixa (P3)  
**Estimativa**: 1 ponto

---

### Lista de Compras

#### US-033: Visualizar Lista de Compras
**Como** usuário  
**Eu quero** visualizar minha lista de compras com estatísticas de total de itens, itens comprados, itens pendentes e total de todas as despesas  
**Para que** eu possa acompanhar o que preciso comprar e o quanto vou gastar

**Prioridade**: Média (P2)  
**Estimativa**: 5 pontos

---

#### US-034: Adicionar Item à Lista de Compras
**Como** usuário  
**Eu quero** adicionar um novo item à lista de compras através de um formulário em drawer  
**Para que** eu possa registrar itens que preciso comprar com nome e preço

**Prioridade**: Média (P2)  
**Estimativa**: 3 pontos

---

#### US-035: Marcar Item como Comprado
**Como** usuário  
**Eu quero** marcar um item da lista como comprado através de um checkbox  
**Para que** eu possa acompanhar o progresso das minhas compras

**Prioridade**: Média (P2)  
**Estimativa**: 2 pontos

---

#### US-036: Editar Item da Lista de Compras
**Como** usuário  
**Eu quero** editar um item da lista de compras  
**Para que** eu possa atualizar nome ou preço

**Prioridade**: Baixa (P3)  
**Estimativa**: 2 pontos

---

#### US-037: Excluir Item da Lista de Compras
**Como** usuário  
**Eu quero** excluir um item da lista de compras  
**Para que** eu possa remover itens que não preciso mais comprar

**Prioridade**: Baixa (P3)  
**Estimativa**: 1 ponto

---

### Simulação de Gastos Futuros

#### US-038: Visualizar Simulação de Gastos
**Como** usuário  
**Eu quero** visualizar uma página de simulação de gastos futuros com gráfico mostrando despesas do mês, mensalidades do crédito e receitas do mês  
**Para que** eu possa planejar minhas finanças futuras e tomar decisões informadas

**Prioridade**: Alta (P1)  
**Estimativa**: 8 pontos

---

#### US-039: Cadastrar Despesas na Simulação
**Como** usuário  
**Eu quero** cadastrar despesas na simulação  
**Para que** eu possa projetar gastos futuros

**Prioridade**: Alta (P1)  
**Estimativa**: 5 pontos

---

#### US-040: Cadastrar Receitas na Simulação
**Como** usuário  
**Eu quero** cadastrar receitas na simulação  
**Para que** eu possa projetar entradas futuras

**Prioridade**: Alta (P1)  
**Estimativa**: 5 pontos

---

#### US-041: Cadastrar Compras no Crédito na Simulação
**Como** usuário  
**Eu quero** cadastrar compras no crédito na simulação  
**Para que** eu possa projetar mensalidades futuras

**Prioridade**: Alta (P1)  
**Estimativa**: 5 pontos

---

#### US-042: Visualizar Projeção de Meses Futuros
**Como** usuário  
**Eu quero** visualizar no gráfico uma projeção para os meses seguintes dos gastos referentes aos itens cadastrados  
**Para que** eu possa ter uma visão de longo prazo da minha situação financeira

**Prioridade**: Alta (P1)  
**Estimativa**: 8 pontos

---

#### US-043: Visualizar Estatísticas da Simulação
**Como** usuário  
**Eu quero** visualizar estatísticas de receitas totais, gastos de crédito, gastos totais e saldo médio na página de simulação  
**Para que** eu possa ter métricas resumidas da minha projeção financeira

**Prioridade**: Alta (P1)  
**Estimativa**: 5 pontos

---

### Layout e Navegação

#### US-044: Navegação com Sidebar
**Como** usuário logado  
**Eu quero** ter um sidebar do shadcn à esquerda em todas as páginas após o login  
**Para que** eu possa navegar facilmente entre as diferentes seções do sistema

**Prioridade**: Alta (P1)  
**Estimativa**: 5 pontos

---

#### US-045: Navegação com Navbar
**Como** usuário logado  
**Eu quero** ter um navbar do shadcn ao lado do sidebar em todas as páginas após o login  
**Para que** eu possa acessar funcionalidades adicionais e informações do usuário

**Prioridade**: Alta (P1)  
**Estimativa**: 5 pontos

---

#### US-046: Layout Responsivo
**Como** usuário  
**Eu quero** que o layout seja responsivo e inspirado no design system do shadcn  
**Para que** eu tenha uma experiência consistente e moderna em todos os dispositivos

**Prioridade**: Alta (P1)  
**Estimativa**: 8 pontos

---

## Resumo por Prioridade

### Prioridade Crítica (P0) - MVP
- US-001: Login de Usuário
- US-002: Cadastro de Usuário

### Prioridade Alta (P1) - Funcionalidades Core
- US-003: Dashboard com Estatísticas
- US-004 a US-011: Gestão de Receitas e Despesas
- US-012 a US-021: Gestão de Receitas e Despesas Mensais
- US-022 a US-026: Gestão de Categorias
- US-038 a US-043: Simulação de Gastos Futuros
- US-044 a US-046: Layout e Navegação

### Prioridade Média (P2) - Funcionalidades Importantes
- US-027 a US-032: Gestão de Desejos
- US-033 a US-037: Lista de Compras

### Prioridade Baixa (P3) - Melhorias
- Funcionalidades secundárias de edição e exclusão de desejos e lista de compras





