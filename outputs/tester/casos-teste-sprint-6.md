# Casos de Teste - Sprint 6: Funcionalidades Adicionais

## Sprint 6: Lista de Compras e Desejos

### US-027: Visualizar Lista de Desejos

#### TC-027-001: Lista exibe todos os desejos
**Prioridade**: Média  
**Tipo**: Funcional  

**Passos**:
1. Acessar página de Desejos

**Resultado Esperado**:
- ✅ Todos os desejos são exibidos
- ✅ Ordenados por data de criação (mais recentes primeiro)

---

#### TC-027-002: Estatística de total
**Prioridade**: Média  
**Tipo**: Funcional  

**Passos**:
1. Verificar card de estatística

**Resultado Esperado**:
- ✅ Total de desejos exibido
- ✅ Número correto

---

### US-028: Criar Desejo

#### TC-028-001: Criar desejo com categoria e valor
**Prioridade**: Alta  
**Tipo**: Funcional  

**Passos**:
1. Clicar em "Adicionar Desejo"
2. Preencher: nome, categoria (opcional), valor (opcional)
3. Preencher link de compra (opcional)
4. Salvar

**Resultado Esperado**:
- ✅ Desejo criado
- ✅ Categoria e valor salvos
- ✅ Lista atualizada

---

#### TC-028-002: Validação de categoria
**Prioridade**: Alta  
**Tipo**: Validação  

**Passos**:
1. Selecionar categoria existente
2. Verificar salvamento

**Resultado Esperado**:
- ✅ Categoria vinculada ao desejo
- ✅ Validação de categoria existe

---

### US-029: Acessar Link de Compra

#### TC-029-001: Abrir link em nova aba
**Prioridade**: Média  
**Tipo**: Funcional  

**Passos**:
1. Clicar em link de compra

**Resultado Esperado**:
- ✅ Link abre em nova aba
- ✅ URL correta

---

### US-030: Copiar Link de Compra

#### TC-030-001: Copiar para clipboard
**Prioridade**: Baixa  
**Tipo**: Funcional  

**Passos**:
1. Copiar link
2. Colar

**Resultado Esperado**:
- ✅ Link copiado
- ✅ Feedback visual

---

### US-031, US-032: Editar e Excluir Desejo

#### TC-031-001: Editar desejo
**Prioridade**: Baixa  
**Tipo**: Funcional  

**Passos**:
1. Editar informações
2. Salvar

**Resultado Esperado**:
- ✅ Alterações salvas
- ✅ Lista atualizada

---

#### TC-032-001: Excluir desejo
**Prioridade**: Baixa  
**Tipo**: Funcional  

**Passos**:
1. Excluir com confirmação

**Resultado Esperado**:
- ✅ Desejo excluído
- ✅ Lista atualizada

---

### US-033: Visualizar Lista de Compras

#### TC-033-001: Lista exibe todos os itens
**Prioridade**: Média  
**Tipo**: Funcional  

**Passos**:
1. Acessar página de Lista de Compras

**Resultado Esperado**:
- ✅ Todos os itens exibidos
- ✅ Checkbox de status visível

---

#### TC-033-002: Estatísticas exibidas
**Prioridade**: Alta  
**Tipo**: Funcional  

**Passos**:
1. Verificar cards de estatísticas

**Resultado Esperado**:
- ✅ Total de itens
- ✅ Itens comprados
- ✅ Itens pendentes
- ✅ Total de preços

---

#### TC-033-003: Cálculo de estatísticas
**Prioridade**: Alta  
**Tipo**: Funcional  

**Pré-condições**: 
- 10 itens, 3 comprados
- Total: R$ 500

**Passos**:
1. Verificar cálculos

**Resultado Esperado**:
- ✅ Total: 10 itens
- ✅ Comprados: 3
- ✅ Pendentes: 7
- ✅ Total de preços: R$ 500,00

---

### US-034: Adicionar Item à Lista

#### TC-034-001: Criar item válido
**Prioridade**: Média  
**Tipo**: Funcional  

**Passos**:
1. Adicionar item
2. Preencher: nome, preço
3. Salvar

