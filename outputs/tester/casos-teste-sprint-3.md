# Casos de Teste - Sprint 3: Edição e Exclusão

## Sprint 3: Operações CRUD Completas

### US-006: Editar Receita

#### TC-006-001: Editar receita com dados válidos
**Prioridade**: Alta  
**Tipo**: Funcional  

**Passos**:
1. Clicar em "Editar" em uma receita
2. Modificar nome e valor
3. Salvar

**Resultado Esperado**:
- ✅ Alterações salvas
- ✅ Lista atualizada
- ✅ Dashboard atualizado

---

#### TC-006-002: Validações ao editar
**Prioridade**: Alta  
**Tipo**: Validação  

**Passos**:
1. Editar receita
2. Tentar salvar com dados inválidos

**Resultado Esperado**:
- ❌ Mesmas validações da criação
- ❌ Dados não são alterados

---

#### TC-006-003: Permissão - apenas próprio usuário
**Prioridade**: Crítica  
**Tipo**: Segurança  

**Passos**:
1. Tentar editar receita de outro usuário (via API)

**Resultado Esperado**:
- ❌ Erro 404 ou 403
- ❌ Receita não é alterada

---

### US-007: Excluir Receita

#### TC-007-001: Exclusão com confirmação
**Prioridade**: Alta  
**Tipo**: Funcional  

**Passos**:
1. Clicar em "Excluir"
2. Confirmar no modal
3. Verificar resultado

**Resultado Esperado**:
- ✅ Modal de confirmação exibido
- ✅ Receita excluída após confirmação
- ✅ Lista atualizada
- ✅ Dashboard atualizado

---

#### TC-007-002: Cancelar exclusão
**Prioridade**: Média  
**Tipo**: UX  

**Passos**:
1. Clicar em "Excluir"
2. Cancelar no modal

**Resultado Esperado**:
- ✅ Modal fecha
- ✅ Receita não é excluída

---

#### TC-007-003: Permissão - apenas próprio usuário
**Prioridade**: Crítica  
**Tipo**: Segurança  

**Passos**:
1. Tentar excluir receita de outro usuário

**Resultado Esperado**:
- ❌ Erro 404 ou 403
- ❌ Receita não é excluída

---

### US-010: Editar Despesa

#### TC-010-001: Editar despesa incluindo categoria
**Prioridade**: Alta  
**Tipo**: Funcional  

**Passos**:
1. Editar despesa
2. Alterar categoria
3. Salvar

**Resultado Esperado**:
- ✅ Despesa atualizada
- ✅ Orçamentos recalculados (categoria antiga e nova)
- ✅ Estatísticas atualizadas

---

#### TC-010-002: Recalcular orçamento ao mudar categoria
**Prioridade**: Alta  
**Tipo**: Funcional  

**Pré-condições**: 
- Despesa R$ 100 na Categoria A
- Mudar para Categoria B

**Passos**:
1. Editar e mudar categoria
2. Verificar orçamentos

**Resultado Esperado**:
- ✅ Categoria A: gasto reduzido em R$ 100
- ✅ Categoria B: gasto aumentado em R$ 100
- ✅ Restantes recalculados

---

#### TC-010-003: Recalcular ao alterar valor
**Prioridade**: Alta  
**Tipo**: Funcional  

**Passos**:
1. Editar despesa
2. Alterar valor de R$ 100 para R$ 150
3. Salvar

**Resultado Esperado**:
- ✅ Gasto da categoria atualizado
- ✅ Restante recalculado

---

### US-011: Excluir Despesa

#### TC-011-001: Exclusão com recálculo de orçamento
**Prioridade**: Alta  
**Tipo**: Funcional  

**Passos**:
1. Excluir despesa de R$ 100
2. Verificar categoria

**Resultado Esperado**:
- ✅ Despesa excluída
- ✅ Gasto da categoria reduzido
- ✅ Restante recalculado

---

### US-025: Editar Categoria

#### TC-025-001: Editar orçamento máximo
**Prioridade**: Alta  
**Tipo**: Funcional  

**Passos**:
1. Editar categoria
2. Alterar orçamento de R$ 1000 para R$ 1500
3. Salvar

**Resultado Esperado**:
- ✅ Orçamento atualizado
- ✅ Restante recalculado
- ✅ Estatísticas totais atualizadas

---

#### TC-025-002: Alterar nome da categoria
**Prioridade**: Média  
**Tipo**: Funcional  

**Passos**:
1. Editar e alterar nome
2. Verificar impacto

**Resultado Esperado**:
- ✅ Nome atualizado
- ✅ Despesas mantêm vínculo
- ✅ Nome aparece atualizado nas despesas

---

### US-026: Excluir Categoria

#### TC-026-001: Exclusão sem despesas
**Prioridade**: Alta  
**Tipo**: Funcional  

**Pré-condições**: Categoria sem despesas

**Passos**:
1. Excluir categoria
2. Verificar resultado

**Resultado Esperado**:
- ✅ Categoria excluída
- ✅ Lista atualizada
- ✅ Estatísticas atualizadas

---

#### TC-026-002: Tentar excluir categoria com despesas
**Prioridade**: Alta  
**Tipo**: Funcional  

**Pré-condições**: Categoria com despesas

**Passos**:
1. Tentar excluir categoria

**Resultado Esperado**:
- ❌ Exclusão bloqueada (ON DELETE RESTRICT)
- ✅ Mensagem apropriada: "Não é possível excluir categoria com despesas"
- ✅ Usuário orientado a excluir despesas primeiro

---

## Matriz de Rastreabilidade

| User Story | Casos de Teste | Prioridade |
|-----------|----------------|------------|
| US-006 | TC-006-001 a TC-006-003 | Alta/Crítica |
| US-007 | TC-007-001 a TC-007-003 | Alta/Crítica |
| US-010 | TC-010-001 a TC-010-003 | Alta |
| US-011 | TC-011-001 | Alta |
| US-025 | TC-025-001 a TC-025-002 | Alta/Média |
| US-026 | TC-026-001 a TC-026-002 | Alta |

## Cobertura de Testes

- **Total de Casos**: 15
- **Críticos**: 3 (Segurança)
- **Altos**: 11
- **Médios**: 1

---

**Versão**: 1.0  
**Última Atualização**: 2024



