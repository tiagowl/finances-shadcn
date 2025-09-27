# Script Simplificado para Salvar Outputs
# Salva output do agente ativo de forma mais simples

param(
    [Parameter(Mandatory=$true)]
    [string]$Content,
    [string]$File = "output.md"
)

# Verificar se há agente ativo
$activeAgentPath = ".active-agent"
if (!(Test-Path $activeAgentPath)) {
    Write-Host "❌ Nenhum agente ativo!" -ForegroundColor Red
    Write-Host "Execute primeiro: ./scripts/activate-agent.ps1 [agent-name]" -ForegroundColor Yellow
    exit 1
}

# Carregar agente ativo
try {
    $activeAgent = Get-Content $activeAgentPath -Encoding UTF8 | ConvertFrom-Json
    $agentName = $activeAgent.agent
    $agentDisplayName = $activeAgent.name
} catch {
    Write-Host "❌ Erro ao carregar agente ativo" -ForegroundColor Red
    exit 1
}

Write-Host "💾 Salvando output para: $agentDisplayName" -ForegroundColor Green

# Usar o script save-output.ps1
& "$PSScriptRoot\save-output.ps1" $agentName $Content $File

Write-Host "`nOutput salvo com sucesso!" -ForegroundColor Green
Write-Host "Pasta: outputs\$agentName" -ForegroundColor Cyan
Write-Host "Arquivo: $File" -ForegroundColor Cyan
