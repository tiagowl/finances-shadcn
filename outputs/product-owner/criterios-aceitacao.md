# Critérios de Aceitação - Sistema de Controle Financeiro

## Definição de Pronto (Definition of Done)

Uma user story é considerada completa quando:
- ✅ Código desenvolvido e revisado
- ✅ Testes unitários e de integração passando
- ✅ Critérios de aceitação validados
- ✅ Documentação atualizada
- ✅ Design system do shadcn aplicado corretamente
- ✅ Responsivo em dispositivos móveis e desktop
- ✅ Sem bugs críticos ou bloqueadores

---

## Critérios de Aceitação por User Story

### Autenticação e Acesso

#### US-001: Login de Usuário

**Cenários de Sucesso:**
- [ ] Usuário consegue acessar a página de login
- [ ] Usuário consegue inserir email e senha
- [ ] Sistema valida credenciais corretas e redireciona para dashboard
- [ ] Token de autenticação é armazenado corretamente
- [ ] Sessão é mantida após refresh da página

**Casos Extremos:**
- [ ] Sistema exibe mensagem de erro para credenciais inválidas
- [ ] Sistema valida formato de email
- [ ] Sistema impede login com senha vazia
- [ ] Sistema bloqueia múltiplas tentativas de login falhadas (rate limiting)
- [ ] Sistema redireciona usuário já autenticado que tenta acessar página de login

**Validações Necessárias:**
- Email deve ser válido (formato)
- Senha deve ter no mínimo 8 caracteres
- Mensagens de erro devem ser claras e não expor informações sensíveis

---

#### US-002: Cadastro de Usuário

**Cenários de Sucesso:**
- [ ] Usuário consegue acessar página de cadastro
- [ ] Usuário consegue preencher formulário com nome, email e senha
- [ ] Sistema valida dados e cria conta com sucesso
- [ ] Sistema redireciona para login após cadastro bem-sucedido
- [ ] Email de confirmação é enviado (se aplicável)

**Casos Extremos:**
- [ ] Sistema impede cadastro com email já existente
- [ ] Sistema valida força da senha (mínimo 8 caracteres, recomendado: maiúscula, minúscula, número)
- [ ] Sistema valida formato de email
- [ ] Sistema exibe mensagens de erro claras para cada campo inválido
- [ ] Sistema sanitiza inputs para prevenir SQL injection e XSS

**Validações Necessárias:**
- Nome: obrigatório, mínimo 2 caracteres
- Email: obrigatório, formato válido, único no sistema
- Senha: obrigatória, mínimo 8 caracteres
- Confirmação de senha: deve coincidir com senha

---

### Dashboard / Página Inicial

#### US-003: Visualizar Dashboard com Estatísticas

**Cenários de Sucesso:**
- [ ] Dashboard exibe saldo total calculado corretamente (receitas - despesas)
- [ ] Dashboard exibe total de receitas do período
- [ ] Dashboard exibe total de despesas do período
- [ ] Dashboard exibe lista de transações recentes (últimas 10)
- [ ] Estatísticas são atualizadas em tempo real após novas transações
- [ ] Cards do shadcn são utilizados para exibir estatísticas

**Casos Extremos:**
- [ ] Dashboard exibe valores zerados quando não há transações
- [ ] Dashboard lida corretamente com valores negativos (saldo negativo)
- [ ] Dashboard exibe mensagem quando não há transações recentes
- [ ] Dashboard carrega corretamente mesmo com grande volume de transações
- [ ] Dashboard mantém performance com cálculos agregados

**Validações Necessárias:**
- Cálculos devem ser precisos (usar biblioteca de precisão decimal para valores monetários)
- Valores devem ser formatados como moeda (R$)
- Datas devem ser formatadas de forma legível
- Performance: carregamento < 2 segundos

---

### Gestão de Receitas

#### US-004: Visualizar Lista de Receitas

**Cenários de Sucesso:**
- [ ] Lista exibe todas as receitas do usuário
- [ ] Estatística de total de receitas é exibida corretamente
- [ ] Receitas são ordenadas por data (mais recentes primeiro)
- [ ] Cada receita exibe: nome, preço, data de recebimento, observações
- [ ] Lista é paginada ou virtualizada para performance

