# 🤖 Guia de Automação de Outputs

Este guia explica como usar o sistema de compartilhamento automático de outputs entre agentes.

## 🎯 Visão Geral

O sistema de automação permite que agentes compartilhem outputs automaticamente, criando um fluxo de trabalho contínuo onde cada agente tem acesso aos resultados dos agentes anteriores.

## 📁 Estrutura de Outputs

```
outputs/
├── product-owner/          # Outputs do Product Owner
│   ├── latest-*.md        # Output mais recente
│   ├── context.json        # Metadados do agente
│   └── [timestamp]-*.md    # Outputs históricos
├── architect/              # Outputs do Arquiteto
├── frontend-dev/           # Outputs do Frontend Dev
├── backend-dev/            # Outputs do Backend Dev
├── devops/                 # Outputs do DevOps
├── tester/                 # Outputs do Tester
└── ux/                     # Outputs do UX Designer
```

## 🚀 Como Usar

### 1. Salvar Outputs de um Agente

```powershell
# Salvar output do Product Owner
./scripts/save-output.ps1 product-owner "Conteúdo do output aqui" "user-stories.md"

# Salvar output do Arquiteto
./scripts/save-output.ps1 architect "Arquitetura definida..." "architecture-diagram.md"
```

### 2. Carregar Contexto Automático

```powershell
# Ativar agente com contexto automático
./scripts/activate-agent.ps1 architect

# Ou carregar contexto manualmente
./scripts/load-context.ps1 architect
```

### 3. Handoff Automático entre Agentes

```powershell
# Transferir contexto do Product Owner para o Arquiteto
./scripts/handoff.ps1 product-owner architect

# Transferir contexto do Arquiteto para o Frontend Dev
./scripts/handoff.ps1 architect frontend-dev
```

### 4. Workflow Automático Completo

```powershell
# Executar workflow completo com handoff automático
./scripts/auto-workflow.ps1 complete-development
```

## 🔧 Scripts Disponíveis

### save-output.ps1
Salva outputs de um agente para compartilhamento.

**Parâmetros:**
- `AgentName`: Nome do agente (obrigatório)
- `OutputContent`: Conteúdo do output (obrigatório)
- `FileName`: Nome do arquivo (opcional, padrão: "output.md")
- `ProjectPath`: Caminho do projeto (opcional, padrão: ".")

**Exemplo:**
```powershell
./scripts/save-output.ps1 product-owner "User stories definidas..." "user-stories.md"
```

### load-context.ps1
Carrega contexto automático de agentes anteriores.

**Parâmetros:**
- `CurrentAgent`: Agente atual (obrigatório)
- `ProjectPath`: Caminho do projeto (opcional, padrão: ".")

**Exemplo:**
```powershell
./scripts/load-context.ps1 architect
```

### handoff.ps1
Transfere contexto de um agente para outro.

**Parâmetros:**
- `FromAgent`: Agente de origem (obrigatório)
- `ToAgent`: Agente de destino (obrigatório)
- `ProjectPath`: Caminho do projeto (opcional, padrão: ".")

**Exemplo:**
```powershell
./scripts/handoff.ps1 product-owner architect
```

### manage-outputs.ps1
Gerencia outputs dos agentes.

**Parâmetros:**
- `Action`: Ação a executar (list, clean, export, import, status)
- `AgentName`: Nome do agente (opcional)
- `ProjectPath`: Caminho do projeto (opcional, padrão: ".")

**Exemplos:**
```powershell
./scripts/manage-outputs.ps1 list          # Listar todos os outputs
./scripts/manage-outputs.ps1 clean         # Limpar outputs antigos
./scripts/manage-outputs.ps1 export        # Exportar outputs
./scripts/manage-outputs.ps1 import        # Importar outputs
./scripts/manage-outputs.ps1 status        # Status dos outputs
```

### auto-workflow.ps1
Executa workflow completo com handoff automático.

**Parâmetros:**
- `WorkflowName`: Nome do workflow (obrigatório)
- `ProjectPath`: Caminho do projeto (opcional, padrão: ".")

**Exemplo:**
```powershell
./scripts/auto-workflow.ps1 complete-development
```

## 🔄 Fluxo de Trabalho Típico

### 1. Desenvolvimento Manual com Contexto

