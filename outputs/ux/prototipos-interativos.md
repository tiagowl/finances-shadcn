# Protótipos Interativos - Sistema de Controle Financeiro

## 1. Visão Geral

Este documento descreve os protótipos interativos do sistema de controle financeiro, incluindo interações funcionais, estados da interface, transições e feedback visual. Os protótipos foram desenvolvidos considerando o design system do shadcn/ui e as necessidades identificadas na pesquisa de usuário.

### Ferramentas Recomendadas
- **Figma**: Para protótipos de alta fidelidade
- **Framer**: Para interações complexas
- **Principle**: Para animações avançadas
- **InVision**: Para testes de usabilidade

---

## 2. Princípios de Interação

### 2.1 Feedback Imediato
- Todas as ações do usuário devem ter feedback visual imediato (< 100ms)
- Estados de loading devem ser exibidos durante operações assíncronas
- Mensagens de sucesso/erro devem ser claras e não intrusivas

### 2.2 Transições Suaves
- Duração padrão de transições: 200-300ms
- Easing: ease-in-out para a maioria das transições
- Animações devem ser sutis e não distrair

### 2.3 Estados da Interface
- **Default**: Estado inicial do componente
- **Hover**: Feedback ao passar o mouse
- **Active**: Estado durante interação
- **Focus**: Estado quando focado (acessibilidade)
- **Disabled**: Estado desabilitado
- **Loading**: Estado de carregamento
- **Error**: Estado de erro
- **Success**: Estado de sucesso

---

## 3. Protótipos por Funcionalidade

### 3.1 Autenticação

#### 3.1.1 Tela de Login

**Estados:**
- **Default**: Campos vazios, botão desabilitado
- **Preenchimento**: Botão habilita quando email e senha válidos
- **Loading**: Botão mostra spinner durante autenticação
- **Erro**: Mensagem de erro abaixo do formulário
- **Sucesso**: Redirecionamento suave para dashboard

**Interações:**
- Validação em tempo real dos campos
- Feedback visual de campos inválidos (borda vermelha)
- Ícone de olho para mostrar/ocultar senha
- Link "Esqueci minha senha" (futuro)

**Transições:**
- Fade in da página: 300ms
- Validação de campo: 150ms
- Transição para dashboard: 400ms com fade

**Micro-interações:**
- Campo focado: borda azul, label sobe
- Campo inválido: shake horizontal (200ms)
- Botão hover: elevação sutil (shadow)

---

#### 3.1.2 Tela de Cadastro

**Estados:**
- Similar ao login, com campo adicional de confirmação de senha
- Validação de força da senha em tempo real
- Indicador visual de força da senha (barra de progresso)

**Interações:**
- Validação de email único (verificação assíncrona)
- Comparação de senhas em tempo real
- Feedback de força da senha (fraca/média/forte)

**Transições:**
- Mesmas do login
- Animação do indicador de força: 200ms

---

### 3.2 Dashboard

#### 3.2.1 Dashboard Principal

**Estados:**
- **Loading**: Skeleton screens para cards e lista
- **Vazio**: Mensagem amigável com call-to-action
- **Com Dados**: Cards preenchidos, lista de transações

**Interações:**
- Cards clicáveis redirecionam para páginas específicas
- Hover nos cards: elevação e sombra aumentada
- Scroll infinito ou paginação na lista de transações
- Atualização automática a cada 30 segundos (opcional)

**Transições:**
- Fade in dos cards: stagger animation (100ms entre cada)
- Scroll suave na lista
- Transição de loading para conteúdo: fade 300ms

**Micro-interações:**
- Hover no card: scale(1.02) + shadow
- Click no card: scale(0.98) + feedback tátil (se disponível)
- Badge de "novo" pisca suavemente (3x)

---

### 3.3 Gestão de Receitas

#### 3.3.1 Lista de Receitas

**Estados:**
- **Vazio**: Ilustração + mensagem + botão CTA
- **Com Dados**: Lista de receitas com ações
- **Filtro Ativo**: Badge mostrando filtro aplicado
- **Busca**: Resultados filtrados em tempo real

**Interações:**
- Scroll virtualizado para performance
- Filtro por data (dropdown)
- Busca em tempo real
- Ordenação por data/valor (toggle)
- Ações inline (editar/excluir) aparecem no hover

**Transições:**
- Abertura do drawer: slide da direita (300ms)
- Fechamento do drawer: slide para direita (250ms)
- Adição de item: fade in + slide up (300ms)
- Remoção de item: fade out + slide down (250ms)

**Micro-interações:**
- Hover no item: background highlight
- Hover no botão ação: scale(1.1)
- Confirmação de exclusão: modal com animação de scale

