# Casos de Teste - Sprint 1: Core Financeiro

## Sprint 1: Gestão Básica de Receitas e Despesas

### US-004: Visualizar Lista de Receitas

#### TC-004-001: Lista exibe todas as receitas do usuário
**Prioridade**: Alta  
**Tipo**: Funcional  

**Pré-condições**: 
- Usuário autenticado
- Usuário possui receitas cadastradas

**Passos**:
1. Fazer login
2. Navegar para página "Receitas"

**Resultado Esperado**:
- ✅ Todas as receitas do usuário são exibidas
- ✅ Apenas receitas do usuário logado aparecem
- ✅ Lista está ordenada por data (mais recentes primeiro)

---

#### TC-004-002: Exibição de estatística de total de receitas
**Prioridade**: Alta  
**Tipo**: Funcional  

**Pré-condições**: Usuário possui receitas

**Passos**:
1. Acessar página de Receitas
2. Verificar card de estatística

**Resultado Esperado**:
- ✅ Card exibe total de receitas formatado (R$)
- ✅ Valor calculado corretamente
- ✅ Atualização em tempo real ao adicionar/remover

---

#### TC-004-003: Lista vazia - mensagem apropriada
**Prioridade**: Média  
**Tipo**: UX  

**Pré-condições**: Usuário não possui receitas

**Passos**:
1. Fazer login com usuário sem receitas
2. Acessar página de Receitas

**Resultado Esperado**:
- ✅ Mensagem: "Nenhuma receita cadastrada"
- ✅ Botão "Adicionar Receita" está visível
- ✅ Interface não quebra

---

#### TC-004-004: Formatação de valores monetários
**Prioridade**: Alta  
**Tipo**: Funcional  

**Pré-condições**: Receitas com diferentes valores

**Passos**:
1. Acessar página com receitas de R$ 10,50, R$ 1.000,00, R$ 0,50
2. Verificar formatação

**Resultado Esperado**:
- ✅ Valores formatados como R$ X.XXX,XX
- ✅ Separador de milhares correto
- ✅ Duas casas decimais sempre

---

#### TC-004-005: Formatação de datas
**Prioridade**: Média  
**Tipo**: Funcional  

**Passos**:
1. Visualizar receitas com diferentes datas
2. Verificar formatação

**Resultado Esperado**:
- ✅ Datas no formato brasileiro: DD/MM/AAAA
- ✅ Datas legíveis e consistentes

---

#### TC-004-006: Performance com grande volume de receitas
**Prioridade**: Média  
**Tipo**: Performance  

**Pré-condições**: 1000+ receitas cadastradas

**Passos**:
1. Acessar página com 1000+ receitas
2. Medir tempo de carregamento

**Resultado Esperado**:
- ✅ Carregamento < 3 segundos
- ✅ Paginação ou virtualização implementada
- ✅ Scroll suave (60 FPS)

---

### US-005: Criar Nova Receita

#### TC-005-001: Criar receita com dados válidos
**Prioridade**: Crítica  
**Tipo**: Funcional  

**Passos**:
1. Clicar em "Adicionar Receita"
2. Preencher nome: "Salário"
3. Preencher valor: 5000.00
4. Selecionar data: hoje
5. Preencher observações: "Salário do mês"
6. Clicar em "Salvar"

**Resultado Esperado**:
- ✅ Receita é criada com sucesso
- ✅ Drawer fecha automaticamente
- ✅ Lista é atualizada
- ✅ Dashboard é atualizado
- ✅ Toast de sucesso é exibido

---

#### TC-005-002: Validação - nome vazio
**Prioridade**: Alta  
**Tipo**: Validação  

**Passos**:
1. Abrir drawer de nova receita
2. Deixar nome vazio
3. Tentar salvar

**Resultado Esperado**:
- ❌ Validação impede salvamento
- ❌ Mensagem: "Nome é obrigatório"
- ❌ Campo destacado

---

#### TC-005-003: Validação - nome muito curto
**Prioridade**: Alta  
**Tipo**: Validação  

**Passos**:
1. Preencher nome com 1 caractere: "A"
2. Tentar salvar

**Resultado Esperado**:
- ❌ Mensagem: "Nome deve ter no mínimo 2 caracteres"

---

#### TC-005-004: Validação - nome muito longo
**Prioridade**: Média  
**Tipo**: Validação  

**Passos**:
1. Preencher nome com 101 caracteres
2. Tentar salvar

**Resultado Esperado**:
- ❌ Mensagem: "Nome deve ter no máximo 100 caracteres"

---

#### TC-005-005: Validação - valor negativo
**Prioridade**: Alta  
**Tipo**: Validação  

**Passos**:
1. Preencher valor: -100
2. Tentar salvar

**Resultado Esperado**:
- ❌ Mensagem: "Valor deve ser positivo"

---

#### TC-005-006: Validação - valor zero
**Prioridade**: Média  
**Tipo**: Validação  