**Casos Extremos:**
- [ ] Lista exibe mensagem quando não há receitas cadastradas
- [ ] Lista mantém performance com 1000+ receitas
- [ ] Filtros e busca funcionam corretamente (se implementados)

**Validações Necessárias:**
- Apenas receitas do usuário autenticado são exibidas
- Valores monetários formatados corretamente
- Datas formatadas de forma legível

---

#### US-005: Criar Nova Receita

**Cenários de Sucesso:**
- [ ] Botão "Adicionar Receita" abre drawer com formulário
- [ ] Usuário consegue preencher: nome, preço, data de recebimento, observações
- [ ] Sistema valida dados e salva receita com sucesso
- [ ] Drawer fecha após salvamento bem-sucedido
- [ ] Lista de receitas é atualizada automaticamente
- [ ] Dashboard é atualizado com nova receita

**Casos Extremos:**
- [ ] Sistema impede criação com nome vazio
- [ ] Sistema valida preço como número positivo
- [ ] Sistema valida data não futura (receita não pode ser futura)
- [ ] Sistema sanitiza observações para prevenir XSS
- [ ] Sistema exibe mensagem de erro clara para cada campo inválido
- [ ] Drawer pode ser fechado sem salvar (com confirmação se houver dados)

**Validações Necessárias:**
- Nome: obrigatório, mínimo 2 caracteres, máximo 100
- Preço: obrigatório, número positivo, máximo 2 casas decimais
- Data: obrigatória, formato válido, não futura
- Observações: opcional, máximo 500 caracteres

---

#### US-006: Editar Receita

**Cenários de Sucesso:**
- [ ] Botão "Editar" abre drawer com formulário pré-preenchido
- [ ] Usuário consegue modificar qualquer campo
- [ ] Sistema valida e salva alterações com sucesso
- [ ] Lista e dashboard são atualizados automaticamente

**Casos Extremos:**
- [ ] Sistema mantém dados originais se usuário cancelar edição
- [ ] Sistema valida dados da mesma forma que na criação
- [ ] Sistema impede edição de receita de outro usuário

**Validações Necessárias:**
- Mesmas validações de US-005
- Verificar permissão de edição (receita pertence ao usuário)

---

#### US-007: Excluir Receita

**Cenários de Sucesso:**
- [ ] Botão "Excluir" exibe modal de confirmação
- [ ] Usuário confirma exclusão
- [ ] Sistema remove receita com sucesso
- [ ] Lista e dashboard são atualizados automaticamente

**Casos Extremos:**
- [ ] Sistema impede exclusão acidental (requer confirmação)
- [ ] Sistema exibe mensagem de sucesso após exclusão
- [ ] Sistema impede exclusão de receita de outro usuário
- [ ] Sistema lida com erro de exclusão (ex: receita não encontrada)

**Validações Necessárias:**
- Confirmação obrigatória antes de excluir
- Verificar permissão de exclusão

---

### Gestão de Despesas

#### US-008: Visualizar Lista de Despesas

**Cenários de Sucesso:**
- [ ] Lista exibe todas as despesas do usuário
- [ ] Estatística de total de despesas é exibida
- [ ] Estatística de total por categoria é exibida
- [ ] Cada despesa exibe: nome, preço, data, categoria, observações
- [ ] Despesas são agrupadas ou filtradas por categoria (opcional)

**Casos Extremos:**
- [ ] Lista exibe mensagem quando não há despesas
- [ ] Lista mantém performance com grande volume
- [ ] Categorias sem despesas não aparecem nas estatísticas

**Validações Necessárias:**
- Apenas despesas do usuário autenticado
- Valores monetários formatados
- Categoria deve ser exibida de forma clara

---

#### US-009: Criar Nova Despesa

**Cenários de Sucesso:**
- [ ] Botão "Adicionar Despesa" abre drawer com formulário
- [ ] Usuário consegue preencher: nome, preço, data, categoria, observações
- [ ] Campo categoria permite seleção de categoria existente
- [ ] Sistema valida e salva despesa com sucesso
- [ ] Lista, dashboard e estatísticas de categoria são atualizados

