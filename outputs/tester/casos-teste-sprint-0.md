# Casos de Teste - Sprint 0: Fundação

## Sprint 0: Autenticação e Layout Base

### US-001: Login de Usuário

#### TC-001-001: Login com credenciais válidas
**Prioridade**: Crítica  
**Tipo**: Funcional  
**Pré-condições**: Usuário cadastrado no sistema

**Passos**:
1. Acessar página de login
2. Inserir email válido
3. Inserir senha correta
4. Clicar em "Entrar"

**Resultado Esperado**:
- ✅ Usuário é redirecionado para o dashboard
- ✅ Token JWT é armazenado no localStorage
- ✅ Header de autenticação é configurado
- ✅ Sessão é mantida após refresh da página

**Dados de Teste**:
- Email: `usuario@teste.com`
- Senha: `senha123456`

---

#### TC-001-002: Login com credenciais inválidas
**Prioridade**: Crítica  
**Tipo**: Funcional  

**Passos**:
1. Acessar página de login
2. Inserir email válido
3. Inserir senha incorreta
4. Clicar em "Entrar"

**Resultado Esperado**:
- ❌ Mensagem de erro é exibida: "Credenciais inválidas"
- ❌ Usuário permanece na página de login
- ❌ Token não é armazenado

**Dados de Teste**:
- Email: `usuario@teste.com`
- Senha: `senhaErrada`

---

#### TC-001-003: Login com email inválido
**Prioridade**: Alta  
**Tipo**: Validação  

**Passos**:
1. Acessar página de login
2. Inserir email inválido: `email-invalido`
3. Tentar clicar em "Entrar"

**Resultado Esperado**:
- ❌ Campo email exibe erro de validação
- ❌ Botão "Entrar" está desabilitado ou erro é exibido
- ❌ Mensagem: "Email inválido"

---

#### TC-001-004: Login com campos vazios
**Prioridade**: Alta  
**Tipo**: Validação  

**Passos**:
1. Acessar página de login
2. Deixar campos vazios
3. Tentar clicar em "Entrar"

**Resultado Esperado**:
- ❌ Campos obrigatórios são destacados
- ❌ Botão "Entrar" está desabilitado
- ❌ Mensagens de validação são exibidas

---

#### TC-001-005: Rate limiting em múltiplas tentativas
**Prioridade**: Média  
**Tipo**: Segurança  

**Passos**:
1. Tentar fazer login 5 vezes com credenciais inválidas
2. Verificar comportamento

**Resultado Esperado**:
- ✅ Após 5 tentativas, sistema bloqueia por X minutos
- ✅ Mensagem apropriada é exibida
- ✅ Log de segurança é registrado

---

#### TC-001-006: Redirecionamento para usuário autenticado
**Prioridade**: Média  
**Tipo**: Funcional  

**Pré-condições**: Usuário já está autenticado

**Passos**:
1. Estar logado no sistema
2. Tentar acessar página de login

**Resultado Esperado**:
- ✅ Usuário é redirecionado automaticamente para o dashboard
- ✅ Página de login não é exibida

---

### US-002: Cadastro de Usuário

#### TC-002-001: Cadastro com dados válidos
**Prioridade**: Crítica  
**Tipo**: Funcional  

**Passos**:
1. Acessar página de cadastro
2. Preencher nome: "João Silva"
3. Preencher email: "joao@teste.com"
4. Preencher senha: "senha123456"
5. Confirmar senha: "senha123456"
6. Clicar em "Cadastrar"

**Resultado Esperado**:
- ✅ Usuário é cadastrado com sucesso
- ✅ Mensagem de sucesso é exibida
- ✅ Redirecionamento para página de login
- ✅ Email de confirmação é enviado (se aplicável)

---

#### TC-002-002: Cadastro com email duplicado
**Prioridade**: Alta  
**Tipo**: Validação  

**Pré-condições**: Email já existe no sistema