**Passos**:
1. Preencher valor: 0
2. Tentar salvar

**Resultado Esperado**:
- ❌ Mensagem: "Valor deve ser positivo"

---

#### TC-005-007: Validação - valor muito alto
**Prioridade**: Média  
**Tipo**: Validação  

**Passos**:
1. Preencher valor: 1000000.00 (acima do máximo)
2. Tentar salvar

**Resultado Esperado**:
- ❌ Mensagem: "Valor muito alto"

---

#### TC-005-008: Validação - data futura
**Prioridade**: Alta  
**Tipo**: Validação  

**Passos**:
1. Selecionar data: amanhã
2. Tentar salvar

**Resultado Esperado**:
- ❌ Mensagem: "Data não pode ser futura"

---

#### TC-005-009: Validação - observações muito longas
**Prioridade**: Baixa  
**Tipo**: Validação  

**Passos**:
1. Preencher observações com 501 caracteres
2. Tentar salvar

**Resultado Esperado**:
- ❌ Mensagem: "Observações devem ter no máximo 500 caracteres"

---

#### TC-005-010: Criar receita sem observações
**Prioridade**: Média  
**Tipo**: Funcional  

**Passos**:
1. Preencher apenas campos obrigatórios
2. Deixar observações vazio
3. Salvar

**Resultado Esperado**:
- ✅ Receita é criada com sucesso
- ✅ Observações é null no banco

---

#### TC-005-011: Sanitização de inputs (XSS)
**Prioridade**: Média  
**Tipo**: Segurança  

**Passos**:
1. Tentar criar receita com script: `<script>alert('xss')</script>`
2. Verificar armazenamento

**Resultado Esperado**:
- ✅ Script é sanitizado
- ✅ Apenas texto seguro é armazenado

---

### US-008: Visualizar Lista de Despesas

#### TC-008-001: Lista exibe todas as despesas
**Prioridade**: Alta  
**Tipo**: Funcional  

**Pré-condições**: Usuário possui despesas

**Passos**:
1. Acessar página de Despesas

**Resultado Esperado**:
- ✅ Todas as despesas do usuário são exibidas
- ✅ Ordenadas por data (mais recentes primeiro)
- ✅ Apenas despesas do usuário logado

---

#### TC-008-002: Exibição de estatística de total
**Prioridade**: Alta  
**Tipo**: Funcional  

**Passos**:
1. Verificar card de estatística

**Resultado Esperado**:
- ✅ Total geral exibido corretamente
- ✅ Formatação monetária correta

---

#### TC-008-003: Exibição de total por categoria
**Prioridade**: Alta  
**Tipo**: Funcional  

**Pré-condições**: Despesas em múltiplas categorias

**Passos**:
1. Visualizar estatísticas por categoria

**Resultado Esperado**:
- ✅ Totais por categoria calculados corretamente
- ✅ Categorias sem despesas não aparecem
- ✅ Formatação correta

---

#### TC-008-004: Lista vazia
**Prioridade**: Média  
**Tipo**: UX  

**Passos**:
1. Acessar página sem despesas

**Resultado Esperado**:
- ✅ Mensagem apropriada
- ✅ Botão de adicionar visível

---

### US-009: Criar Nova Despesa

#### TC-009-001: Criar despesa com dados válidos
**Prioridade**: Crítica  
**Tipo**: Funcional  

**Pré-condições**: Categoria existente

**Passos**:
1. Clicar em "Adicionar Despesa"
2. Preencher nome: "Supermercado"
3. Preencher valor: 500.00
4. Selecionar categoria
5. Selecionar data: hoje
6. Salvar

**Resultado Esperado**:
- ✅ Despesa criada com sucesso
- ✅ Lista atualizada
- ✅ Dashboard atualizado
- ✅ Estatísticas de categoria atualizadas

---

#### TC-009-002: Validação - categoria obrigatória
**Prioridade**: Alta  
**Tipo**: Validação  

**Passos**:
1. Preencher todos os campos exceto categoria
2. Tentar salvar

**Resultado Esperado**:
- ❌ Mensagem: "Categoria é obrigatória"
- ❌ Campo destacado

---

#### TC-009-003: Validação - categoria inexistente
**Prioridade**: Alta  
**Tipo**: Validação/Segurança  

**Passos**:
1. Tentar criar despesa com ID de categoria inválido (via API)

**Resultado Esperado**:
- ❌ Erro 404: "Categoria não encontrada"
- ❌ Despesa não é criada

---

#### TC-009-004: Alerta ao ultrapassar orçamento
**Prioridade**: Média  
**Tipo**: Funcional  

**Pré-condições**: 
- Categoria com orçamento de R$ 1000
- Já gasto R$ 950

**Passos**:
1. Criar despesa de R$ 100

**Resultado Esperado**:
- ⚠️ Alerta é exibido (opcional)
- ✅ Despesa é criada mesmo assim
- ✅ Informação sobre ultrapassagem

