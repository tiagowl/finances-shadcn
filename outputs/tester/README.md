# Documentação de Testes - Sistema de Controle Financeiro

## Visão Geral

Esta pasta contém toda a documentação de testes do Sistema de Controle Financeiro, incluindo planos, casos de teste, scripts de automação, dados de teste e relatórios.

## Estrutura de Documentos

### 📋 Planejamento

- **[plano-teste-geral.md](./plano-teste-geral.md)**: Plano completo de testes do sistema
- **[resumo-consolidado-testes.md](./resumo-consolidado-testes.md)**: Resumo consolidado de todos os testes
- **[checklist-teste-geral.md](./checklist-teste-geral.md)**: Checklist geral para validação

### 📝 Casos de Teste

- **[casos-teste-sprint-0.md](./casos-teste-sprint-0.md)**: Casos de teste para Sprint 0 (Fundação)
- **[casos-teste-sprint-1.md](./casos-teste-sprint-1.md)**: Casos de teste para Sprint 1 (Core Financeiro)
- **[casos-teste-sprint-2.md](./casos-teste-sprint-2.md)**: Casos de teste para Sprint 2 (Organização)
- **[casos-teste-sprint-3.md](./casos-teste-sprint-3.md)**: Casos de teste para Sprint 3 (Edição/Exclusão)
- **[casos-teste-sprint-4.md](./casos-teste-sprint-4.md)**: Casos de teste para Sprint 4 (Recorrentes)
- **[casos-teste-sprint-5.md](./casos-teste-sprint-5.md)**: Casos de teste para Sprint 5 (Planejamento)
- **[casos-teste-sprint-6.md](./casos-teste-sprint-6.md)**: Casos de teste para Sprint 6 (Funcionalidades Adicionais)

### 🤖 Scripts de Automação

- **[scripts-automacao-unitarios.md](./scripts-automacao-unitarios.md)**: Scripts para testes unitários
- **[scripts-automacao-integracao.md](./scripts-automacao-integracao.md)**: Scripts para testes de integração
- **[scripts-automacao-e2e.md](./scripts-automacao-e2e.md)**: Scripts para testes E2E
- **[scripts-automacao-performance.md](./scripts-automacao-performance.md)**: Scripts para testes de performance

### 📊 Dados e Relatórios

- **[dados-teste.md](./dados-teste.md)**: Dados padronizados para testes
- **[relatorio-teste-template.md](./relatorio-teste-template.md)**: Template de relatório de teste
- **[relatorio-bug-template.md](./relatorio-bug-template.md)**: Template de relatório de bug

## Estatísticas

- **Total de Casos de Teste**: ~142
- **Sprints Cobertos**: 7 (Sprint 0 a Sprint 6)
- **User Stories Cobertas**: 46
- **Tipos de Teste**: Unitários, Integração, E2E, Performance, Segurança

## Como Usar Esta Documentação

### Para Desenvolvedores

1. **Durante Desenvolvimento**:
   - Consulte casos de teste da sprint atual
   - Use dados de teste padronizados
   - Implemente scripts de automação correspondentes

2. **Antes de Merge**:
   - Execute testes unitários e de integração
   - Valide critérios de aceitação
   - Consulte checklist geral

### Para Testers

1. **Execução de Testes**:
   - Consulte casos de teste por sprint
   - Use dados de teste fornecidos
   - Preencha relatórios usando templates

2. **Reporte de Bugs**:
   - Use template de relatório de bug
   - Documente passos para reproduzir
   - Classifique severidade e prioridade

### Para Product Owner

1. **Validação de Features**:
   - Consulte critérios de aceitação nos casos de teste
   - Valide através dos relatórios de teste
   - Use checklist para aprovação de release

## Guia Rápido por Sprint

### Sprint 0: Fundação
- 25 casos de teste
- Foco: Autenticação e Layout
- Arquivo: `casos-teste-sprint-0.md`

### Sprint 1: Core Financeiro
- 34 casos de teste
- Foco: Receitas, Despesas, Dashboard
- Arquivo: `casos-teste-sprint-1.md`

### Sprint 2: Organização
- 18 casos de teste
- Foco: Categorias e Orçamentos
- Arquivo: `casos-teste-sprint-2.md`

### Sprint 3: Edição/Exclusão
- 15 casos de teste
- Foco: CRUD Completo
- Arquivo: `casos-teste-sprint-3.md`

### Sprint 4: Recorrentes
- ~15 casos de teste
- Foco: Despesas/Receitas Mensais
- Arquivo: `casos-teste-sprint-4.md`

### Sprint 5: Planejamento
- ~17 casos de teste
- Foco: Simulação e Projeção
- Arquivo: `casos-teste-sprint-5.md`

### Sprint 6: Funcionalidades Adicionais
- ~18 casos de teste
- Foco: Desejos e Lista de Compras
- Arquivo: `casos-teste-sprint-6.md`

## Métricas de Qualidade

### Cobertura de Código
- **Frontend**: Meta 70% (Crítico: 90%)
- **Backend**: Meta 75% (Crítico: 90%)

### Performance
- **API Response Time**: < 2s (p95)
- **Frontend Load Time**: < 3s
- **Database Query**: < 100ms (p95)

### Taxa de Sucesso
- **Testes Unitários**: 100%
- **Testes de Integração**: 100%
- **Testes E2E**: > 95%

## Processo de Teste

1. **Planejamento**: Revisar casos de teste da sprint
2. **Preparação**: Configurar dados de teste
3. **Execução**: Executar testes (manuais e automatizados)
4. **Documentação**: Preencher relatórios usando templates
5. **Validação**: Validar correções e retestar

## Contato

Para dúvidas sobre testes:
- Consultar documentação técnica: `../architect/documentacao-tecnica.md`
- Consultar critérios de aceitação: `../product-owner/criterios-aceitacao.md`
- Consultar user stories: `../product-owner/user-stories.md`

---

**Versão da Documentação**: 1.0  
**Última Atualização**: 2024  
**Responsável**: Equipe de Testes



