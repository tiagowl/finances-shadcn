# Casos de Teste - Sprint 2: Organização e Categorização

## Sprint 2: Sistema de Categorias

### US-023: Criar Categoria

#### TC-023-001: Criar categoria com dados válidos
**Prioridade**: Crítica  
**Tipo**: Funcional  

**Passos**:
1. Clicar em "Adicionar Categoria"
2. Preencher nome: "Alimentação"
3. Preencher orçamento máximo: 1000.00
4. Selecionar cor (opcional): #3b82f6
5. Salvar

**Resultado Esperado**:
- ✅ Categoria criada com sucesso
- ✅ Lista atualizada
- ✅ Toast de sucesso

---

#### TC-023-002: Validação - nome duplicado
**Prioridade**: Alta  
**Tipo**: Validação  

**Pré-condições**: Categoria "Alimentação" já existe

**Passos**:
1. Tentar criar categoria com mesmo nome

**Resultado Esperado**:
- ❌ Erro: "Nome de categoria já existe"
- ❌ Categoria não é criada

---

#### TC-023-003: Validação - nome muito curto
**Prioridade**: Alta  
**Tipo**: Validação  

**Passos**:
1. Preencher nome com 1 caractere

**Resultado Esperado**:
- ❌ Mensagem: "Nome deve ter no mínimo 2 caracteres"

---

#### TC-023-004: Validação - orçamento negativo
**Prioridade**: Alta  
**Tipo**: Validação  

**Passos**:
1. Preencher orçamento: -100

**Resultado Esperado**:
- ❌ Mensagem: "Orçamento deve ser positivo ou zero"

---

#### TC-023-005: Criar categoria com orçamento zero
**Prioridade**: Média  
**Tipo**: Funcional  

**Passos**:
1. Criar categoria com orçamento 0

**Resultado Esperado**:
- ✅ Categoria criada (sem limite de orçamento)

---

### US-022: Visualizar Categorias

#### TC-022-001: Lista exibe todas as categorias
**Prioridade**: Alta  
**Tipo**: Funcional  

**Passos**:
1. Acessar página de Categorias

**Resultado Esperado**:
- ✅ Todas as categorias são exibidas
- ✅ Ordenadas alfabeticamente ou por criação

---

#### TC-022-002: Estatísticas totais exibidas
**Prioridade**: Alta  
**Tipo**: Funcional  

**Pré-condições**: Categorias com orçamentos definidos

**Passos**:
1. Verificar cards de estatísticas

**Resultado Esperado**:
- ✅ Total de orçamentos máximos calculado
- ✅ Total gasto calculado
- ✅ Cards com ícones apropriados

---

#### TC-022-003: Colunas na tabela
**Prioridade**: Alta  
**Tipo**: Funcional  

**Passos**:
1. Verificar tabela de categorias

**Resultado Esperado**:
- ✅ Coluna: Nome
- ✅ Coluna: Orçamento Máximo
- ✅ Coluna: Gasto (total gasto na categoria)
- ✅ Coluna: Restante
- ✅ Coluna: Ações

---

#### TC-022-004: Cálculo de gasto por categoria
**Prioridade**: Alta  
**Tipo**: Funcional  

**Pré-condições**: 
- Categoria "Alimentação" com orçamento R$ 1000
- Despesas na categoria: R$ 300, R$ 200

**Passos**:
1. Verificar coluna "Gasto"

**Resultado Esperado**:
- ✅ Gasto total: R$ 500,00
- ✅ Cálculo correto

---

#### TC-022-005: Cálculo de restante
**Prioridade**: Alta  
**Tipo**: Funcional  

**Pré-condições**: 
- Orçamento: R$ 1000
- Gasto: R$ 500

**Passos**:
1. Verificar coluna "Restante"

**Resultado Esperado**:
- ✅ Restante: R$ 500,00
- ✅ Formatação correta

---

#### TC-022-006: Restante negativo (orçamento ultrapassado)
**Prioridade**: Alta  
**Tipo**: Funcional  

**Pré-condições**: Gasto > Orçamento

**Passos**:
1. Verificar exibição

**Resultado Esperado**:
- ✅ Valor negativo é exibido
- ✅ Destaque visual em vermelho (text-destructive)

---

#### TC-022-007: Lista vazia
**Prioridade**: Média  
**Tipo**: UX  

**Passos**:
1. Acessar sem categorias

**Resultado Esperado**:
- ✅ Mensagem apropriada
- ✅ Botão de adicionar visível

---

### US-024: Visualizar Status de Orçamento

#### TC-024-001: Status dentro do orçamento
**Prioridade**: Alta  
**Tipo**: Funcional  

**Pré-condições**: Gasto < Orçamento

**Passos**:
1. Verificar status

**Resultado Esperado**:
- ✅ Restante positivo
- ✅ Cor normal (text-muted-foreground)
- ✅ Sem destaque de alerta

---

#### TC-024-002: Status próximo do limite
**Prioridade**: Média  
**Tipo**: Funcional/UX  

**Pré-condições**: Gasto >= 90% do orçamento

**Passos**:
1. Verificar destaque visual

**Resultado Esperado**:
- ⚠️ Destaque visual (amarelo/laranja)
- ✅ Indicação de atenção

---

#### TC-024-003: Status ultrapassado
**Prioridade**: Alta  
**Tipo**: Funcional  

**Pré-condições**: Gasto > Orçamento

**Passos**:
1. Verificar destaque

**Resultado Esperado**:
- ✅ Restante negativo em vermelho
- ✅ Destaque visual claro
- ✅ Valor absoluto correto

---

#### TC-024-004: Atualização em tempo real
**Prioridade**: Alta  
**Tipo**: Funcional  

**Passos**:
1. Criar nova despesa em categoria
2. Verificar atualização automática

**Resultado Esperado**:
- ✅ Gasto atualizado
- ✅ Restante recalculado
- ✅ Estatísticas atualizadas

---

### Validação de Integração

#### TC-INT-001: Despesa vinculada à categoria
**Prioridade**: Crítica  
**Tipo**: Integração  

**Passos**:
1. Criar categoria
2. Criar despesa na categoria
3. Verificar relação

**Resultado Esperado**:
- ✅ Despesa aparece no gasto da categoria
- ✅ Restante é recalculado

---

#### TC-INT-002: Exclusão de categoria com despesas
**Prioridade**: Alta  
**Tipo**: Integração  

**Pré-condições**: Categoria com despesas

**Passos**:
1. Tentar excluir categoria

**Resultado Esperado**:
- ❌ Restrição ON DELETE RESTRICT impede exclusão
- ✅ Mensagem apropriada ao usuário

---

## Matriz de Rastreabilidade

| User Story | Casos de Teste | Prioridade |
|-----------|----------------|------------|
| US-023 | TC-023-001 a TC-023-005 | Crítica/Alta/Média |
| US-022 | TC-022-001 a TC-022-007 | Alta/Média |
| US-024 | TC-024-001 a TC-024-004 | Alta/Média |
| Integração | TC-INT-001 a TC-INT-002 | Crítica/Alta |

## Cobertura de Testes

- **Total de Casos**: 18
- **Críticos**: 2
- **Altos**: 13
- **Médios**: 3

---

**Versão**: 1.0  
**Última Atualização**: 2024



