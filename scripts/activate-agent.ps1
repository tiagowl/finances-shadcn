# Script para Ativar um Agente Especifico
# Ativa um agente e carrega sua configuracao

param(
    [Parameter(Mandatory=$true)]
    [string]$AgentName,
    [string]$ProjectPath = "."
)

# Lista de agentes disponiveis
$availableAgents = @{
    "product-owner" = "Product Owner"
    "architect" = "Arquiteto de Software"
    "frontend-dev" = "Desenvolvedor Frontend"
    "backend-dev" = "Desenvolvedor Backend"
    "devops" = "Profissional DevOps"
    "tester" = "Tester"
    "ux" = "UX Designer"
}

# Verificar se o agente existe
if (!$availableAgents.ContainsKey($AgentName)) {
    Write-Host "Agente '$AgentName' nao encontrado!" -ForegroundColor Red
    Write-Host "Agentes disponiveis:" -ForegroundColor Yellow
    foreach ($agent in $availableAgents.GetEnumerator()) {
        Write-Host "  - $($agent.Key): $($agent.Value)" -ForegroundColor Cyan
    }
    exit 1
}

Write-Host "Ativando agente: $($availableAgents[$AgentName])" -ForegroundColor Green

# Carregar configuracao do agente
$configPath = Join-Path $PSScriptRoot "..\agents\$AgentName\config.json"
if (Test-Path $configPath) {
    try {
        $config = Get-Content $configPath -Encoding UTF8 | ConvertFrom-Json
        Write-Host "Configuracao carregada" -ForegroundColor Yellow
    } catch {
        Write-Host "Erro ao carregar configuracao: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
    
    # Exibir informacoes do agente
    Write-Host "`nInformacoes do Agente:" -ForegroundColor Cyan
    Write-Host "Nome: $($config.agent.name)" -ForegroundColor White
    Write-Host "Descricao: $($config.agent.description)" -ForegroundColor White
    Write-Host "Expertise: $($config.agent.expertise -join ', ')" -ForegroundColor White
    
    # Exibir workflow steps
    Write-Host "`nWorkflow Steps:" -ForegroundColor Cyan
    foreach ($step in $config.agent.workflow_steps) {
        Write-Host "  $step" -ForegroundColor White
    }
    
    # Exibir outputs esperados
    Write-Host "`nOutputs Esperados:" -ForegroundColor Cyan
    foreach ($output in $config.agent.outputs) {
        Write-Host "  - $output" -ForegroundColor White
    }
    
    # Exibir colaboracoes
    Write-Host "`nColaboracoes:" -ForegroundColor Cyan
    Write-Host "Trabalha com: $($config.agent.collaboration.works_with -join ', ')" -ForegroundColor White
    Write-Host "Recebe de: $($config.agent.collaboration.receives_from -join ', ')" -ForegroundColor White
    Write-Host "Fornece para: $($config.agent.collaboration.provides_to -join ', ')" -ForegroundColor White
    
} else {
    Write-Host "Arquivo de configuracao nao encontrado: $configPath" -ForegroundColor Red
    exit 1
}

# Carregar contexto automatico de agentes anteriores
Write-Host "`nCarregando contexto automatico..." -ForegroundColor Cyan
$contextResult = & "$PSScriptRoot\load-context.ps1" $AgentName $ProjectPath

if ($contextResult.has_context) {
    Write-Host "Contexto carregado com sucesso!" -ForegroundColor Green
    Write-Host "Arquivo de contexto: $($contextResult.context_file)" -ForegroundColor Yellow
    Write-Host "Outputs carregados: $($contextResult.loaded_outputs.Count)" -ForegroundColor White
} else {
    Write-Host "Nenhum contexto anterior encontrado" -ForegroundColor Yellow
}

# Carregar template de prompt
$templatePath = Join-Path $PSScriptRoot "..\templates\$AgentName-prompt.md"
if (Test-Path $templatePath) {
    Write-Host "`nTemplate de Prompt carregado:" -ForegroundColor Cyan
    Write-Host "Arquivo: $templatePath" -ForegroundColor Yellow
    
    if ($contextResult.has_context) {
        Write-Host "`nContexto automatico disponivel:" -ForegroundColor Green
        Write-Host "Arquivo: $($contextResult.context_file)" -ForegroundColor Yellow
        Write-Host "`nPara usar este agente com contexto automatico:" -ForegroundColor Cyan
        Write-Host "1. Copie o template de prompt" -ForegroundColor White
        Write-Host "2. Inclua o contexto automatico no seu prompt" -ForegroundColor White
        Write-Host "3. Adapte para sua necessidade especifica" -ForegroundColor White
    } else {
        Write-Host "`nPara usar este agente, copie o template de prompt e adapte para sua necessidade." -ForegroundColor Green
    }
} else {
    Write-Host "Template de prompt nao encontrado: $templatePath" -ForegroundColor Yellow
}

# Criar arquivo de contexto do agente ativo
$activeAgentPath = Join-Path $ProjectPath ".active-agent"
$activeAgentInfo = @{
    agent = $AgentName
    name = $config.agent.name
    activated_at = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    config_path = $configPath
    template_path = $templatePath
} | ConvertTo-Json -Depth 2

$activeAgentInfo | Out-File -FilePath $activeAgentPath -Encoding UTF8

Write-Host "`nAgente ativado com sucesso!" -ForegroundColor Green
Write-Host "Contexto salvo em: .active-agent" -ForegroundColor Yellow
Write-Host "`nDica: Use o template de prompt para comecar a trabalhar com este agente." -ForegroundColor Cyan