**Resultado Esperado**:
- ✅ Item criado
- ✅ Lista atualizada
- ✅ Estatísticas atualizadas

---

#### TC-034-002: Validação de preço
**Prioridade**: Média  
**Tipo**: Validação  

**Passos**:
1. Tentar com preço negativo

**Resultado Esperado**:
- ❌ Validação impede
- ❌ Mensagem apropriada

---

### US-035: Marcar Item como Comprado

#### TC-035-001: Alternar status via checkbox
**Prioridade**: Média  
**Tipo**: Funcional  

**Passos**:
1. Marcar checkbox
2. Verificar atualização

**Resultado Esperado**:
- ✅ Status atualizado
- ✅ Item destacado visualmente
- ✅ Estatísticas atualizadas
- ✅ Persistência imediata

---

#### TC-035-002: Desmarcar item comprado
**Prioridade**: Média  
**Tipo**: Funcional  

**Passos**:
1. Desmarcar checkbox

**Resultado Esperado**:
- ✅ Status volta para pendente
- ✅ Estatísticas atualizadas

---

### US-036, US-037: Editar e Excluir Item

#### TC-036-001: Editar item
**Prioridade**: Baixa  
**Tipo**: Funcional  

**Passos**:
1. Editar nome ou preço
2. Salvar

**Resultado Esperado**:
- ✅ Alterações salvas
- ✅ Estatísticas recalculadas

---

#### TC-037-001: Excluir item
**Prioridade**: Baixa  
**Tipo**: Funcional  

**Passos**:
1. Excluir item
2. Verificar

**Resultado Esperado**:
- ✅ Item excluído
- ✅ Estatísticas atualizadas

---

### Funcionalidade Especial: Botão "Comprado" em Desejos

#### TC-WISH-001: Marcar desejo como comprado
**Prioridade**: Alta  
**Tipo**: Funcional  

**Pré-condições**: 
- Desejo com categoria e valor definidos

**Passos**:
1. Clicar em "Comprado"
2. Confirmar compra

**Resultado Esperado**:
- ✅ Despesa criada automaticamente
- ✅ Desejo removido da lista
- ✅ Despesa vinculada à categoria do desejo

---

#### TC-WISH-002: Verificação de orçamento ao comprar
**Prioridade**: Alta  
**Tipo**: Funcional  

**Pré-condições**: 
- Categoria atingiu orçamento máximo no mês

**Passos**:
1. Clicar em "Comprado"
2. Verificar aviso

**Resultado Esperado**:
- ⚠️ Dialog pergunta se deseja registrar mesmo assim
- ✅ Usuário pode confirmar ou cancelar
- ✅ Se confirmar, despesa é criada

---

#### TC-WISH-003: Comprado sem categoria ou valor
**Prioridade**: Alta  
**Tipo**: Funcional  

**Pré-condições**: 
- Desejo sem categoria ou sem valor

**Passos**:
1. Tentar clicar em "Comprado"

**Resultado Esperado**:
- ❌ Botão não aparece ou erro é exibido
- ❌ Mensagem: "Desejo precisa ter categoria e valor"

---

## Matriz de Rastreabilidade

| User Story | Casos de Teste | Prioridade |
|-----------|----------------|------------|
| US-027 | TC-027-001 a TC-027-002 | Média |
| US-028 | TC-028-001 a TC-028-002 | Alta |
| US-029 | TC-029-001 | Média |
| US-030 | TC-030-001 | Baixa |
| US-031-032 | TC-031-001, TC-032-001 | Baixa |
| US-033 | TC-033-001 a TC-033-003 | Média/Alta |
| US-034 | TC-034-001 a TC-034-002 | Média |
| US-035 | TC-035-001 a TC-035-002 | Média |
| US-036-037 | TC-036-001, TC-037-001 | Baixa |
| Especial | TC-WISH-001 a TC-WISH-003 | Alta |

## Cobertura de Testes

- **Total de Casos**: ~18
- **Altos**: 6
- **Médios**: 9
- **Baixos**: 3

---

**Versão**: 1.0  
**Última Atualização**: 2024



