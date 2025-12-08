# Design System - Sistema de Controle Financeiro

## 1. Visão Geral

Este documento apresenta o Design System completo do Sistema de Controle Financeiro, baseado no shadcn/ui e adaptado para as necessidades específicas do projeto. O design system garante consistência visual, facilita manutenção e acelera desenvolvimento.

### Princípios Fundamentais
- **Consistência**: Componentes reutilizáveis e padronizados
- **Acessibilidade**: Conformidade com WCAG AA
- **Flexibilidade**: Customizável mas mantendo padrões
- **Performance**: Componentes otimizados
- **Documentação**: Guias claros de uso

---

## 2. Tokens de Design

### 2.1 Cores

#### Paleta Primária

```css
/* Cores Principais */
--primary: 222.2 47.4% 11.2%;        /* Azul escuro */
--primary-foreground: 210 40% 98%;

/* Cores Secundárias */
--secondary: 210 40% 96.1%;
--secondary-foreground: 222.2 47.4% 11.2%;

/* Cores de Destaque */
--accent: 210 40% 96.1%;
--accent-foreground: 222.2 47.4% 11.2%;

/* Cores Destrutivas */
--destructive: 0 84.2% 60.2%;
--destructive-foreground: 210 40% 98%;

/* Cores de Sucesso */
--success: 142.1 76.2% 36.3%;
--success-foreground: 210 40% 98%;

/* Cores de Aviso */
--warning: 38 92% 50%;
--warning-foreground: 222.2 47.4% 11.2%;

/* Cores de Informação */
--info: 199 89% 48%;
--info-foreground: 210 40% 98%;
```

#### Paleta Semântica para Finanças

```css
/* Receitas */
--revenue: 142.1 76.2% 36.3%;         /* Verde */
--revenue-foreground: 210 40% 98%;

/* Despesas */
--expense: 0 84.2% 60.2%;             /* Vermelho */
--expense-foreground: 210 40% 98%;

/* Saldo Positivo */
--balance-positive: 142.1 76.2% 36.3%;

/* Saldo Negativo */
--balance-negative: 0 84.2% 60.2%;

/* Orçamento Dentro do Limite */
--budget-ok: 142.1 76.2% 36.3%;

/* Orçamento Próximo do Limite (80-100%) */
--budget-warning: 38 92% 50%;        /* Amarelo */

/* Orçamento Ultrapassado */
--budget-exceeded: 0 84.2% 60.2%;    /* Vermelho */
```

#### Cores de Fundo

```css
--background: 0 0% 100%;
--foreground: 222.2 47.4% 11.2%;

--card: 0 0% 100%;
--card-foreground: 222.2 47.4% 11.2%;

--popover: 0 0% 100%;
--popover-foreground: 222.2 47.4% 11.2%;

--muted: 210 40% 96.1%;
--muted-foreground: 215.4 16.3% 46.9%;

--border: 214.3 31.8% 91.4%;
--input: 214.3 31.8% 91.4%;
--ring: 222.2 47.4% 11.2%;
```

#### Modo Escuro (Futuro)

```css
[data-theme="dark"] {
  --background: 222.2 47.4% 11.2%;
  --foreground: 210 40% 98%;
  /* ... outras cores adaptadas */
}
```

---

### 2.2 Tipografia

#### Família de Fontes

```css
/* Fonte Principal - Inter (Google Fonts) */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Fonte Monoespaçada - Para valores monetários */
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
```

#### Escala Tipográfica

