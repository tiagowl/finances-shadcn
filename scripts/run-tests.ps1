# Script para executar todos os testes do projeto

param(
    [string]$Type = "all",  # all, backend, frontend, unit, integration, e2e
    [switch]$Coverage,
    [switch]$Watch
)

Write-Host "=== Executando Testes do Projeto ===" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"

function Run-BackendTests {
    Write-Host "Executando testes do Backend..." -ForegroundColor Yellow
    
    Push-Location "src/backend"
    
    try {
        $testCommand = "npm test"
        if ($Coverage) {
            $testCommand = "npm run test:coverage"
        } elseif ($Watch) {
            $testCommand = "npm run test:watch"
        }
        
        Invoke-Expression $testCommand
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Erro ao executar testes do backend" -ForegroundColor Red
            return $false
        }
    } finally {
        Pop-Location
    }
    
    return $true
}

function Run-FrontendTests {
    Write-Host "Executando testes do Frontend..." -ForegroundColor Yellow
    
    Push-Location "src/frontend"
    
    try {
        $testCommand = "npm test"
        if ($Coverage) {
            $testCommand = "npm run test:coverage"
        } elseif ($Watch) {
            $testCommand = "npm test -- --watch"
        }
        
        Invoke-Expression $testCommand
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Erro ao executar testes do frontend" -ForegroundColor Red
            return $false
        }
    } finally {
        Pop-Location
    }
    
    return $true
}

# Executar testes baseado no tipo
switch ($Type.ToLower()) {
    "backend" {
        $success = Run-BackendTests
        exit $(if ($success) { 0 } else { 1 })
    }
    "frontend" {
        $success = Run-FrontendTests
        exit $(if ($success) { 0 } else { 1 })
    }
    "all" {
        $backendSuccess = Run-BackendTests
        Write-Host ""
        $frontendSuccess = Run-FrontendTests
        
        if ($backendSuccess -and $frontendSuccess) {
            Write-Host ""
            Write-Host "=== Todos os testes passaram! ===" -ForegroundColor Green
            exit 0
        } else {
            Write-Host ""
            Write-Host "=== Alguns testes falharam ===" -ForegroundColor Red
            exit 1
        }
    }
    default {
        Write-Host "Tipo inválido. Use: all, backend, frontend" -ForegroundColor Red
        exit 1
    }
}