---

#### 3.3.2 Drawer de Criar/Editar Receita

**Estados:**
- **Aberto**: Drawer desliza da direita
- **Preenchimento**: Validação em tempo real
- **Submetendo**: Botão com spinner, campos desabilitados
- **Sucesso**: Drawer fecha, toast de sucesso
- **Erro**: Mensagem de erro, campos destacados

**Interações:**
- Foco automático no primeiro campo
- Validação em tempo real de cada campo
- Date picker com calendário visual
- Input de valor com máscara monetária
- Botão salvar desabilitado até formulário válido

**Transições:**
- Abertura: slide da direita com overlay fade (300ms)
- Fechamento: slide para direita (250ms)
- Overlay: fade in/out (200ms)
- Validação: shake no campo inválido (200ms)

**Micro-interações:**
- Campo focado: label anima para cima
- Campo inválido: borda vermelha + ícone de erro
- Campo válido: borda verde sutil
- Botão hover: elevação aumentada

---

### 3.4 Gestão de Despesas

#### 3.4.1 Lista de Despesas

**Similar à lista de receitas, com adicionais:**

**Interações Específicas:**
- Filtro por categoria (multi-select)
- Badge de categoria colorido
- Indicador visual de orçamento ultrapassado (vermelho)
- Agrupamento por categoria (opcional, toggle)

**Estados Adicionais:**
- **Orçamento Ultrapassado**: Badge vermelho + alerta
- **Próximo do Limite**: Badge amarelo (80% do orçamento)

**Micro-interações:**
- Badge de categoria: pulse sutil ao carregar
- Alerta de orçamento: shake leve (1x)

---

#### 3.4.2 Drawer de Criar/Editar Despesa

**Interações Específicas:**
- Select de categoria com busca
- Preview do orçamento da categoria selecionada
- Alerta visual se valor ultrapassar orçamento
- Sugestão de categorias baseada em histórico

**Estados Adicionais:**
- **Categoria Selecionada**: Mostra orçamento disponível
- **Orçamento Ultrapassado**: Alerta vermelho + mensagem

---

### 3.5 Gestão de Categorias

#### 3.5.1 Lista de Categorias

**Interações:**
- Cards de categoria com progresso visual (barra)
- Cores personalizadas por categoria
- Hover: mostra ações rápidas
- Click: expande detalhes da categoria

**Estados:**
- **Dentro do Orçamento**: Barra verde
- **Próximo do Limite**: Barra amarela (80-100%)
- **Ultrapassado**: Barra vermelha + ícone de alerta

**Micro-interações:**
- Barra de progresso: animação de preenchimento (500ms)
- Hover no card: elevação + shadow
- Click: expande com accordion animation (300ms)

---

### 3.6 Simulação de Gastos Futuros

#### 3.6.1 Página de Simulação

**Interações:**
- Gráfico interativo (hover mostra valores)
- Zoom e pan no gráfico
- Filtro de período (últimos 3/6/12 meses)
- Adicionar itens à simulação (drawer)
- Toggle para mostrar/ocultar séries

**Estados:**
- **Sem Dados**: Mensagem + botão para adicionar
- **Carregando**: Skeleton do gráfico
- **Com Dados**: Gráfico renderizado com animação

**Transições:**
- Renderização do gráfico: fade in (400ms)
- Atualização de dados: transição suave (300ms)
- Hover no ponto: tooltip aparece (150ms)

**Micro-interações:**
- Hover na linha do gráfico: linha destaca + tooltip
- Click no ponto: modal com detalhes
- Zoom: animação de scale (300ms)
- Legendas clicáveis: toggle série (200ms)

---

### 3.7 Lista de Compras

#### 3.7.1 Lista de Compras

**Interações:**
- Checkbox para marcar como comprado
- Drag and drop para reordenar (opcional)
- Filtro por status (todos/comprados/pendentes)
- Estatísticas atualizadas em tempo real

**Estados:**
- **Item Pendente**: Checkbox desmarcado, texto normal
- **Item Comprado**: Checkbox marcado, texto riscado, opacidade reduzida
- **Transição**: Animação suave ao marcar/desmarcar

**Transições:**
- Marcar como comprado: fade + strike-through (300ms)
- Adicionar item: slide in da direita (250ms)
- Remover item: slide out + fade (250ms)

**Micro-interações:**
- Checkbox: animação de check (200ms)
- Hover no item: background highlight
- Estatísticas: contador anima ao mudar (300ms)

---

### 3.8 Navegação

#### 3.8.1 Sidebar

**Interações:**
- Menu colapsável (mobile)
- Link ativo destacado
- Badge de notificação (futuro)
- Tooltip em ícones quando colapsado