```css
/* Títulos */
--text-4xl: 2.25rem;    /* 36px - Títulos principais */
--text-3xl: 1.875rem;   /* 30px - Títulos de seção */
--text-2xl: 1.5rem;     /* 24px - Títulos de card */
--text-xl: 1.25rem;     /* 20px - Subtítulos */
--text-lg: 1.125rem;    /* 18px - Texto destacado */

/* Corpo */
--text-base: 1rem;      /* 16px - Texto padrão */
--text-sm: 0.875rem;    /* 14px - Texto secundário */
--text-xs: 0.75rem;     /* 12px - Labels, captions */

/* Pesos */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

#### Uso por Contexto

- **Títulos de Página**: text-3xl, font-bold
- **Títulos de Card**: text-2xl, font-semibold
- **Valores Monetários**: text-2xl, font-bold, font-mono
- **Labels de Formulário**: text-sm, font-medium
- **Corpo de Texto**: text-base, font-normal
- **Texto Secundário**: text-sm, font-normal, muted-foreground

---

### 2.3 Espaçamento

#### Escala de Espaçamento (8px base)

```css
--space-0: 0;
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.25rem;    /* 20px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
```

#### Aplicação

- **Padding de Cards**: space-6
- **Gap entre Elementos**: space-4
- **Margin de Seções**: space-8
- **Padding de Botões**: space-3 space-6
- **Padding de Inputs**: space-3 space-4

---

### 2.4 Bordas e Raios

```css
--radius-none: 0;
--radius-sm: 0.125rem;    /* 2px */
--radius-md: 0.375rem;    /* 6px */
--radius-lg: 0.5rem;      /* 8px */
--radius-xl: 0.75rem;     /* 12px */
--radius-2xl: 1rem;       /* 16px */
--radius-full: 9999px;
```

#### Uso

- **Cards**: radius-lg
- **Botões**: radius-md
- **Inputs**: radius-md
- **Badges**: radius-full
- **Modais**: radius-xl

---

### 2.5 Sombras

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

#### Uso

- **Cards**: shadow-md
- **Cards Hover**: shadow-lg
- **Modais**: shadow-2xl
- **Dropdowns**: shadow-lg

---

### 2.6 Transições e Animações

```css
/* Durações */
--duration-fast: 150ms;
--duration-base: 200ms;
--duration-slow: 300ms;
--duration-slower: 500ms;

/* Easing */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);

/* Aplicação */
transition: all var(--duration-base) var(--ease-in-out);
```

---

## 3. Componentes Base

### 3.1 Botões

#### Variantes

```tsx
// Primário
<Button variant="default">Salvar</Button>

// Secundário
<Button variant="secondary">Cancelar</Button>

// Outline
<Button variant="outline">Editar</Button>

// Ghost
<Button variant="ghost">Ver Mais</Button>

// Destrutivo
<Button variant="destructive">Excluir</Button>

// Link
<Button variant="link">Saiba Mais</Button>
```

#### Tamanhos

- **sm**: height 36px, padding 8px 16px
- **md**: height 40px, padding 12px 24px (padrão)
- **lg**: height 44px, padding 14px 28px
- **icon**: height 40px, width 40px (botões apenas com ícone)

#### Estados

- Default, Hover, Active, Focus, Disabled, Loading

---

### 3.2 Inputs

#### Tipos

```tsx
// Texto
<Input type="text" placeholder="Nome" />

// Email
<Input type="email" placeholder="email@exemplo.com" />

// Número (monetário)
<Input type="number" placeholder="0,00" />

// Data
<Input type="date" />

// Textarea
<Textarea placeholder="Observações" />
```

#### Estados

- Default, Focus, Error, Disabled, Readonly

#### Validação Visual

- **Válido**: Borda verde sutil
- **Inválido**: Borda vermelha + ícone de erro + mensagem
- **Focado**: Borda azul + shadow

---

### 3.3 Cards

#### Estrutura

```tsx
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descrição</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Conteúdo */}
  </CardContent>
  <CardFooter>
    {/* Ações */}
  </CardFooter>
</Card>
```

#### Variantes

- **Default**: Card padrão com shadow
- **Statistic**: Card para estatísticas (sem padding interno)
- **Interactive**: Card clicável com hover effect

---

### 3.4 Badges

#### Variantes

```tsx
<Badge variant="default">Padrão</Badge>
<Badge variant="secondary">Secundário</Badge>
<Badge variant="destructive">Erro</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="success">Sucesso</Badge>
<Badge variant="warning">Aviso</Badge>
```

#### Uso Contextual

- **Status**: Verde (ativo), Amarelo (pendente), Vermelho (erro)
- **Categorias**: Cores personalizadas
- **Orçamento**: Verde (OK), Amarelo (Atenção), Vermelho (Ultrapassado)

---

### 3.5 Alerts

```tsx
<Alert variant="default">
  <AlertTitle>Informação</AlertTitle>
  <AlertDescription>Mensagem aqui</AlertDescription>