```powershell
# 1. Ativar Product Owner
./scripts/activate-agent.ps1 product-owner
# Trabalhar com o agente e salvar output
./scripts/save-output.ps1 product-owner "User stories criadas..." "user-stories.md"

# 2. Ativar Arquiteto (com contexto automático)
./scripts/activate-agent.ps1 architect
# O contexto do Product Owner será carregado automaticamente
# Trabalhar com o agente e salvar output
./scripts/save-output.ps1 architect "Arquitetura definida..." "architecture.md"

# 3. Continuar com outros agentes...
```

### 2. Workflow Automático

```powershell
# Executar workflow completo
./scripts/auto-workflow.ps1 complete-development
# O sistema irá:
# - Ativar cada agente com contexto automático
# - Fazer handoff entre fases
# - Gerenciar outputs automaticamente
```

## 📋 Dependências Automáticas

O sistema carrega automaticamente outputs de agentes anteriores baseado nas dependências:

- **Product Owner**: Nenhuma dependência
- **Arquiteto**: Carrega outputs do Product Owner
- **Frontend Dev**: Carrega outputs do Product Owner, Arquiteto e UX
- **Backend Dev**: Carrega outputs do Product Owner e Arquiteto
- **DevOps**: Carrega outputs do Arquiteto e Backend Dev
- **Tester**: Carrega outputs do Product Owner, Frontend Dev e Backend Dev
- **UX Designer**: Carrega outputs do Product Owner

## 🎯 Benefícios

- **Contexto Automático**: Agentes têm acesso aos outputs anteriores
- **Handoff Automático**: Transferência automática de contexto entre agentes
- **Workflow Contínuo**: Processo fluido sem interrupções manuais
- **Rastreabilidade**: Histórico completo de outputs e dependências
- **Flexibilidade**: Pode ser usado manualmente ou automaticamente

## 🔧 Personalização

### Modificar Dependências

Edite o arquivo `scripts/load-context.ps1` para alterar as dependências:

```powershell
$dependencies = @{
    "product-owner" = @()
    "architect" = @("product-owner")
    "frontend-dev" = @("product-owner", "architect", "ux")
    # ... outras dependências
}
```

### Adicionar Novos Agentes

1. Crie a configuração do agente em `agents/[agent-name]/config.json`
2. Adicione o agente às dependências em `load-context.ps1`
3. Crie o template de prompt em `templates/[agent-name]-prompt.md`

## 🚨 Troubleshooting

### Problemas Comuns

1. **Contexto não carregado**: Verifique se os outputs foram salvos corretamente
2. **Handoff falhou**: Verifique se os agentes existem e têm outputs
3. **Arquivo não encontrado**: Verifique se a estrutura de diretórios está correta

### Comandos de Diagnóstico

```powershell
# Verificar status dos outputs
./scripts/manage-outputs.ps1 status

# Listar todos os outputs
./scripts/manage-outputs.ps1 list

# Limpar outputs antigos
./scripts/manage-outputs.ps1 clean
```

## 📚 Exemplos Práticos

### Exemplo 1: E-commerce Completo

```powershell
# 1. Iniciar workflow
./scripts/start-workflow.ps1 complete-development

# 2. Product Owner
./scripts/activate-agent.ps1 product-owner
# Trabalhar e salvar
./scripts/save-output.ps1 product-owner "Requisitos do e-commerce..." "requirements.md"

# 3. UX Designer
./scripts/activate-agent.ps1 ux
# Contexto do Product Owner carregado automaticamente
# Trabalhar e salvar
./scripts/save-output.ps1 ux "Wireframes do e-commerce..." "wireframes.md"

# 4. Arquiteto
./scripts/activate-agent.ps1 architect
# Contexto do Product Owner e UX carregado automaticamente
# Trabalhar e salvar
./scripts/save-output.ps1 architect "Arquitetura do e-commerce..." "architecture.md"

# 5. Continuar com outros agentes...
```

### Exemplo 2: Correção de Bug

```powershell
# 1. Tester
./scripts/activate-agent.ps1 tester
# Trabalhar e salvar
./scripts/save-output.ps1 tester "Bug identificado..." "bug-report.md"

# 2. Backend Dev (com contexto do Tester)
./scripts/activate-agent.ps1 backend-dev
# Contexto do Tester carregado automaticamente
# Trabalhar e salvar
./scripts/save-output.ps1 backend-dev "Correção implementada..." "fix.md"
```

## 🎉 Conclusão

O sistema de automação de outputs permite um fluxo de trabalho contínuo e eficiente, onde cada agente tem acesso ao contexto completo dos agentes anteriores, eliminando a necessidade de transferência manual de informações.
