# Relatório de Bugs Encontrados

**Data**: 2024-12-19  
**Ambiente**: Desenvolvimento  
**Versão Testada**: 1.0.0-dev

## Resumo

| Severidade | Quantidade |
|------------|------------|
| Crítica | 0 |
| Alta | 0 |
| Média | 1 |
| Baixa | 1 |
| **Total** | **2** |

---

## BUG-001: Validação de Data Futura em Expense Schema

**Severidade**: Média  
**Prioridade**: Média  
**Status**: Aberto  
**Encontrado em**: 2024-12-19  
**Arquivo**: `src/frontend/src/utils/validators.ts`

### Descrição

A validação de data futura no schema de despesas (`expenseSchema`) não está rejeitando corretamente datas futuras. O teste `expenseSchema - should reject future date` está falhando porque a validação não está funcionando como esperado.

### Passos para Reproduzir

1. Criar um teste que tenta validar uma despesa com data futura:
```typescript
const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 1);
const invalidData = {
  name: 'Supermercado',
  amount: 500,
  date: futureDate.toISOString(),
  categoryId: 'category-123',
};
expect(() => expenseSchema.parse(invalidData)).toThrow();
```

2. Executar o teste
3. Observar que o teste falha porque a validação não lança erro

### Resultado Esperado

A validação deve rejeitar datas futuras e lançar um erro de validação do Zod.

### Resultado Atual

A validação aceita datas futuras sem lançar erro.

### Código Problemático

```typescript
// src/frontend/src/utils/validators.ts
export const expenseSchema = z.object({
  // ...
  date: z.string().refine((date) => {
    const dateObj = new Date(date);
    return dateObj <= new Date();
  }, 'Data não pode ser futura'),
  // ...
});
```

### Causa Raiz Provável

A comparação de datas pode estar falhando devido a diferenças de timezone ou formato. O `new Date()` pode estar criando um objeto com horário diferente do `new Date(date)`.

### Impacto

- Usuários podem criar despesas com datas futuras, o que pode causar inconsistências nos relatórios
- Impacto em relatórios e cálculos financeiros que assumem que despesas têm apenas datas passadas/presentes

### Sugestão de Correção

```typescript
date: z.string().refine((date) => {
  const dateObj = new Date(date);
  const now = new Date();
  // Comparar apenas a data, ignorando hora
  dateObj.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return dateObj <= now;
}, 'Data não pode ser futura'),
```

### Teste de Validação

Após a correção, executar:
- Teste unitário: `expenseSchema - should reject future date`
- Teste manual: Tentar criar despesa com data futura na UI

### Notas

- Mesmo problema pode existir em `revenueSchema`
- Verificar se há lógica de validação de data similar em outros schemas

---

## BUG-002: Ausência de Testes de Integração para Autenticação

**Severidade**: Baixa  
**Prioridade**: Baixa  
**Status**: Aberto  
**Tipo**: Gap de Cobertura  
**Encontrado em**: 2024-12-19

### Descrição

Não existem testes de integração para os endpoints de autenticação (`/api/auth/login` e `/api/auth/register`). Estes são endpoints críticos do sistema e devem ter cobertura de testes.

### Endpoints Afetados

- `POST /api/auth/register` - Registro de novo usuário
- `POST /api/auth/login` - Login de usuário existente

### Impacto

- Falta de garantia de que os endpoints de autenticação funcionam corretamente
- Possibilidade de regressões não detectadas em funcionalidades críticas
- Dificuldade em validar correções e melhorias nestes endpoints

### Cenários que Devem ser Testados

1. **Registro de Usuário**:
   - Registro com dados válidos
   - Registro com email duplicado
   - Registro com dados inválidos (validação)
   - Registro com senha fraca

2. **Login**:
   - Login com credenciais válidas
   - Login com credenciais inválidas
   - Login com email não cadastrado
   - Login com senha incorreta
   - Geração e retorno do token JWT

### Sugestão de Implementação

Criar arquivo `src/backend/tests/integration/auth.routes.test.ts` com testes para ambos os endpoints.

### Notas

Este não é um bug funcional, mas sim uma lacuna na cobertura de testes. Recomendado para implementação após correção do BUG-001.

---

## Estatísticas de Bugs

### Por Módulo

| Módulo | Quantidade |
|--------|------------|
| Frontend - Validators | 1 |
| Backend - Testes | 1 |

### Por Tipo

| Tipo | Quantidade |
|------|------------|
| Bug Funcional | 1 |
| Gap de Cobertura | 1 |

### Status dos Bugs

- **Aberto**: 2
- **Em Análise**: 0
- **Em Correção**: 0
- **Em Teste**: 0
- **Fechado**: 0

---

## Resumo de Execução de Testes

### Testes Executados

- **Total de Testes**: 64
- **Testes Passaram**: 62 (96.88%)
- **Testes Falharam**: 1 (1.56%)
- **Testes Ignorados**: 1 (1.56%)

### Cobertura por Sprint

- **Sprint 0**: 8/8 testes passaram ✅
- **Sprint 1**: 19/19 testes passaram ✅
- **Sprint 2**: 9/9 testes passaram ✅
- **Sprint 3**: 6/6 testes passaram ✅
- **Sprint 4**: 3/3 testes passaram ✅
- **Sprint 5**: 0/0 testes (não implementados) ⏭️
- **Sprint 6**: 3/3 testes passaram ✅

### Funcionalidades Testadas

- ✅ Autenticação (Login e Cadastro)
- ✅ Dashboard
- ✅ Receitas (CRUD completo)
- ✅ Despesas (CRUD completo)
- ✅ Categorias (CRUD completo com estatísticas)
- ✅ Despesas Mensais (básico)
- ✅ Receitas Mensais (básico)
- ✅ Lista de Desejos (básico + purchase)
- ⏭️ Simulação (não testado)
- ⏭️ Lista de Compras (não testado)

---

**Próximas Ações**:

1. ✅ Priorizar correção do BUG-001 (validação de data)
2. ✅ Implementar testes de integração para autenticação (BUG-002) - **CONCLUÍDO**
3. Re-executar testes após correções
4. Validar que não há regressões

---

**Relatório gerado automaticamente pelo sistema de testes**

