# Script para Salvar Outputs dos Agentes
# Salva outputs de um agente para compartilhamento com outros agentes

param(
    [Parameter(Mandatory=$true)]
    [string]$AgentName,
    [Parameter(Mandatory=$true)]
    [string]$OutputContent,
    [string]$FileName = "output.md",
    [string]$ProjectPath = "."
)

# Verificar se o agente existe
$availableAgents = @{
    "product-owner" = "Product Owner"
    "architect" = "Arquiteto de Software"
    "frontend-dev" = "Desenvolvedor Frontend"
    "backend-dev" = "Desenvolvedor Backend"
    "devops" = "Profissional DevOps"
    "tester" = "Tester"
    "ux" = "UX Designer"
}

if (!$availableAgents.ContainsKey($AgentName)) {
    Write-Host "Agente '$AgentName' nao encontrado!" -ForegroundColor Red
    exit 1
}

# Criar diretorio do agente se nao existir
$agentOutputPath = Join-Path $ProjectPath "outputs\$AgentName"
if (!(Test-Path $agentOutputPath)) {
    New-Item -ItemType Directory -Path $agentOutputPath -Force | Out-Null
}

# Salvar output com timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$outputFile = Join-Path $agentOutputPath "$timestamp-$FileName"
$OutputContent | Out-File -FilePath $outputFile -Encoding UTF8

# Criar arquivo de output mais recente
$latestFile = Join-Path $agentOutputPath "latest-$FileName"
$OutputContent | Out-File -FilePath $latestFile -Encoding UTF8

# Atualizar arquivo de contexto do agente
$contextFile = Join-Path $agentOutputPath "context.json"

# Carregar contexto existente se houver
$context = @{
    agent = $AgentName
    last_output = $FileName
    last_updated = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    output_files = @()
}

if (Test-Path $contextFile) {
    try {
        $existingContext = Get-Content $contextFile -Encoding UTF8 | ConvertFrom-Json
        if ($existingContext.output_files) {
            $context.output_files = $existingContext.output_files
        }
    } catch {
        Write-Host "Aviso: Nao foi possivel carregar contexto existente" -ForegroundColor Yellow
    }
}

# Adicionar arquivo atual à lista
$newFile = @{
    file = $FileName
    timestamp = $timestamp
    path = $outputFile
}

$context.output_files += $newFile
$context.last_output = $FileName
$context.last_updated = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

$context | ConvertTo-Json -Depth 3 | Out-File -FilePath $contextFile -Encoding UTF8

Write-Host "Output salvo com sucesso!" -ForegroundColor Green
Write-Host "Arquivo: $outputFile" -ForegroundColor Yellow
Write-Host "Latest: $latestFile" -ForegroundColor Yellow
