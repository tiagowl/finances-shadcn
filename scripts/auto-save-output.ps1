# Script para Salvar Output Automaticamente
# Salva output baseado no agente ativo

param(
    [Parameter(Mandatory=$true)]
    [string]$OutputContent,
    [string]$FileName = "output.md",
    [string]$ProjectPath = "."
)

# Verificar se há agente ativo
$activeAgentPath = Join-Path $ProjectPath ".active-agent"
if (!(Test-Path $activeAgentPath)) {
    Write-Host "Nenhum agente ativo encontrado!" -ForegroundColor Red
    Write-Host "Execute primeiro: ./scripts/activate-agent.ps1 [agent-name]" -ForegroundColor Yellow
    exit 1
}

# Carregar agente ativo
try {
    $activeAgent = Get-Content $activeAgentPath -Encoding UTF8 | ConvertFrom-Json
    $agentName = $activeAgent.agent
} catch {
    Write-Host "Erro ao carregar agente ativo: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Usar o script save-output.ps1 com o agente ativo
Write-Host "Salvando output para agente ativo: $agentName" -ForegroundColor Cyan
& "$PSScriptRoot\save-output.ps1" $agentName $OutputContent $FileName $ProjectPath