</Alert>

// Variantes: default, destructive, success, warning
```

---

### 3.6 Toasts

```tsx
// Sucesso
toast.success("Receita criada com sucesso!");

// Erro
toast.error("Erro ao salvar despesa");

// Info
toast.info("Orçamento próximo do limite");

// Warning
toast.warning("Atenção: valor alto");
```

**Posicionamento**: Top-right por padrão  
**Duração**: 3 segundos (configurável)  
**Animação**: Slide in da direita, fade out

---

## 4. Componentes Compostos

### 4.1 Formulários

#### Estrutura Padrão

```tsx
<Form>
  <FormField>
    <FormLabel>Nome</FormLabel>
    <FormControl>
      <Input />
    </FormControl>
    <FormDescription>Descrição do campo</FormDescription>
    <FormMessage>Mensagem de erro</FormMessage>
  </FormField>
</Form>
```

#### Validação

- Validação em tempo real
- Mensagens de erro claras
- Ícones de validação (check/error)

---

### 4.2 Drawers

#### Estrutura

```tsx
<Drawer>
  <DrawerTrigger>Abrir</DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Título</DrawerTitle>
      <DrawerDescription>Descrição</DrawerDescription>
    </DrawerHeader>
    <DrawerBody>
      {/* Conteúdo do formulário */}
    </DrawerBody>
    <DrawerFooter>
      <Button>Salvar</Button>
      <DrawerClose>
        <Button variant="outline">Cancelar</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

**Comportamento:**
- Abre da direita (desktop) ou bottom (mobile)
- Overlay escuro com fade
- Fecha ao clicar fora ou pressionar ESC

---

### 4.3 Modais

```tsx
<Dialog>
  <DialogTrigger>Abrir</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Título</DialogTitle>
      <DialogDescription>Descrição</DialogDescription>
    </DialogHeader>
    {/* Conteúdo */}
    <DialogFooter>
      <Button>Confirmar</Button>
      <DialogClose>
        <Button variant="outline">Cancelar</Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Uso**: Confirmações, avisos importantes

---

### 4.4 Tabelas/Listas

#### Estrutura

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Coluna 1</TableHead>
      <TableHead>Coluna 2</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Dado 1</TableCell>
      <TableCell>Dado 2</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

#### Estados de Linha

- Default, Hover, Selected, Disabled

---

### 4.5 Sidebar

```tsx
<Sidebar>
  <SidebarHeader>
    <SidebarBrand>Logo</SidebarBrand>
  </SidebarHeader>
  <SidebarContent>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton>
          <Icon />
          <span>Item</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarContent>
</Sidebar>
```

**Comportamento:**
- Colapsável (desktop)
- Drawer em mobile
- Item ativo destacado

---

## 5. Componentes Específicos do Domínio

### 5.1 Card de Estatística

```tsx
<StatCard
  title="Saldo Total"
  value="R$ 5.000,00"
  trend="+10%"
  trendDirection="up"
  icon={<DollarSign />}
/>
```

**Variantes:**
- Revenue (verde)
- Expense (vermelho)
- Balance (azul/verde/vermelho conforme valor)
- Warning (amarelo)

---

### 5.2 Card de Categoria

```tsx
<CategoryCard
  name="Alimentação"
  budget={1000}
  spent={750}
  remaining={250}
  color="#3b82f6"
/>
```

**Estados Visuais:**
- Barra de progresso colorida
- Badge de status (OK/Atenção/Ultrapassado)
- Indicador visual de porcentagem

---

### 5.3 Item de Transação

```tsx
<TransactionItem
  name="Salário"
  amount={5000}
  date="2024-01-15"
  type="revenue"
  category="Renda"
  onEdit={() => {}}
  onDelete={() => {}}