**Passos**:
1. Acessar página de cadastro
2. Preencher dados válidos
3. Usar email existente: "usuario@teste.com"
4. Clicar em "Cadastrar"

**Resultado Esperado**:
- ❌ Mensagem de erro: "Email já cadastrado"
- ❌ Cadastro não é realizado
- ❌ Usuário permanece na página de cadastro

---

#### TC-002-003: Cadastro com senha fraca
**Prioridade**: Alta  
**Tipo**: Validação  

**Passos**:
1. Acessar página de cadastro
2. Preencher nome e email válidos
3. Preencher senha curta: "123"
4. Tentar cadastrar

**Resultado Esperado**:
- ❌ Validação impede cadastro
- ❌ Mensagem: "Senha deve ter no mínimo 8 caracteres"
- ❌ Campo senha destacado

---

#### TC-002-004: Cadastro com senhas não coincidentes
**Prioridade**: Alta  
**Tipo**: Validação  

**Passos**:
1. Acessar página de cadastro
2. Preencher senha: "senha123456"
3. Preencher confirmação: "senhaDiferente"
4. Tentar cadastrar

**Resultado Esperado**:
- ❌ Validação impede cadastro
- ❌ Mensagem: "Senhas não coincidem"
- ❌ Campo de confirmação destacado

---

#### TC-002-005: Validação de formato de email
**Prioridade**: Alta  
**Tipo**: Validação  

**Passos**:
1. Acessar página de cadastro
2. Preencher email inválido: "email-sem-arroba"
3. Tentar cadastrar

**Resultado Esperado**:
- ❌ Validação impede cadastro
- ❌ Mensagem: "Email inválido"
- ❌ Campo email destacado

---

#### TC-002-006: Sanitização de inputs
**Prioridade**: Média  
**Tipo**: Segurança  

**Passos**:
1. Tentar cadastrar com script malicioso no nome: `<script>alert('xss')</script>`
2. Verificar resultado

**Resultado Esperado**:
- ✅ Script é sanitizado/removido
- ✅ Apenas texto seguro é armazenado
- ✅ XSS é prevenido

---

### US-044: Navegação com Sidebar

#### TC-044-001: Sidebar visível após login
**Prioridade**: Alta  
**Tipo**: Funcional  

**Pré-condições**: Usuário autenticado

**Passos**:
1. Fazer login no sistema
2. Verificar presença do sidebar

**Resultado Esperado**:
- ✅ Sidebar é exibido à esquerda
- ✅ Componente shadcn/ui é utilizado
- ✅ Links para todas as páginas principais estão visíveis

---

#### TC-044-002: Navegação entre páginas via sidebar
**Prioridade**: Alta  
**Tipo**: Funcional  

**Pré-condições**: Usuário autenticado

**Passos**:
1. Clicar em "Dashboard" no sidebar
2. Clicar em "Receitas" no sidebar
3. Clicar em "Despesas" no sidebar
4. Clicar em "Categorias" no sidebar

**Resultado Esperado**:
- ✅ Navegação funciona corretamente
- ✅ Páginas são carregadas
- ✅ Link ativo é destacado visualmente
- ✅ URL é atualizada

---

#### TC-044-003: Sidebar responsivo em mobile
**Prioridade**: Alta  
**Tipo**: Responsividade  

**Passos**:
1. Abrir sistema em dispositivo mobile (< 768px)
2. Verificar comportamento do sidebar

**Resultado Esperado**:
- ✅ Sidebar é colapsado/oculto por padrão
- ✅ Botão de menu hambúrguer está presente
- ✅ Ao clicar, sidebar abre como drawer
- ✅ Fechamento funciona corretamente

---

#### TC-044-004: Highlight de página ativa
**Prioridade**: Média  
**Tipo**: UX  

**Passos**:
1. Navegar para página "Receitas"
2. Verificar highlight no sidebar