**Casos Extremos:**
- [ ] Sistema impede criação sem categoria selecionada
- [ ] Sistema valida preço como número positivo
- [ ] Sistema valida data não futura
- [ ] Sistema atualiza orçamento da categoria ao criar despesa
- [ ] Sistema exibe alerta se despesa ultrapassar orçamento da categoria

**Validações Necessárias:**
- Nome: obrigatório, mínimo 2 caracteres, máximo 100
- Preço: obrigatório, número positivo, máximo 2 casas decimais
- Data: obrigatória, formato válido, não futura
- Categoria: obrigatória, deve existir no sistema
- Observações: opcional, máximo 500 caracteres

---

#### US-010: Editar Despesa

**Cenários de Sucesso:**
- [ ] Botão "Editar" abre drawer pré-preenchido
- [ ] Usuário pode alterar categoria
- [ ] Sistema recalcula orçamentos ao alterar categoria
- [ ] Alterações são salvas com sucesso

**Casos Extremos:**
- [ ] Sistema recalcula orçamentos corretamente ao mudar categoria
- [ ] Sistema atualiza estatísticas ao alterar preço
- [ ] Sistema mantém integridade dos dados

**Validações Necessárias:**
- Mesmas validações de US-009
- Recalcular orçamentos ao alterar categoria ou preço

---

#### US-011: Excluir Despesa

**Cenários de Sucesso:**
- [ ] Botão "Excluir" exibe modal de confirmação
- [ ] Sistema remove despesa e recalcula orçamentos
- [ ] Estatísticas são atualizadas automaticamente

**Casos Extremos:**
- [ ] Sistema recalcula orçamentos corretamente após exclusão
- [ ] Sistema mantém integridade dos dados

**Validações Necessárias:**
- Confirmação obrigatória
- Recalcular orçamentos após exclusão

---

### Gestão de Despesas Mensais

#### US-012: Visualizar Despesas Mensais

**Cenários de Sucesso:**
- [ ] Lista exibe todas as despesas mensais recorrentes
- [ ] Estatística de total de despesas mensais é exibida
- [ ] Cada despesa mensal exibe: nome, preço, dia do mês da cobrança

**Casos Extremos:**
- [ ] Lista exibe mensagem quando não há despesas mensais
- [ ] Despesas são ordenadas por dia do mês

**Validações Necessárias:**
- Apenas despesas mensais do usuário autenticado

---

#### US-013: Criar Despesa Mensal

**Cenários de Sucesso:**
- [ ] Botão "Adicionar Despesa Mensal" abre drawer
- [ ] Usuário preenche: nome, preço, dia do mês, link de cancelamento
- [ ] Sistema valida e salva com sucesso
- [ ] Lista é atualizada

**Casos Extremos:**
- [ ] Sistema valida dia do mês (1-31)
- [ ] Sistema valida URL do link de cancelamento (formato válido)
- [ ] Sistema permite link de cancelamento opcional

**Validações Necessárias:**
- Nome: obrigatório, mínimo 2 caracteres
- Preço: obrigatório, número positivo
- Dia do mês: obrigatório, entre 1 e 31
- Link de cancelamento: opcional, formato URL válido

---

#### US-014: Acessar Link de Cancelamento

**Cenários de Sucesso:**
- [ ] Botão abre link em nova aba
- [ ] Link é válido e acessível

**Casos Extremos:**
- [ ] Sistema valida se link existe antes de abrir
- [ ] Sistema exibe mensagem se link for inválido

**Validações Necessárias:**
- Link deve ser URL válida
- Abrir em nova aba (target="_blank")

---

#### US-015: Copiar Link de Cancelamento

**Cenários de Sucesso:**
- [ ] Botão copia link para clipboard
- [ ] Sistema exibe feedback visual de cópia bem-sucedida

**Casos Extremos:**
- [ ] Sistema lida com erro de permissão de clipboard
- [ ] Sistema exibe mensagem clara de sucesso/erro

**Validações Necessárias:**
- Feedback visual obrigatório
- Funcionar em diferentes navegadores

---

### Gestão de Receitas Mensais

#### US-018 a US-021: Receitas Mensais

**Critérios similares a US-012 a US-017**, mas para receitas:
- Mesmas validações de formato
- Não possui link de cancelamento
- Foco em dia do mês do recebimento