/>
```

**Estados:**
- Default, Hover (mostra ações), Selected

---

### 5.4 Gráfico de Simulação

```tsx
<SimulationChart
  data={simulationData}
  series={['receitas', 'despesas', 'credito']}
  period="12 meses"
/>
```

**Interações:**
- Hover mostra tooltip
- Click mostra detalhes
- Zoom e pan
- Toggle de séries

---

## 6. Layout

### 6.1 Grid System

```css
/* Container */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Grid */
.grid {
  display: grid;
  gap: 1.5rem;
}

/* Colunas */
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
```

### 6.2 Breakpoints

```css
/* Mobile First */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

---

## 7. Ícones

### 7.1 Biblioteca

- **Lucide React**: Biblioteca principal de ícones
- Consistência visual
- Tamanhos padronizados: 16px, 20px, 24px

### 7.2 Ícones por Contexto

- **Financeiro**: DollarSign, TrendingUp, TrendingDown, Wallet
- **Ações**: Plus, Edit, Trash, Check, X
- **Navegação**: Home, Receipt, CreditCard, ShoppingCart
- **Status**: CheckCircle, AlertCircle, Info, XCircle

---

## 8. Acessibilidade

### 8.1 Requisitos

- **Contraste**: Mínimo WCAG AA (4.5:1 para texto)
- **Focus**: Visible em todos os elementos interativos
- **ARIA**: Labels e roles apropriados
- **Teclado**: Navegação completa por teclado
- **Screen Readers**: Textos alternativos e landmarks

### 8.2 Implementação

```tsx
// Exemplo: Botão acessível
<Button
  aria-label="Adicionar receita"
  aria-describedby="receita-description"
>
  <Plus aria-hidden="true" />
  Adicionar
</Button>
```

---

## 9. Responsividade

### 9.1 Estratégia Mobile First

- Design pensado primeiro para mobile
- Progressive enhancement para desktop
- Breakpoints bem definidos
- Touch targets mínimos: 44x44px

### 9.2 Adaptações por Dispositivo

**Mobile:**
- Sidebar vira drawer
- Cards em coluna única
- Botões maiores
- Drawers fullscreen

**Tablet:**
- Sidebar colapsável
- Cards em 2 colunas
- Drawers em modal

**Desktop:**
- Sidebar sempre visível
- Cards em 3-4 colunas
- Drawers laterais

---

## 10. Performance

### 10.1 Otimizações

- Lazy loading de componentes pesados
- Code splitting
- Otimização de imagens
- CSS crítico inline

### 10.2 Animações

- Usar transform e opacity (GPU)
- Evitar animações pesadas
- Respeitar prefers-reduced-motion

---

## 11. Documentação de Componentes

### 11.1 Template de Documentação

Para cada componente:

1. **Descrição**: O que é e quando usar
2. **Props**: Todas as propriedades
3. **Exemplos**: Código e visual
4. **Variantes**: Diferentes estilos
5. **Estados**: Todos os estados possíveis
6. **Acessibilidade**: Considerações
7. **Responsividade**: Comportamento em diferentes telas

---

## 12. Ferramentas e Recursos

### 12.1 Storybook

- Documentação interativa
- Testes de componentes
- Visual regression testing

### 12.2 Figma

- Design tokens sincronizados
- Componentes no Figma
- Handoff para desenvolvimento

---

## 13. Guia de Uso

### 13.1 Quando Criar Novo Componente

- Componente será reutilizado em 3+ lugares
- Tem lógica específica do domínio
- Precisa de customização além do shadcn

### 13.2 Quando Usar Componente Existente

- Sempre que possível, usar componentes do shadcn
- Customizar via props, não criar novo
- Manter consistência visual

---

## 14. Manutenção

### 14.1 Versionamento

- Seguir semantic versioning
- Changelog de mudanças
- Breaking changes documentados

### 14.2 Atualizações

- Revisão trimestral
- Atualização de dependências
- Feedback da equipe

---

**Design System baseado em shadcn/ui**  
**Adaptado para Sistema de Controle Financeiro**  
**Versão 1.0**