**Resultado Esperado**:
- ✅ Link "Receitas" está destacado visualmente
- ✅ Outros links não estão destacados
- ✅ Estilo segue design system shadcn

---

#### TC-044-005: Acessibilidade - Navegação por teclado
**Prioridade**: Média  
**Tipo**: Acessibilidade  

**Passos**:
1. Usar apenas teclado (Tab, Enter)
2. Navegar pelos links do sidebar

**Resultado Esperado**:
- ✅ Tab navega pelos links sequencialmente
- ✅ Enter ativa o link
- ✅ Focus visível em todos os elementos
- ✅ Navegação lógica e intuitiva

---

### US-045: Navegação com Navbar

#### TC-045-001: Navbar visível após login
**Prioridade**: Alta  
**Tipo**: Funcional  

**Pré-condições**: Usuário autenticado

**Passos**:
1. Fazer login no sistema
2. Verificar presença do navbar

**Resultado Esperado**:
- ✅ Navbar é exibido ao lado do sidebar
- ✅ Componente shadcn/ui é utilizado
- ✅ Informações do usuário estão visíveis

---

#### TC-045-002: Exibição de informações do usuário
**Prioridade**: Alta  
**Tipo**: Funcional  

**Pré-condições**: Usuário autenticado

**Passos**:
1. Verificar navbar após login
2. Localizar informações do usuário

**Resultado Esperado**:
- ✅ Nome do usuário ou email está visível
- ✅ Avatar ou ícone está presente
- ✅ Menu dropdown está disponível

---

#### TC-045-003: Menu de logout no navbar
**Prioridade**: Alta  
**Tipo**: Funcional  

**Pré-condições**: Usuário autenticado

**Passos**:
1. Clicar no menu do usuário no navbar
2. Selecionar opção "Sair"

**Resultado Esperado**:
- ✅ Usuário é deslogado
- ✅ Token é removido
- ✅ Redirecionamento para página de login
- ✅ Mensagem de logout bem-sucedido

---

#### TC-045-004: Navbar responsivo
**Prioridade**: Alta  
**Tipo**: Responsividade  

**Passos**:
1. Abrir sistema em diferentes tamanhos de tela
2. Verificar adaptação do navbar

**Resultado Esperado**:
- ✅ Navbar se adapta ao tamanho da tela
- ✅ Elementos não são cortados
- ✅ Menu funciona em mobile

---

### US-046: Layout Responsivo

#### TC-046-001: Layout em desktop (1920px)
**Prioridade**: Alta  
**Tipo**: Responsividade  

**Passos**:
1. Abrir sistema em resolução 1920x1080
2. Verificar layout completo

**Resultado Esperado**:
- ✅ Sidebar e navbar visíveis
- ✅ Conteúdo centralizado e legível
- ✅ Espaçamentos adequados
- ✅ Nenhum elemento cortado

---

#### TC-046-002: Layout em desktop (1366px)
**Prioridade**: Alta  
**Tipo**: Responsividade  

**Passos**:
1. Abrir sistema em resolução 1366x768
2. Verificar layout

**Resultado Esperado**:
- ✅ Layout se adapta corretamente
- ✅ Todos os elementos são acessíveis
- ✅ Scroll funciona quando necessário

---

#### TC-046-003: Layout em tablet (1024px)
**Prioridade**: Alta  
**Tipo**: Responsividade  

**Passos**:
1. Abrir sistema em viewport 1024px
2. Verificar comportamento

**Resultado Esperado**:
- ✅ Sidebar pode ser colapsado
- ✅ Conteúdo se reorganiza
- ✅ Elementos são tocáveis/clicáveis

---

#### TC-046-004: Layout em tablet (768px)
**Prioridade**: Alta  
**Tipo**: Responsividade  

**Passos**:
1. Abrir sistema em viewport 768px
2. Verificar comportamento

**Resultado Esperado**:
- ✅ Sidebar colapsado ou como drawer
- ✅ Navbar adaptado
- ✅ Layout mobile-friendly