---

### Gestão de Categorias

#### US-022: Visualizar Categorias

**Cenários de Sucesso:**
- [ ] Lista exibe todas as categorias
- [ ] Estatísticas exibem: total de orçamentos máximos, total gasto
- [ ] Cada categoria exibe: nome, orçamento máximo, total gasto, restante

**Casos Extremos:**
- [ ] Sistema exibe mensagem quando não há categorias
- [ ] Restante pode ser negativo (orçamento ultrapassado)
- [ ] Sistema destaca visualmente categorias com orçamento ultrapassado

**Validações Necessárias:**
- Cálculos precisos de restante
- Formatação monetária correta

---

#### US-023: Criar Categoria

**Cenários de Sucesso:**
- [ ] Botão "Adicionar Categoria" abre drawer
- [ ] Usuário preenche: nome, orçamento máximo
- [ ] Sistema valida e salva com sucesso
- [ ] Lista é atualizada

**Casos Extremos:**
- [ ] Sistema impede nomes duplicados
- [ ] Sistema valida orçamento como número positivo
- [ ] Sistema permite orçamento zero (sem limite)

**Validações Necessárias:**
- Nome: obrigatório, mínimo 2 caracteres, único
- Orçamento máximo: obrigatório, número positivo ou zero

---

#### US-024: Visualizar Status de Orçamento

**Cenários de Sucesso:**
- [ ] Cada categoria exibe restante calculado corretamente
- [ ] Sistema destaca visualmente categorias próximas do limite
- [ ] Sistema destaca categorias com orçamento ultrapassado

**Casos Extremos:**
- [ ] Restante negativo é exibido corretamente
- [ ] Cálculo é atualizado em tempo real ao adicionar/remover despesas

**Validações Necessárias:**
- Cálculo: Orçamento Máximo - Total Gasto = Restante
- Atualização automática ao modificar despesas

---

### Gestão de Desejos

#### US-027 a US-032: Desejos

**Critérios similares a Receitas/Despesas**, com foco em:
- Nome e link de compra obrigatórios
- Botões para acessar e copiar link
- Validação de URL do link

---

### Lista de Compras

#### US-033: Visualizar Lista de Compras

**Cenários de Sucesso:**
- [ ] Lista exibe todos os itens
- [ ] Estatísticas exibem: total de itens, comprados, pendentes, total de despesas
- [ ] Cada item exibe: checkbox de status, nome, preço

**Casos Extremos:**
- [ ] Sistema exibe mensagem quando lista está vazia
- [ ] Itens comprados são destacados visualmente

**Validações Necessárias:**
- Cálculo correto de estatísticas
- Status persistido corretamente

---

#### US-034: Adicionar Item à Lista de Compras

**Cenários de Sucesso:**
- [ ] Botão abre drawer com formulário
- [ ] Usuário preenche: nome, preço
- [ ] Sistema salva e atualiza lista

**Validações Necessárias:**
- Nome: obrigatório, mínimo 2 caracteres
- Preço: obrigatório, número positivo

---

#### US-035: Marcar Item como Comprado

**Cenários de Sucesso:**
- [ ] Checkbox alterna status do item
- [ ] Estatísticas são atualizadas automaticamente
- [ ] Status é persistido

**Casos Extremos:**
- [ ] Sistema permite desmarcar item comprado
- [ ] Atualização é instantânea

**Validações Necessárias:**
- Persistência imediata do status
- Atualização de estatísticas em tempo real

---

### Simulação de Gastos Futuros

#### US-038: Visualizar Simulação de Gastos

**Cenários de Sucesso:**
- [ ] Página exibe gráfico com três séries: Despesas do mês, Mensalidades do crédito, Receitas do mês
- [ ] Gráfico é interativo e responsivo
- [ ] Dados são exibidos corretamente

**Casos Extremos:**
- [ ] Gráfico exibe mensagem quando não há dados
- [ ] Gráfico mantém performance com muitos dados
- [ ] Gráfico é legível em diferentes tamanhos de tela

**Validações Necessárias:**
- Biblioteca de gráficos confiável (ex: Recharts, Chart.js)
- Responsividade garantida
- Acessibilidade (cores, contraste, labels)

---

