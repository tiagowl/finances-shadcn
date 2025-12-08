# Casos de Teste - Sprint 5: Planejamento e Simulação

## Sprint 5: Simulação de Gastos Futuros

### US-038: Visualizar Simulação de Gastos

#### TC-038-001: Gráfico exibido corretamente
**Prioridade**: Alta  
**Tipo**: Funcional  

**Passos**:
1. Acessar página de Simulação

**Resultado Esperado**:
- ✅ Gráfico é renderizado
- ✅ Três séries: Despesas, Mensalidades Crédito, Receitas
- ✅ Biblioteca de gráficos funcionando (Recharts)

---

#### TC-038-002: Gráfico interativo
**Prioridade**: Média  
**Tipo**: Funcional/UX  

**Passos**:
1. Interagir com gráfico (hover, zoom se aplicável)

**Resultado Esperado**:
- ✅ Tooltips exibem valores
- ✅ Interações suaves

---

#### TC-038-003: Gráfico responsivo
**Prioridade**: Alta  
**Tipo**: Responsividade  

**Passos**:
1. Redimensionar tela
2. Verificar adaptação

**Resultado Esperado**:
- ✅ Gráfico se adapta ao tamanho
- ✅ Legível em mobile

---

#### TC-038-004: Mensagem quando sem dados
**Prioridade**: Média  
**Tipo**: UX  

**Passos**:
1. Acessar sem dados de simulação

**Resultado Esperado**:
- ✅ Mensagem apropriada
- ✅ Gráfico vazio ou mensagem

---

### US-039: Cadastrar Despesas na Simulação

#### TC-039-001: Criar despesa de simulação
**Prioridade**: Alta  
**Tipo**: Funcional  

**Passos**:
1. Criar despesa na simulação
2. Verificar gráfico atualizado

**Resultado Esperado**:
- ✅ Despesa salva (apenas simulação)
- ✅ Gráfico atualizado
- ✅ Não afeta dados reais

---

#### TC-039-002: Isolamento de dados reais
**Prioridade**: Crítica  
**Tipo**: Integração  

**Passos**:
1. Criar despesa real
2. Criar despesa de simulação
3. Verificar separação

**Resultado Esperado**:
- ✅ Despesas reais não aparecem na simulação
- ✅ Despesas de simulação não aparecem em dados reais

---

### US-040: Cadastrar Receitas na Simulação

#### TC-040-001: Criar receita de simulação
**Prioridade**: Alta  
**Tipo**: Funcional  

**Passos**:
1. Criar receita na simulação
2. Verificar atualização

**Resultado Esperado**:
- ✅ Receita salva
- ✅ Gráfico atualizado
- ✅ Isolamento mantido

---

### US-041: Cadastrar Compras no Crédito

#### TC-041-001: Criar compra no crédito
**Prioridade**: Alta  
**Tipo**: Funcional  

**Passos**:
1. Preencher: nome, valor, parcelas, data de compra
2. Salvar

**Resultado Esperado**:
- ✅ Compra cadastrada
- ✅ Parcelas calculadas automaticamente
- ✅ Mensalidades aparecem no gráfico

---

#### TC-041-002: Cálculo de parcelas
**Prioridade**: Alta  
**Tipo**: Funcional  

**Pré-condições**: Compra de R$ 1000 em 10 parcelas

**Passos**:
1. Verificar cálculo

**Resultado Esperado**:
- ✅ Cada parcela: R$ 100,00
- ✅ Distribuídas corretamente nos meses

---

#### TC-041-003: Validação - número de parcelas
**Prioridade**: Média  
**Tipo**: Validação  

**Passos**:
1. Tentar com parcelas negativas ou zero

**Resultado Esperado**:
- ❌ Validação impede
- ❌ Mensagem apropriada

---

### US-042: Visualizar Projeção de Meses Futuros

#### TC-042-001: Projeção para 12 meses
**Prioridade**: Alta  
**Tipo**: Funcional  

**Passos**:
1. Configurar projeção
2. Verificar gráfico

**Resultado Esperado**:
- ✅ Próximos 12 meses exibidos
- ✅ Cálculos corretos
- ✅ Gráfico legível

---

#### TC-042-002: Projeção considera simulação
**Prioridade**: Alta  
**Tipo**: Funcional  

**Passos**:
1. Adicionar itens na simulação
2. Verificar projeção

**Resultado Esperado**:
- ✅ Projeção inclui itens simulados
- ✅ Cálculos agregados corretos

---

#### TC-042-003: Configurar período de projeção
**Prioridade**: Média  
**Tipo**: Funcional  

**Passos**:
1. Alterar período (3, 6, 12 meses)

**Resultado Esperado**:
- ✅ Gráfico atualiza
- ✅ Dados recalculados

---

### US-043: Visualizar Estatísticas da Simulação

#### TC-043-001: Estatísticas exibidas
**Prioridade**: Alta  
**Tipo**: Funcional  

**Passos**:
1. Verificar cards de estatísticas

**Resultado Esperado**:
- ✅ Receitas totais
- ✅ Gastos de crédito totais
- ✅ Gastos totais
- ✅ Saldo médio

---

#### TC-043-002: Cálculo de saldo médio
**Prioridade**: Alta  
**Tipo**: Funcional  

**Pré-condições**: Dados de simulação

**Passos**:
1. Verificar cálculo

**Resultado Esperado**:
- ✅ Saldo médio calculado corretamente
- ✅ Considera todos os meses projetados

---

#### TC-043-003: Atualização em tempo real
**Prioridade**: Alta  
**Tipo**: Funcional  

**Passos**:
1. Adicionar item na simulação
2. Verificar estatísticas

**Resultado Esperado**:
- ✅ Estatísticas recalculadas
- ✅ Valores atualizados

---

## Matriz de Rastreabilidade

| User Story | Casos de Teste | Prioridade |
|-----------|----------------|------------|
| US-038 | TC-038-001 a TC-038-004 | Alta/Média |
| US-039 | TC-039-001 a TC-039-002 | Alta/Crítica |
| US-040 | TC-040-001 | Alta |
| US-041 | TC-041-001 a TC-041-003 | Alta/Média |
| US-042 | TC-042-001 a TC-042-003 | Alta/Média |
| US-043 | TC-043-001 a TC-043-003 | Alta |

## Cobertura de Testes

- **Total de Casos**: ~17
- **Críticos**: 1
- **Altos**: 13
- **Médios**: 3

---

**Versão**: 1.0  
**Última Atualização**: 2024