---

#### TC-046-005: Layout em mobile (414px)
**Prioridade**: Alta  
**Tipo**: Responsividade  

**Passos**:
1. Abrir sistema em viewport 414px (iPhone)
2. Verificar layout mobile

**Resultado Esperado**:
- ✅ Sidebar como drawer/modal
- ✅ Navbar simplificado
- ✅ Textos legíveis sem zoom
- ✅ Botões com tamanho adequado para toque

---

#### TC-046-006: Layout em mobile (375px)
**Prioridade**: Alta  
**Tipo**: Responsividade  

**Passos**:
1. Abrir sistema em viewport 375px
2. Verificar layout

**Resultado Esperado**:
- ✅ Layout funciona sem quebras
- ✅ Todos os elementos acessíveis
- ✅ Nenhum overflow horizontal

---

#### TC-046-007: Drawers e modais responsivos
**Prioridade**: Média  
**Tipo**: Responsividade  

**Passos**:
1. Abrir drawer em mobile
2. Verificar comportamento

**Resultado Esperado**:
- ✅ Drawer ocupa largura adequada
- ✅ Fechamento funciona (swipe ou botão)
- ✅ Conteúdo não é cortado
- ✅ Scroll funciona dentro do drawer

---

#### TC-046-008: Layout em telas muito pequenas (< 320px)
**Prioridade**: Baixa  
**Tipo**: Responsividade  

**Passos**:
1. Abrir sistema em viewport < 320px
2. Verificar comportamento

**Resultado Esperado**:
- ✅ Layout não quebra
- ✅ Elementos mínimos ainda acessíveis
- ✅ Mensagem de suporte ou adaptação

---

#### TC-046-009: Layout em telas muito grandes (> 2560px)
**Prioridade**: Baixa  
**Tipo**: Responsividade  

**Passos**:
1. Abrir sistema em resolução > 2560px
2. Verificar layout

**Resultado Esperado**:
- ✅ Conteúdo não fica muito espaçado
- ✅ Largura máxima definida ou centralizada
- ✅ Legibilidade mantida

---

#### TC-046-010: Textos legíveis em todos os tamanhos
**Prioridade**: Alta  
**Tipo**: Usabilidade  

**Passos**:
1. Verificar tamanhos de fonte em diferentes dispositivos
2. Testar legibilidade

**Resultado Esperado**:
- ✅ Tamanho mínimo de fonte: 14px em mobile
- ✅ Contraste adequado (WCAG AA)
- ✅ Textos não requerem zoom

---

## Matriz de Rastreabilidade

| User Story | Casos de Teste | Prioridade | Tipo |
|-----------|----------------|------------|------|
| US-001 | TC-001-001 a TC-001-006 | Crítica/Alta/Média | Funcional/Validação/Segurança |
| US-002 | TC-002-001 a TC-002-006 | Crítica/Alta/Média | Funcional/Validação/Segurança |
| US-044 | TC-044-001 a TC-044-005 | Alta/Média | Funcional/UX/Acessibilidade |
| US-045 | TC-045-001 a TC-045-004 | Alta | Funcional/Responsividade |
| US-046 | TC-046-001 a TC-046-010 | Alta/Média/Baixa | Responsividade/Usabilidade |

## Cobertura de Testes

- **Total de Casos**: 25
- **Críticos**: 6
- **Altos**: 15
- **Médios**: 3
- **Baixos**: 1

## Automação Recomendada

- ✅ TC-001-001, TC-001-002, TC-001-003, TC-001-004 (E2E)
- ✅ TC-002-001, TC-002-002, TC-002-003, TC-002-004, TC-002-005 (E2E)
- ✅ TC-044-001, TC-044-002 (E2E)
- ✅ TC-046-001 a TC-046-006 (Visual Regression)

---

**Versão**: 1.0  
**Última Atualização**: 2024