#### US-039 a US-041: Cadastrar Itens na Simulação

**Cenários de Sucesso:**
- [ ] Usuário pode cadastrar despesas, receitas e compras no crédito
- [ ] Itens são salvos apenas na simulação (não afetam dados reais)
- [ ] Gráfico é atualizado automaticamente

**Casos Extremos:**
- [ ] Sistema diferencia dados reais de dados de simulação
- [ ] Sistema permite múltiplas simulações (opcional)

**Validações Necessárias:**
- Isolamento de dados de simulação
- Validações similares às operações reais

---

#### US-042: Visualizar Projeção de Meses Futuros

**Cenários de Sucesso:**
- [ ] Gráfico exibe projeção para próximos 12 meses (configurável)
- [ ] Projeção considera itens cadastrados na simulação
- [ ] Projeção é calculada corretamente

**Casos Extremos:**
- [ ] Sistema lida com meses sem dados
- [ ] Sistema permite ajustar período de projeção
- [ ] Cálculos são precisos

**Validações Necessárias:**
- Algoritmo de projeção validado
- Performance com projeções longas
- Precisão dos cálculos

---

#### US-043: Visualizar Estatísticas da Simulação

**Cenários de Sucesso:**
- [ ] Estatísticas exibem: receitas totais, gastos de crédito, gastos totais, saldo médio
- [ ] Cálculos são precisos
- [ ] Estatísticas são atualizadas em tempo real

**Casos Extremos:**
- [ ] Sistema lida com valores zerados
- [ ] Saldo médio é calculado corretamente

**Validações Necessárias:**
- Cálculos precisos
- Formatação monetária
- Atualização automática

---

### Layout e Navegação

#### US-044: Navegação com Sidebar

**Cenários de Sucesso:**
- [ ] Sidebar do shadcn é exibido à esquerda
- [ ] Sidebar contém links para todas as páginas principais
- [ ] Sidebar é responsivo (colapsa em mobile)
- [ ] Link ativo é destacado visualmente

**Casos Extremos:**
- [ ] Sidebar funciona corretamente em diferentes tamanhos de tela
- [ ] Sidebar mantém estado ao navegar

**Validações Necessárias:**
- Componente shadcn utilizado corretamente
- Responsividade garantida
- Acessibilidade (navegação por teclado)

---

#### US-045: Navegação com Navbar

**Cenários de Sucesso:**
- [ ] Navbar do shadcn é exibido ao lado do sidebar
- [ ] Navbar contém informações do usuário e ações
- [ ] Navbar é responsivo

**Validações Necessárias:**
- Componente shadcn utilizado corretamente
- Integração com autenticação

---

#### US-046: Layout Responsivo

**Cenários de Sucesso:**
- [ ] Layout funciona em desktop (1920px, 1366px)
- [ ] Layout funciona em tablet (768px, 1024px)
- [ ] Layout funciona em mobile (375px, 414px)
- [ ] Componentes shadcn são responsivos
- [ ] Textos são legíveis em todos os tamanhos

**Casos Extremos:**
- [ ] Layout não quebra em telas muito pequenas (< 320px)
- [ ] Layout não quebra em telas muito grandes (> 2560px)
- [ ] Drawers e modais funcionam corretamente em mobile

**Validações Necessárias:**
- Testes em múltiplos dispositivos
- Breakpoints do shadcn respeitados
- Acessibilidade mantida em todos os tamanhos

---

## Critérios Gerais de Qualidade

### Performance
- Tempo de carregamento inicial < 3 segundos
- Tempo de resposta de operações < 2 segundos
- Scroll suave (60 FPS)
- Lazy loading de listas grandes

### Segurança
- Autenticação JWT segura
- Validação de inputs no frontend e backend
- Sanitização de dados
- Proteção contra XSS e SQL Injection
- HTTPS obrigatório em produção

### Acessibilidade
- Navegação por teclado funcional
- Contraste de cores adequado (WCAG AA)
- Labels e aria-labels corretos
- Screen readers compatíveis

### UX/UI
- Design system do shadcn aplicado consistentemente
- Feedback visual para todas as ações
- Mensagens de erro claras e úteis
- Loading states apropriados
- Animações suaves e não intrusivas





