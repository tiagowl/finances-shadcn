# Checklist Geral de Testes - Sistema de Controle Financeiro

## Checklist Pré-Release

### Funcionalidades Críticas (MVP)

#### Autenticação
- [ ] Login funciona corretamente
- [ ] Cadastro funciona corretamente
- [ ] Logout funciona corretamente
- [ ] Sessão persiste após refresh
- [ ] Redirecionamento para usuário autenticado
- [ ] Validações de formulário funcionam
- [ ] Mensagens de erro são claras

#### Dashboard
- [ ] Saldo total calculado corretamente
- [ ] Total de receitas exibido
- [ ] Total de despesas exibido
- [ ] Lista de transações recentes funciona
- [ ] Valores formatados corretamente
- [ ] Performance adequada (< 2s)
- [ ] Atualização em tempo real

#### Receitas
- [ ] Criar receita funciona
- [ ] Editar receita funciona
- [ ] Excluir receita funciona
- [ ] Lista exibe todas as receitas
- [ ] Validações funcionam
- [ ] Dashboard atualiza

#### Despesas
- [ ] Criar despesa funciona
- [ ] Editar despesa funciona
- [ ] Excluir despesa funciona
- [ ] Vinculação com categoria funciona
- [ ] Lista exibe todas as despesas
- [ ] Validações funcionam

#### Categorias
- [ ] Criar categoria funciona
- [ ] Editar categoria funciona
- [ ] Excluir categoria funciona (com restrições)
- [ ] Lista exibe todas as categorias
- [ ] Colunas de gasto e restante funcionam
- [ ] Cards de estatísticas exibidos
- [ ] Cálculos corretos

### Funcionalidades Adicionais

#### Despesas/Receitas Mensais
- [ ] CRUD completo funciona
- [ ] Links de cancelamento funcionam
- [ ] Copiar link funciona
- [ ] Validação de dia do mês

#### Simulação
- [ ] Gráfico renderiza corretamente
- [ ] Cadastro de itens funciona
- [ ] Isolamento de dados reais
- [ ] Projeção calculada corretamente
- [ ] Estatísticas corretas

#### Desejos
- [ ] CRUD funciona
- [ ] Campo categoria funciona
- [ ] Campo valor funciona
- [ ] Botão "Comprado" funciona
- [ ] Verificação de orçamento funciona
- [ ] Criação de despesa automática

#### Lista de Compras
- [ ] CRUD funciona
- [ ] Marcar como comprado funciona
- [ ] Estatísticas corretas

## Checklist de Qualidade

### Performance
- [ ] APIs respondem em < 2s (p95)
- [ ] Frontend carrega em < 3s
- [ ] Queries de banco < 100ms (p95)
- [ ] Sem memory leaks
- [ ] Scroll suave (60 FPS)
- [ ] Lazy loading funcionando

### Segurança
- [ ] Autenticação JWT funcionando
- [ ] Isolamento de dados por usuário
- [ ] Validação de inputs (frontend e backend)
- [ ] Sanitização de dados
- [ ] Proteção contra SQL Injection
- [ ] Proteção contra XSS
- [ ] HTTPS configurado (produção)
- [ ] Rate limiting ativo

### Usabilidade
- [ ] Navegação intuitiva
- [ ] Mensagens de erro claras
- [ ] Feedback visual adequado
- [ ] Loading states implementados
- [ ] Confirmações para ações destrutivas
- [ ] Formulários bem organizados

### Responsividade
- [ ] Funciona em desktop (1920px, 1366px)
- [ ] Funciona em tablet (768px, 1024px)
- [ ] Funciona em mobile (375px, 414px)
- [ ] Sidebar responsivo
- [ ] Tabelas responsivas
- [ ] Drawers/modal responsivos
- [ ] Textos legíveis em todos os tamanhos

### Acessibilidade
- [ ] Navegação por teclado funcional
- [ ] Contraste de cores adequado (WCAG AA)
- [ ] Labels e aria-labels corretos
- [ ] Focus visível
- [ ] Screen readers compatíveis
- [ ] Semântica HTML correta

## Checklist de Código

### Frontend
- [ ] Componentes seguem padrões
- [ ] Hooks customizados quando necessário
- [ ] Estado gerenciado corretamente
- [ ] TypeScript sem erros
- [ ] Linting passa
- [ ] Código organizado e documentado

### Backend
- [ ] Clean Architecture respeitada
- [ ] Use Cases bem definidos
- [ ] Repositories implementados corretamente
- [ ] Validações com Zod
- [ ] Tratamento de erros adequado
- [ ] Logs apropriados

### Database
- [ ] Migrations funcionam
- [ ] Seeds funcionam
- [ ] Índices criados
- [ ] Foreign keys configuradas
- [ ] Constraints implementadas

## Checklist de Testes

### Cobertura
- [ ] Cobertura > 70% (geral)
- [ ] Cobertura > 90% (lógica crítica)
- [ ] Testes unitários para use cases
- [ ] Testes de integração para APIs
- [ ] Testes E2E para fluxos críticos

### Qualidade dos Testes
- [ ] Testes são independentes
- [ ] Testes são determinísticos
- [ ] Dados de teste organizados
- [ ] Mocks apropriados
- [ ] Testes documentados

## Checklist de Deploy

### Pré-Deploy
- [ ] Variáveis de ambiente configuradas
- [ ] Database migrations rodadas
- [ ] Build sem erros
- [ ] Testes passando
- [ ] Documentação atualizada

### Pós-Deploy
- [ ] Health check funcionando
- [ ] Logs sendo coletados
- [ ] Monitoramento ativo
- [ ] Backup configurado
- [ ] Rollback plan definido

## Checklist por Sprint

### Sprint 0
- [ ] Todos os casos de teste passando
- [ ] Autenticação funcionando
- [ ] Layout responsivo

### Sprint 1
- [ ] CRUD de receitas completo
- [ ] CRUD de despesas completo
- [ ] Dashboard funcionando

### Sprint 2
- [ ] Sistema de categorias completo
- [ ] Estatísticas funcionando
- [ ] Colunas de gasto e restante

### Sprint 3
- [ ] Todas as edições funcionando
- [ ] Todas as exclusões funcionando
- [ ] Recalculo de orçamentos

### Sprint 4
- [ ] Despesas mensais funcionando
- [ ] Receitas mensais funcionando
- [ ] Links funcionando

### Sprint 5
- [ ] Simulação funcionando
- [ ] Gráficos renderizando
- [ ] Projeções corretas

### Sprint 6
- [ ] Lista de desejos completa
- [ ] Lista de compras completa
- [ ] Funcionalidade especial "Comprado"

---

**Versão**: 1.0  
**Última Atualização**: 2024