**Estados:**
- **Expandido**: Texto + ícone visíveis
- **Colapsado**: Apenas ícones (desktop)
- **Mobile**: Drawer que desliza da esquerda

**Transições:**
- Colapsar/Expandir: width animation (300ms)
- Mobile drawer: slide da esquerda (300ms)
- Link ativo: background fade in (200ms)

**Micro-interações:**
- Hover no item: background highlight
- Click: ripple effect (opcional)
- Badge: pulse sutil

---

#### 3.8.2 Navbar

**Interações:**
- Menu do usuário (dropdown)
- Notificações (futuro)
- Busca global (futuro)
- Toggle de tema (futuro)

**Estados:**
- **Default**: Barra superior fixa
- **Scroll**: Barra com shadow (elevação)
- **Menu Aberto**: Dropdown expandido

**Transições:**
- Dropdown: fade + slide down (200ms)
- Shadow no scroll: fade in (150ms)

---

## 4. Estados Globais

### 4.1 Loading States

**Skeleton Screens:**
- Cards: retângulos com shimmer effect
- Listas: linhas com shimmer
- Gráficos: placeholder com animação

**Spinners:**
- Botões: spinner pequeno inline
- Páginas: spinner centralizado
- Overlay: spinner com overlay escuro

**Transições:**
- Shimmer: animação infinita (1.5s loop)
- Spinner: rotação contínua

---

### 4.2 Error States

**Tipos de Erro:**
- **Campo Inválido**: Borda vermelha + mensagem abaixo
- **Erro de Rede**: Toast de erro + retry button
- **Erro de Servidor**: Modal com mensagem + ações
- **404/500**: Página de erro customizada

**Feedback Visual:**
- Cores: vermelho para erro
- Ícones: ícone de alerta
- Animações: shake para erros de validação

---

### 4.3 Success States

**Feedback:**
- Toast de sucesso (canto superior direito)
- Checkmark animado
- Mensagem clara e concisa

**Transições:**
- Toast: slide in da direita (300ms)
- Auto-dismiss: fade out após 3s
- Checkmark: scale animation (200ms)

---

### 4.4 Empty States

**Componentes:**
- Ilustração ou ícone
- Título descritivo
- Mensagem explicativa
- Call-to-action (botão)

**Animações:**
- Ilustração: fade in (400ms)
- CTA: pulse sutil (opcional)

---

## 5. Responsividade

### 5.1 Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### 5.2 Adaptações por Dispositivo

**Mobile:**
- Sidebar vira drawer
- Cards em coluna única
- Drawers em fullscreen
- Botões maiores (touch targets)

**Tablet:**
- Sidebar colapsável
- Cards em 2 colunas
- Drawers em modal

**Desktop:**
- Sidebar sempre visível
- Cards em 3-4 colunas
- Drawers laterais

---

## 6. Acessibilidade

### 6.1 Navegação por Teclado

- Tab order lógico
- Focus visible em todos os elementos interativos
- Atalhos de teclado (futuro)
- Skip links para conteúdo principal

### 6.2 Screen Readers

- ARIA labels em todos os elementos
- Landmarks semânticos
- Estados anunciados (loading, error, success)
- Textos alternativos em imagens

### 6.3 Contraste e Cores

- Contraste mínimo WCAG AA
- Não depender apenas de cor para informação
- Indicadores visuais adicionais (ícones, padrões)

---

## 7. Performance

### 7.1 Otimizações de Animação

- Usar transform e opacity (GPU accelerated)
- Evitar animações em propriedades que causam reflow
- Lazy load de animações pesadas
- Reduzir animações em dispositivos lentos (prefers-reduced-motion)

### 7.2 Lazy Loading

- Componentes pesados carregados sob demanda
- Imagens com lazy loading
- Gráficos renderizados apenas quando visíveis

---

## 8. Protótipos de Alta Fidelidade

### 8.1 Ferramentas e Links

- **Figma**: [Link para protótipo no Figma]
- **Framer**: [Link para protótipo interativo]
- **InVision**: [Link para testes de usabilidade]

### 8.2 Versões

- **v1.0**: MVP - Funcionalidades core
- **v1.1**: Melhorias baseadas em testes
- **v2.0**: Funcionalidades avançadas

---

## 9. Próximos Passos

1. Implementar protótipos no Figma
2. Testes de usabilidade com protótipos
3. Iteração baseada em feedback
4. Handoff para equipe de desenvolvimento
5. Validação durante desenvolvimento

---

**Documento gerado pelo UX Designer**  
**Baseado nos requisitos do Product Owner e pesquisa de usuário**





