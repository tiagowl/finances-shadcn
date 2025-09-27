# Script de Workflow Automatico
# Executa um workflow completo com handoff automatico entre agentes

param(
    [Parameter(Mandatory=$true)]
    [string]$WorkflowName,
    [string]$ProjectPath = "."
)

# Verificar se o workflow existe
$workflowPath = Join-Path $PSScriptRoot "..\workflows\$WorkflowName.json"
if (!(Test-Path $workflowPath)) {
    Write-Host "Workflow '$WorkflowName' nao encontrado!" -ForegroundColor Red
    exit 1
}

# Carregar workflow
try {
    $workflow = Get-Content $workflowPath -Encoding UTF8 | ConvertFrom-Json
    Write-Host "Workflow carregado: $($workflow.workflow.name)" -ForegroundColor Green
} catch {
    Write-Host "Erro ao carregar workflow: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`nIniciando workflow automatico..." -ForegroundColor Cyan
Write-Host "Workflow: $($workflow.workflow.name)" -ForegroundColor White
Write-Host "Descricao: $($workflow.workflow.description)" -ForegroundColor White

# Executar cada fase do workflow
foreach ($phase in $workflow.workflow.phases) {
    Write-Host "`n=== FASE: $($phase.phase) ===" -ForegroundColor Yellow
    Write-Host "Agentes: $($phase.agents -join ', ')" -ForegroundColor Cyan
    Write-Host "Duracao: $($phase.duration)" -ForegroundColor White
    Write-Host "Atividades:" -ForegroundColor White
    
    foreach ($activity in $phase.activities) {
        Write-Host "  - $activity" -ForegroundColor Gray
    }
    
    Write-Host "`nOutputs esperados:" -ForegroundColor White
    foreach ($output in $phase.outputs) {
        Write-Host "  - $output" -ForegroundColor Gray
    }
    
    # Ativar agentes da fase
    foreach ($agent in $phase.agents) {
        Write-Host "`nAtivando agente: $agent" -ForegroundColor Green
        
        # Ativar agente com contexto automatico
        & "$PSScriptRoot\activate-agent.ps1" $agent $ProjectPath
        
        Write-Host "`nAgente $agent ativado com contexto automatico!" -ForegroundColor Green
        Write-Host "Use o template de prompt e inclua o contexto carregado" -ForegroundColor Cyan
        Write-Host "Quando terminar, salve o output com: ./scripts/save-output.ps1 $agent 'seu-output'" -ForegroundColor Yellow
        
        # Pausa para o usuario trabalhar com o agente
        Write-Host "`nPressione Enter quando terminar de trabalhar com este agente..." -ForegroundColor Magenta
        Read-Host
    }
    
    # Handoff automatico para proxima fase
    if ($phase -ne $workflow.workflow.phases[-1]) {
        $nextPhase = $workflow.workflow.phases[[array]::IndexOf($workflow.workflow.phases, $phase) + 1]
        
        Write-Host "`nPreparando handoff para proxima fase..." -ForegroundColor Cyan
        Write-Host "Proxima fase: $($nextPhase.phase)" -ForegroundColor White
        Write-Host "Agentes da proxima fase: $($nextPhase.agents -join ', ')" -ForegroundColor White
        
        # Fazer handoff para cada agente da proxima fase
        foreach ($nextAgent in $nextPhase.agents) {
            foreach ($currentAgent in $phase.agents) {
                Write-Host "`nFazendo handoff: $currentAgent -> $nextAgent" -ForegroundColor Green
                & "$PSScriptRoot\handoff.ps1" $currentAgent $nextAgent $ProjectPath
            }
        }
    }
}

Write-Host "`n=== WORKFLOW CONCLUIDO ===" -ForegroundColor Green
Write-Host "Todos os agentes foram ativados com contexto automatico" -ForegroundColor White
Write-Host "Outputs salvos em: outputs/" -ForegroundColor Yellow

# Exibir resumo dos outputs
Write-Host "`nResumo dos outputs gerados:" -ForegroundColor Cyan
& "$PSScriptRoot\manage-outputs.ps1" status $ProjectPath
