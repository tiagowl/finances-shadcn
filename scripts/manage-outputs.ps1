# Script para Gerenciar Outputs dos Agentes
# Gerencia, lista e organiza outputs dos agentes

param(
    [string]$Action = "list",
    [string]$AgentName = "",
    [string]$ProjectPath = "."
)

# Acoes disponiveis
$availableActions = @("list", "clean", "export", "import", "status")

if ($Action -notin $availableActions) {
    Write-Host "Acao '$Action' nao encontrada!" -ForegroundColor Red
    Write-Host "Acoes disponiveis: $($availableActions -join ', ')" -ForegroundColor Yellow
    exit 1
}

$outputsPath = Join-Path $ProjectPath "outputs"

switch ($Action) {
    "list" {
        Write-Host "Outputs dos Agentes" -ForegroundColor Green
        Write-Host "=" * 50 -ForegroundColor Green
        
        if (Test-Path $outputsPath) {
            $agents = Get-ChildItem -Path $outputsPath -Directory
            
            foreach ($agent in $agents) {
                Write-Host "`nAgente: $($agent.Name)" -ForegroundColor Cyan
                
                $outputFiles = Get-ChildItem -Path $agent.FullName -Filter "*.md" | Sort-Object LastWriteTime -Descending
                
                if ($outputFiles.Count -gt 0) {
                    Write-Host "  Outputs encontrados: $($outputFiles.Count)" -ForegroundColor White
                    
                    foreach ($file in $outputFiles | Select-Object -First 5) {
                        $size = [math]::Round($file.Length / 1KB, 2)
                        Write-Host "    - $($file.Name) ($size KB) - $($file.LastWriteTime.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor Gray
                    }
                    
                    if ($outputFiles.Count -gt 5) {
                        Write-Host "    ... e mais $($outputFiles.Count - 5) arquivos" -ForegroundColor Gray
                    }
                } else {
                    Write-Host "  Nenhum output encontrado" -ForegroundColor Yellow
                }
            }
        } else {
            Write-Host "Diretorio de outputs nao encontrado: $outputsPath" -ForegroundColor Red
        }
    }
    
    "clean" {
        Write-Host "Limpando outputs antigos..." -ForegroundColor Yellow
        
        if (Test-Path $outputsPath) {
            $agents = Get-ChildItem -Path $outputsPath -Directory
            
            foreach ($agent in $agents) {
                $outputFiles = Get-ChildItem -Path $agent.FullName -Filter "*.md" | Sort-Object LastWriteTime -Descending
                
                # Manter apenas os 5 arquivos mais recentes
                if ($outputFiles.Count -gt 5) {
                    $filesToDelete = $outputFiles | Select-Object -Skip 5
                    
                    foreach ($file in $filesToDelete) {
                        Remove-Item $file.FullName -Force
                        Write-Host "Removido: $($file.Name)" -ForegroundColor Red
                    }
                    
                    Write-Host "Agente $($agent.Name): Removidos $($filesToDelete.Count) arquivos antigos" -ForegroundColor Green
                } else {
                    Write-Host "Agente $($agent.Name): Nenhum arquivo para remover" -ForegroundColor Gray
                }
            }
        }
        
        Write-Host "Limpeza concluida!" -ForegroundColor Green
    }
    
    "export" {
        $exportPath = Join-Path $ProjectPath "outputs-export"
        New-Item -ItemType Directory -Path $exportPath -Force | Out-Null
        
        Write-Host "Exportando outputs para: $exportPath" -ForegroundColor Green
        
        if (Test-Path $outputsPath) {
            Copy-Item -Path $outputsPath -Destination $exportPath -Recurse -Force
            Write-Host "Export concluido!" -ForegroundColor Green
        } else {
            Write-Host "Nenhum output para exportar" -ForegroundColor Yellow
        }
    }
    
    "import" {
        $importPath = Join-Path $ProjectPath "outputs-export"
        
        if (Test-Path $importPath) {
            Write-Host "Importando outputs de: $importPath" -ForegroundColor Green
            Copy-Item -Path "$importPath\*" -Destination $outputsPath -Recurse -Force
            Write-Host "Import concluido!" -ForegroundColor Green
        } else {
            Write-Host "Diretorio de import nao encontrado: $importPath" -ForegroundColor Red
        }
    }
    
    "status" {
        Write-Host "Status dos Outputs" -ForegroundColor Green
        Write-Host "=" * 30 -ForegroundColor Green
        
        if (Test-Path $outputsPath) {
            $totalFiles = 0
            $totalSize = 0
            $agents = Get-ChildItem -Path $outputsPath -Directory
            
            foreach ($agent in $agents) {
                $outputFiles = Get-ChildItem -Path $agent.FullName -Filter "*.md"
                $agentSize = ($outputFiles | Measure-Object -Property Length -Sum).Sum
                $totalFiles += $outputFiles.Count
                $totalSize += $agentSize
                
                $sizeKB = [math]::Round($agentSize / 1KB, 2)
                Write-Host "$($agent.Name): $($outputFiles.Count) arquivos ($sizeKB KB)" -ForegroundColor White
            }
            
            $totalSizeKB = [math]::Round($totalSize / 1KB, 2)
            Write-Host "`nTotal: $totalFiles arquivos ($totalSizeKB KB)" -ForegroundColor Cyan
        } else {
            Write-Host "Nenhum output encontrado" -ForegroundColor Yellow
        }
    }
}

Write-Host "`nComandos disponiveis:" -ForegroundColor Cyan
Write-Host "  ./scripts/manage-outputs.ps1 list          # Listar todos os outputs" -ForegroundColor White
Write-Host "  ./scripts/manage-outputs.ps1 clean         # Limpar outputs antigos" -ForegroundColor White
Write-Host "  ./scripts/manage-outputs.ps1 export        # Exportar outputs" -ForegroundColor White
Write-Host "  ./scripts/manage-outputs.ps1 import        # Importar outputs" -ForegroundColor White
Write-Host "  ./scripts/manage-outputs.ps1 status        # Status dos outputs" -ForegroundColor White
