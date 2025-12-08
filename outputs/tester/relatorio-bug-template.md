# Template de Relatório de Bug

## Informações Gerais

**ID do Bug**: BUG-XXX  
**Data de Identificação**: [DATA]  
**Identificado por**: [NOME]  
**Status**: Aberto / Em Análise / Em Correção / Teste / Fechado  
**Versão**: [VERSÃO]

---

## Classificação

### Severidade
- 🔴 **Crítica (P0)**: Sistema inacessível, perda de dados
- 🟠 **Alta (P1)**: Funcionalidade principal quebrada
- 🟡 **Média (P2)**: Funcionalidade secundária com impacto
- 🟢 **Baixa (P3)**: Melhoria, bug cosmético

**Severidade Atual**: [Selecionar]

### Prioridade
- 🔴 **Crítica (P0)**: Deve ser corrigido imediatamente
- 🟠 **Alta (P1)**: Corrigir antes do próximo release
- 🟡 **Média (P2)**: Corrigir quando possível
- 🟢 **Baixa (P3)**: Melhoria futura

**Prioridade Atual**: [Selecionar]

### Tipo
- [ ] Funcional
- [ ] Performance
- [ ] Segurança
- [ ] Usabilidade
- [ ] Interface
- [ ] Integração
- [ ] Dados

---

## Descrição

### Título
[Descrição curta e objetiva do problema]

### User Story Relacionada
US-XXX: [Nome da User Story]

### Descrição Detalhada
[Descrever o problema de forma clara e completa]

### Ambiente
- **SO**: [Windows/Mac/Linux]
- **Navegador**: [Chrome/Firefox/Safari/Edge] [Versão]
- **Dispositivo**: [Desktop/Mobile/Tablet] [Resolução]
- **Ambiente**: [DEV/STAGING/PROD]
- **URL**: [URL onde ocorreu]

---

## Passos para Reproduzir

1. [Passo 1]
2. [Passo 2]
3. [Passo 3]
4. ...

### Pré-condições
- [Condição 1]
- [Condição 2]

---

## Comportamento Esperado

[Descrever o que deveria acontecer]

**Exemplo**:
Ao clicar em "Salvar", a categoria deve ser criada e a lista deve ser atualizada automaticamente.

---

## Comportamento Atual

[Descrever o que realmente acontece]

**Exemplo**:
Ao clicar em "Salvar", aparece erro 500 e a categoria não é criada.

---

## Evidências

### Screenshots
[Inserir screenshots ou anexar arquivos]

### Logs
```
[Inserir logs relevantes]
```

### Mensagens de Erro
```
[Inserir mensagens de erro exatas]
```

### Console do Navegador
```
[Inserir erros do console se aplicável]
```

### Network (se aplicável)
```
[Inserir informações de requisições HTTP]
```

---

## Impacto

### Impacto no Usuário
- [ ] Alto: Usuário não consegue usar a funcionalidade
- [ ] Médio: Funcionalidade parcialmente quebrada
- [ ] Baixo: Pequeno inconveniente

### Usuários Afetados
- [ ] Todos os usuários
- [ ] Alguns usuários (especificar condições)
- [ ] Apenas em certas condições

### Frequência
- [ ] Sempre ocorre
- [ ] Ocorre frequentemente
- [ ] Ocorre raramente
- [ ] Apenas em certas condições

---

## Dados de Teste

### Dados Utilizados
```
[Inserir dados específicos usados para reproduzir]
```

### Usuário de Teste
- Email: [email]
- ID: [id]

---

## Análise Técnica (Preenchido pelo Desenvolvedor)

### Causa Raiz
[Análise da causa do problema]

### Localização do Código
- **Arquivo**: [caminho do arquivo]
- **Linha**: [linha aproximada]
- **Módulo**: [módulo/componente]

### Solução Proposta
[Descrição da solução a ser implementada]

---

## Correção (Preenchido pelo Desenvolvedor)

### Solução Implementada
[Descrição da correção implementada]

### Arquivos Modificados
- [arquivo1.ts]
- [arquivo2.tsx]

### Commits Relacionados
- [hash do commit] - [mensagem]

---

## Validação (Preenchido pelo Tester)

### Teste de Regressão
- [ ] Teste original passa
- [ ] Testes relacionados passam
- [ ] Não introduziu novos bugs

### Observações do Teste
[Observações do teste de validação]

---

## Histórico

| Data | Ação | Responsável | Observações |
|------|------|-------------|-------------|
| [DATA] | Bug identificado | [NOME] | [Observações] |
| [DATA] | Em análise | [NOME] | [Observações] |
| [DATA] | Em correção | [NOME] | [Observações] |
| [DATA] | Em teste | [NOME] | [Observações] |
| [DATA] | Fechado | [NOME] | [Observações] |

---

## Anexos

- [ ] Screenshots
- [ ] Logs
- [ ] Vídeo de reprodução
- [ ] Dados de teste
- [ ] Outros arquivos relevantes

---

## Exemplo Completo

### BUG-001: Erro 500 ao criar categoria sem orçamento

**Severidade**: Alta (P1)  
**Prioridade**: Alta (P1)  
**User Story**: US-023

**Descrição**:
Ao tentar criar uma categoria deixando o campo "Orçamento Máximo" vazio, o sistema retorna erro 500 ao invés de exibir mensagem de validação.

**Passos para Reproduzir**:
1. Fazer login no sistema
2. Navegar para página de Categorias
3. Clicar em "Adicionar Categoria"
4. Preencher apenas o nome: "Teste"
5. Deixar campo "Orçamento Máximo" vazio
6. Clicar em "Salvar"

**Comportamento Esperado**:
Sistema deve validar e exibir mensagem: "Orçamento é obrigatório"

**Comportamento Atual**:
Sistema retorna erro 500 (Internal Server Error) e toast com mensagem genérica.

**Evidências**:
- Screenshot: [anexo]
- Log: [anexo]
- Console: Error 500 - POST /api/categories

**Ambiente**:
- Chrome 120
- Windows 11
- Ambiente: DEV

---

**Versão do Template**: 1.0



