# Casos de Teste - Sprint 4: Transações Recorrentes

## Sprint 4: Receitas e Despesas Mensais

### US-012: Visualizar Despesas Mensais

#### TC-012-001: Lista exibe todas as despesas mensais
**Prioridade**: Alta  
**Tipo**: Funcional  

**Passos**:
1. Acessar página de Despesas Mensais

**Resultado Esperado**:
- ✅ Todas as despesas mensais são exibidas
- ✅ Ordenadas por dia do mês (crescente)

---

#### TC-012-002: Estatística de total exibida
**Prioridade**: Alta  
**Tipo**: Funcional  

**Passos**:
1. Verificar card de estatística

**Resultado Esperado**:
- ✅ Total de despesas mensais calculado
- ✅ Formatação monetária correta

---

### US-013: Criar Despesa Mensal

#### TC-013-001: Criar despesa mensal válida
**Prioridade**: Alta  
**Tipo**: Funcional  

**Passos**:
1. Clicar em "Adicionar Despesa Mensal"
2. Preencher: nome, valor, dia do mês
3. Preencher link de cancelamento (opcional)
4. Salvar

**Resultado Esperado**:
- ✅ Despesa mensal criada
- ✅ Lista atualizada

---

#### TC-013-002: Validação - dia do mês (1-31)
**Prioridade**: Alta  
**Tipo**: Validação  

**Passos**:
1. Tentar criar com dia 0 ou 32

**Resultado Esperado**:
- ❌ Mensagem: "Dia deve ser entre 1 e 31"

---

#### TC-013-003: Validação - link de cancelamento (URL)
**Prioridade**: Média  
**Tipo**: Validação  

**Passos**:
1. Preencher link inválido: "não-é-url"

**Resultado Esperado**:
- ❌ Mensagem: "URL inválida"

---

### US-014: Acessar Link de Cancelamento

#### TC-014-001: Abrir link em nova aba
**Prioridade**: Média  
**Tipo**: Funcional  

**Passos**:
1. Clicar em "Ver Link" ou botão de link
2. Verificar comportamento

**Resultado Esperado**:
- ✅ Link abre em nova aba (target="_blank")
- ✅ URL correta

---

#### TC-014-002: Link inexistente
**Prioridade**: Baixa  
**Tipo**: Funcional  

**Pré-condições**: Despesa sem link

**Passos**:
1. Verificar interface

**Resultado Esperado**:
- ✅ Botão não aparece ou está desabilitado

---

### US-015: Copiar Link de Cancelamento

#### TC-015-001: Copiar link para clipboard
**Prioridade**: Média  
**Tipo**: Funcional  

**Passos**:
1. Clicar em "Copiar Link"
2. Colar em outro lugar

**Resultado Esperado**:
- ✅ Link copiado para clipboard
- ✅ Feedback visual (toast)
- ✅ Link pode ser colado corretamente

---

### US-016, US-017: Editar e Excluir Despesa Mensal

#### TC-016-001: Editar despesa mensal
**Prioridade**: Média  
**Tipo**: Funcional  

**Passos**:
1. Editar valores
2. Salvar

**Resultado Esperado**:
- ✅ Alterações salvas
- ✅ Lista atualizada

---

#### TC-017-001: Excluir despesa mensal
**Prioridade**: Média  
**Tipo**: Funcional  

**Passos**:
1. Excluir com confirmação

**Resultado Esperado**:
- ✅ Despesa excluída
- ✅ Lista atualizada

---

### US-018 a US-021: Receitas Mensais

#### TC-018-001 a TC-021-001: Funcionalidades similares
**Prioridade**: Alta/Média  
**Tipo**: Funcional  

**Observação**: Casos de teste similares aos de Despesas Mensais, mas:
- Não possui link de cancelamento
- Foco em dia do mês de recebimento

**Casos Incluídos**:
- Visualizar lista
- Criar receita mensal
- Editar receita mensal
- Excluir receita mensal
- Validações de dia do mês

---

## Matriz de Rastreabilidade

| User Story | Casos de Teste | Prioridade |
|-----------|----------------|------------|
| US-012 | TC-012-001 a TC-012-002 | Alta |
| US-013 | TC-013-001 a TC-013-003 | Alta/Média |
| US-014 | TC-014-001 a TC-014-002 | Média/Baixa |
| US-015 | TC-015-001 | Média |
| US-016 | TC-016-001 | Média |
| US-017 | TC-017-001 | Média |
| US-018-021 | TC-018-001 a TC-021-001 | Alta/Média |

## Cobertura de Testes

- **Total de Casos**: ~15
- **Altos**: 8
- **Médios**: 6
- **Baixos**: 1

---

**Versão**: 1.0  
**Última Atualização**: 2024