---

### US-003: Dashboard com Estatísticas

#### TC-003-001: Cálculo correto do saldo total
**Prioridade**: Crítica  
**Tipo**: Funcional  

**Pré-condições**: Receitas e despesas cadastradas

**Passos**:
1. Acessar dashboard
2. Verificar saldo total

**Resultado Esperado**:
- ✅ Saldo = Receitas - Despesas
- ✅ Cálculo preciso (sem erro de ponto flutuante)
- ✅ Formatação monetária correta

---

#### TC-003-002: Saldo negativo exibido corretamente
**Prioridade**: Alta  
**Tipo**: Funcional  

**Pré-condições**: Despesas > Receitas

**Passos**:
1. Criar despesa maior que receitas
2. Verificar dashboard

**Resultado Esperado**:
- ✅ Saldo negativo é exibido
- ✅ Destaque visual apropriado (vermelho)
- ✅ Valor correto

---

#### TC-003-003: Exibição de total de receitas
**Prioridade**: Alta  
**Tipo**: Funcional  

**Passos**:
1. Verificar card de receitas

**Resultado Esperado**:
- ✅ Total correto
- ✅ Formatação R$
- ✅ Ícone apropriado (TrendingUp)

---

#### TC-003-004: Exibição de total de despesas
**Prioridade**: Alta  
**Tipo**: Funcional  

**Passos**:
1. Verificar card de despesas

**Resultado Esperado**:
- ✅ Total correto
- ✅ Formatação R$
- ✅ Ícone apropriado (TrendingDown)
- ✅ Cor apropriada (text-expense)

---

#### TC-003-005: Lista de transações recentes
**Prioridade**: Alta  
**Tipo**: Funcional  

**Passos**:
1. Verificar seção de transações recentes

**Resultado Esperado**:
- ✅ Últimas 10 transações são exibidas
- ✅ Ordenadas por data (mais recentes primeiro)
- ✅ Mix de receitas e despesas
- ✅ Informações completas (nome, valor, data)

---

#### TC-003-006: Mensagem quando não há transações
**Prioridade**: Média  
**Tipo**: UX  

**Passos**:
1. Acessar dashboard sem transações

**Resultado Esperado**:
- ✅ Mensagem: "Nenhuma transação recente"
- ✅ Cards de estatísticas com valor 0
- ✅ Interface não quebra

---

#### TC-003-007: Atualização em tempo real
**Prioridade**: Alta  
**Tipo**: Funcional  

**Passos**:
1. Abrir dashboard
2. Em outra aba, criar receita
3. Voltar para dashboard
4. Recarregar

**Resultado Esperado**:
- ✅ Estatísticas atualizadas
- ✅ Nova transação aparece na lista

---

#### TC-003-008: Performance do dashboard
**Prioridade**: Média  
**Tipo**: Performance  

**Pré-condições**: Grande volume de transações

**Passos**:
1. Acessar dashboard com 10000+ transações
2. Medir tempo de carregamento

**Resultado Esperado**:
- ✅ Carregamento < 2 segundos
- ✅ Cálculos otimizados (agregação no banco)
- ✅ Sem travamentos

---

#### TC-003-009: Precisão de cálculos
**Prioridade**: Crítica  
**Tipo**: Funcional  

**Passos**:
1. Criar receitas: 10.50, 20.30, 15.25
2. Criar despesas: 5.75, 12.80
3. Verificar cálculos

**Resultado Esperado**:
- ✅ Soma precisa: 46.05 (receitas), 18.55 (despesas)
- ✅ Sem erros de arredondamento
- ✅ Saldo: 27.50

---

## Matriz de Rastreabilidade

| User Story | Casos de Teste | Prioridade | Tipo |
|-----------|----------------|------------|------|
| US-004 | TC-004-001 a TC-004-006 | Alta/Média | Funcional/Performance |
| US-005 | TC-005-001 a TC-005-011 | Crítica/Alta/Média | Funcional/Validação/Segurança |
| US-008 | TC-008-001 a TC-008-004 | Alta/Média | Funcional/UX |
| US-009 | TC-009-001 a TC-009-004 | Crítica/Alta/Média | Funcional/Validação |
| US-003 | TC-003-001 a TC-003-009 | Crítica/Alta/Média | Funcional/Performance |

## Cobertura de Testes

- **Total de Casos**: 34
- **Críticos**: 3
- **Altos**: 23
- **Médios**: 8

## Automação Recomendada

- ✅ TC-004-001, TC-004-002, TC-004-004 (E2E)
- ✅ TC-005-001, TC-005-002 a TC-005-009 (E2E + Unit)
- ✅ TC-008-001, TC-008-002 (E2E)
- ✅ TC-009-001, TC-009-002 (E2E)
- ✅ TC-003-001, TC-003-002, TC-003-009 (Integration + Unit)

---

**Versão**: 1.0  
**Última Atualização**: 2024



