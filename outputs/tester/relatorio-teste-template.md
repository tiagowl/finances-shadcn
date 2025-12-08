# Template de Relatório de Teste

## Informações Gerais

**Projeto**: Sistema de Controle Financeiro  
**Versão Testada**: 1.0.0  
**Data do Teste**: [DATA]  
**Testador**: [NOME]  
**Ambiente**: [DEV/STAGING/PROD]  
**Duração**: [TEMPO]

---

## Resumo Executivo

### Status Geral
- ✅ **Passou** | ⚠️ **Avisos** | ❌ **Falhou**

### Métricas
- **Total de Testes**: [N]
- **Passou**: [N]
- **Falhou**: [N]
- **Pulou**: [N]
- **Taxa de Sucesso**: [%]

### Tempo de Execução
- **Início**: [HORA]
- **Fim**: [HORA]
- **Duração Total**: [TEMPO]

---

## Escopo do Teste

### Funcionalidades Testadas
- [ ] Autenticação
- [ ] Dashboard
- [ ] Receitas
- [ ] Despesas
- [ ] Categorias
- [ ] Despesas Mensais
- [ ] Receitas Mensais
- [ ] Simulação
- [ ] Lista de Desejos
- [ ] Lista de Compras

### Tipos de Teste Executados
- [ ] Testes Unitários
- [ ] Testes de Integração
- [ ] Testes E2E
- [ ] Testes de Performance
- [ ] Testes de Segurança
- [ ] Testes de Usabilidade

---

## Resultados por Sprint/Funcionalidade

### Sprint 0: Fundação

| User Story | Casos de Teste | Passou | Falhou | Status |
|-----------|----------------|--------|--------|--------|
| US-001: Login | 6 | 5 | 1 | ⚠️ |
| US-002: Cadastro | 6 | 6 | 0 | ✅ |
| US-044: Sidebar | 5 | 5 | 0 | ✅ |
| US-045: Navbar | 4 | 4 | 0 | ✅ |
| US-046: Responsivo | 10 | 9 | 1 | ⚠️ |

**Observações**:
- [Descrever problemas encontrados]

---

### Sprint 1: Core Financeiro

| User Story | Casos de Teste | Passou | Falhou | Status |
|-----------|----------------|--------|--------|--------|
| US-004: Lista Receitas | 6 | 6 | 0 | ✅ |
| US-005: Criar Receita | 11 | 10 | 1 | ⚠️ |
| US-008: Lista Despesas | 4 | 4 | 0 | ✅ |
| US-009: Criar Despesa | 4 | 4 | 0 | ✅ |
| US-003: Dashboard | 9 | 9 | 0 | ✅ |

**Observações**:
- [Descrever problemas encontrados]

---

### Sprint 2: Organização

| User Story | Casos de Teste | Passou | Falhou | Status |
|-----------|----------------|--------|--------|--------|
| US-023: Criar Categoria | 5 | 5 | 0 | ✅ |
| US-022: Lista Categorias | 7 | 7 | 0 | ✅ |
| US-024: Status Orçamento | 4 | 4 | 0 | ✅ |

**Observações**:
- [Descrever problemas encontrados]

---

### Sprint 3: Edição e Exclusão

| User Story | Casos de Teste | Passou | Falhou | Status |
|-----------|----------------|--------|--------|--------|
| US-006: Editar Receita | 3 | 3 | 0 | ✅ |
| US-007: Excluir Receita | 3 | 3 | 0 | ✅ |
| US-010: Editar Despesa | 3 | 3 | 0 | ✅ |
| US-011: Excluir Despesa | 1 | 1 | 0 | ✅ |
| US-025: Editar Categoria | 2 | 2 | 0 | ✅ |
| US-026: Excluir Categoria | 2 | 2 | 0 | ✅ |

**Observações**:
- [Descrever problemas encontrados]

---

### Sprint 4: Transações Recorrentes

| User Story | Casos de Teste | Passou | Falhou | Status |
|-----------|----------------|--------|--------|--------|
| US-012: Despesas Mensais | 2 | 2 | 0 | ✅ |
| US-013: Criar Despesa Mensal | 3 | 3 | 0 | ✅ |
| US-014-017: CRUD Despesas Mensais | 4 | 4 | 0 | ✅ |
| US-018-021: CRUD Receitas Mensais | 6 | 6 | 0 | ✅ |

**Observações**:
- [Descrever problemas encontrados]

---

### Sprint 5: Planejamento

