# Script de Handoff Automatico entre Agentes
# Transfere contexto e outputs de um agente para outro

param(
    [Parameter(Mandatory=$true)]
    [string]$FromAgent,
    [Parameter(Mandatory=$true)]
    [string]$ToAgent,
    [string]$ProjectPath = "."
)

# Verificar se os agentes existem
$availableAgents = @{
    "product-owner" = "Product Owner"
    "architect" = "Arquiteto de Software"
    "frontend-dev" = "Desenvolvedor Frontend"
    "backend-dev" = "Desenvolvedor Backend"
    "devops" = "Profissional DevOps"
    "tester" = "Tester"
    "ux" = "UX Designer"
}

if (!$availableAgents.ContainsKey($FromAgent)) {
    Write-Host "Agente de origem '$FromAgent' nao encontrado!" -ForegroundColor Red
    exit 1
}

if (!$availableAgents.ContainsKey($ToAgent)) {
    Write-Host "Agente de destino '$ToAgent' nao encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host "Transferindo contexto de $($availableAgents[$FromAgent]) para $($availableAgents[$ToAgent])" -ForegroundColor Green

# Carregar contexto do agente de origem
$fromAgentPath = Join-Path $ProjectPath "outputs\$FromAgent"
$contextFiles = @()

if (Test-Path $fromAgentPath) {
    $outputFiles = Get-ChildItem -Path $fromAgentPath -Filter "latest-*.md" | Sort-Object LastWriteTime -Descending
    
    foreach ($file in $outputFiles) {
        try {
            $content = Get-Content $file.FullName -Encoding UTF8 -Raw
            if ($content.Trim()) {
                $contextFiles += @{
                    file = $file.Name
                    content = $content
                    timestamp = $file.LastWriteTime
                }
            }
        } catch {
            Write-Host "Erro ao carregar arquivo $($file.Name): $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
}

# Criar arquivo de handoff
$handoffFile = Join-Path $ProjectPath "outputs\handoff-$FromAgent-to-$ToAgent.md"
$handoffContent = @()

$handoffContent += "# Handoff: $($availableAgents[$FromAgent]) -> $($availableAgents[$ToAgent])"
$handoffContent += "`n**Data/Hora:** $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$handoffContent += "`n**Status:** Transferencia de contexto automatica"
$handoffContent += "`n"

if ($contextFiles.Count -gt 0) {
    $handoffContent += "## Outputs Transferidos"
    $handoffContent += "`n"
    
    foreach ($context in $contextFiles) {
        $handoffContent += "### $($context.file)"
        $handoffContent += "`n**Atualizado:** $($context.timestamp.ToString('yyyy-MM-dd HH:mm:ss'))"
        $handoffContent += "`n`n$($context.content)"
        $handoffContent += "`n`n---`n"
    }
    
    $handoffContent += "`n## Instrucoes para $($availableAgents[$ToAgent])"
    $handoffContent += "`nBaseado nos outputs acima, continue o desenvolvimento considerando:"
    $handoffContent += "`n- Os requisitos e user stories definidos"
    $handoffContent += "`n- A arquitetura e tecnologias escolhidas"
    $handoffContent += "`n- Os wireframes e prototipos criados"
    $handoffContent += "`n- As implementacoes ja realizadas"
    
} else {
    $handoffContent += "## Nenhum Output Encontrado"
    $handoffContent += "`nNao foram encontrados outputs do agente $($availableAgents[$FromAgent]) para transferir."
    $handoffContent += "`nVerifique se o agente anterior salvou seus outputs corretamente."
}

$handoffContent -join "`n" | Out-File -FilePath $handoffFile -Encoding UTF8

# Ativar o agente de destino com contexto
Write-Host "`nAtivando agente de destino com contexto..." -ForegroundColor Cyan
& "$PSScriptRoot\activate-agent.ps1" $ToAgent $ProjectPath

# Exibir resumo do handoff
Write-Host "`nHandoff concluido!" -ForegroundColor Green
Write-Host "Arquivo de handoff: $handoffFile" -ForegroundColor Yellow
Write-Host "Outputs transferidos: $($contextFiles.Count)" -ForegroundColor White

if ($contextFiles.Count -gt 0) {
    Write-Host "`nOutputs transferidos:" -ForegroundColor Cyan
    foreach ($context in $contextFiles) {
        Write-Host "  - $($context.file)" -ForegroundColor White
    }
}

Write-Host "`nProximo passo: Use o template de prompt do $($availableAgents[$ToAgent]) com o contexto carregado" -ForegroundColor Green
