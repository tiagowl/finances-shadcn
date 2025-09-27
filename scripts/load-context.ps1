# Script para Carregar Contexto Automatico
# Carrega outputs de agentes anteriores para o agente atual

param(
    [Parameter(Mandatory=$true)]
    [string]$CurrentAgent,
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

if (!$availableAgents.ContainsKey($CurrentAgent)) {
    Write-Host "Agente '$CurrentAgent' nao encontrado!" -ForegroundColor Red
    exit 1
}

# Definir dependencias baseadas na configuracao dos agentes
$dependencies = @{
    "product-owner" = @()
    "architect" = @("product-owner")
    "frontend-dev" = @("product-owner", "architect", "ux")
    "backend-dev" = @("product-owner", "architect")
    "devops" = @("architect", "backend-dev")
    "tester" = @("product-owner", "frontend-dev", "backend-dev")
    "ux" = @("product-owner")
}

# Carregar outputs dos agentes dependentes
$contextContent = @()
$loadedOutputs = @()

foreach ($dependency in $dependencies[$CurrentAgent]) {
    $dependencyPath = Join-Path $ProjectPath "outputs\$dependency"
    
    if (Test-Path $dependencyPath) {
        # Procurar por arquivos de output
        $outputFiles = Get-ChildItem -Path $dependencyPath -Filter "latest-*.md" | Sort-Object LastWriteTime -Descending
        
        foreach ($file in $outputFiles) {
            try {
                $content = Get-Content $file.FullName -Encoding UTF8 -Raw
                if ($content.Trim()) {
                    $contextContent += "`n=== OUTPUT DO $($availableAgents[$dependency]) ==="
                    $contextContent += "`nArquivo: $($file.Name)"
                    $contextContent += "`nAtualizado: $($file.LastWriteTime.ToString('yyyy-MM-dd HH:mm:ss'))"
                    $contextContent += "`n`n$content"
                    $contextContent += "`n`n=== FIM DO OUTPUT ===`n"
                    
                    $loadedOutputs += @{
                        agent = $dependency
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
}

# Salvar contexto carregado
$contextFile = Join-Path $ProjectPath "outputs\context-$CurrentAgent.md"
if ($contextContent.Count -gt 0) {
    $contextContent -join "`n" | Out-File -FilePath $contextFile -Encoding UTF8
    
    Write-Host "Contexto carregado com sucesso!" -ForegroundColor Green
    Write-Host "Arquivo de contexto: $contextFile" -ForegroundColor Yellow
    Write-Host "Outputs carregados:" -ForegroundColor Cyan
    
    foreach ($output in $loadedOutputs) {
        Write-Host "  - $($availableAgents[$output.agent]): $($output.file)" -ForegroundColor White
    }
    
    # Exibir resumo do contexto
    Write-Host "`nResumo do Contexto:" -ForegroundColor Cyan
    Write-Host "Total de outputs: $($loadedOutputs.Count)" -ForegroundColor White
    Write-Host "Tamanho total: $((Get-Item $contextFile).Length) bytes" -ForegroundColor White
    
} else {
    Write-Host "Nenhum output anterior encontrado para carregar" -ForegroundColor Yellow
    Write-Host "Este e o primeiro agente do workflow ou nao ha dependencias" -ForegroundColor Gray
}

# Retornar informacoes do contexto
return @{
    context_file = $contextFile
    loaded_outputs = $loadedOutputs
    has_context = $contextContent.Count -gt 0
}