| User Story | Casos de Teste | Passou | Falhou | Status |
|-----------|----------------|--------|--------|--------|
| US-038: Simulação | 4 | 4 | 0 | ✅ |
| US-039: Despesas Simulação | 2 | 2 | 0 | ✅ |
| US-040: Receitas Simulação | 1 | 1 | 0 | ✅ |
| US-041: Crédito Simulação | 3 | 2 | 1 | ⚠️ |
| US-042: Projeção | 3 | 3 | 0 | ✅ |
| US-043: Estatísticas | 3 | 3 | 0 | ✅ |

**Observações**:
- [Descrever problemas encontrados]

---

### Sprint 6: Funcionalidades Adicionais

| User Story | Casos de Teste | Passou | Falhou | Status |
|-----------|----------------|--------|--------|--------|
| US-027: Lista Desejos | 2 | 2 | 0 | ✅ |
| US-028: Criar Desejo | 2 | 2 | 0 | ✅ |
| US-029-032: CRUD Desejos | 4 | 4 | 0 | ✅ |
| US-033: Lista Compras | 3 | 3 | 0 | ✅ |
| US-034-037: CRUD Compras | 4 | 4 | 0 | ✅ |
| Funcionalidade Especial | 3 | 3 | 0 | ✅ |

**Observações**:
- [Descrever problemas encontrados]

---

## Problemas Encontrados

### Críticos (P0)

| ID | Descrição | User Story | Status |
|----|-----------|-----------|--------|
| BUG-001 | [Descrição] | US-XXX | Aberto |

### Altos (P1)

| ID | Descrição | User Story | Status |
|----|-----------|-----------|--------|
| BUG-002 | [Descrição] | US-XXX | Aberto |

### Médios (P2)

| ID | Descrição | User Story | Status |
|----|-----------|-----------|--------|
| BUG-003 | [Descrição] | US-XXX | Aberto |

---

## Testes de Performance

### Métricas

| Métrica | Esperado | Obtido | Status |
|---------|----------|--------|--------|
| Tempo de resposta API (p95) | < 2s | [TEMPO] | ✅/❌ |
| Carregamento Frontend | < 3s | [TEMPO] | ✅/❌ |
| Query Database (p95) | < 100ms | [TEMPO] | ✅/❌ |
| Throughput (req/s) | > 100 | [NUM] | ✅/❌ |

### Observações
- [Observações sobre performance]

---

## Testes de Segurança

### Validações Realizadas

- [ ] Autenticação JWT funcionando
- [ ] Isolamento de dados por usuário
- [ ] Validação de inputs
- [ ] Proteção contra SQL Injection
- [ ] Proteção contra XSS
- [ ] HTTPS obrigatório

### Problemas Encontrados

| Severidade | Descrição | Status |
|-----------|-----------|--------|
| [Nível] | [Descrição] | [Status] |

---

## Testes de Usabilidade

### Validações

- [ ] Navegação intuitiva
- [ ] Mensagens de erro claras
- [ ] Feedback visual adequado
- [ ] Responsividade
- [ ] Acessibilidade (WCAG AA)

### Problemas Encontrados

| Tipo | Descrição | Severidade |
|------|-----------|-----------|
| [Tipo] | [Descrição] | [Nível] |

---

## Cobertura de Código

### Frontend

| Módulo | Cobertura | Meta | Status |
|--------|-----------|------|--------|
| Components | [%] | 60% | ✅/❌ |
| Stores | [%] | 80% | ✅/❌ |
| Utils | [%] | 80% | ✅/❌ |
| **Total** | **[%]** | **70%** | **✅/❌** |

### Backend

| Módulo | Cobertura | Meta | Status |
|--------|-----------|------|--------|
| Use Cases | [%] | 85% | ✅/❌ |
| Entities | [%] | 90% | ✅/❌ |
| Repositories | [%] | 80% | ✅/❌ |
| **Total** | **[%]** | **75%** | **✅/❌** |

---

## Recomendações

### Próximas Ações

1. [Ação 1]
2. [Ação 2]
3. [Ação 3]

### Melhorias Sugeridas

- [Melhoria 1]
- [Melhoria 2]
- [Melhoria 3]

---

## Conclusão

### Status Final

[Resumo do status geral dos testes]

### Aprovação para Release

- ✅ **Aprovado** | ⚠️ **Aprovado com ressalvas** | ❌ **Não aprovado**

### Observações Finais

[Observações importantes para a equipe]

---

**Assinatura**:  
**Nome**: [NOME DO TESTER]  
**Data**: [DATA]  
**Versão do Relatório**: 1.0



