# Script de Ajuda - Molde de Agentes
# Mostra informacoes de ajuda e exemplos de uso

Write-Host "Molde de Agentes para Desenvolvimento de Software" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Green

Write-Host "`nSobre:" -ForegroundColor Cyan
Write-Host "Este molde automatiza o processo de desenvolvimento usando uma equipe de agentes especializados no Cursor AI." -ForegroundColor White

Write-Host "`nAgentes Disponiveis:" -ForegroundColor Cyan
Write-Host "- Product Owner: Define requisitos e prioridades" -ForegroundColor White
Write-Host "- Arquiteto: Projeta arquitetura do sistema" -ForegroundColor White
Write-Host "- Frontend Dev: Implementa interface do usuario" -ForegroundColor White
Write-Host "- Backend Dev: Desenvolve APIs e logica de negocio" -ForegroundColor White
Write-Host "- DevOps: Gerencia infraestrutura e deploy" -ForegroundColor White
Write-Host "- Tester: Executa testes e garante qualidade" -ForegroundColor White
Write-Host "- UX: Foca na experiencia do usuario" -ForegroundColor White

Write-Host "`nWorkflows Disponiveis:" -ForegroundColor Cyan
Write-Host "- complete-development: Do conceito ao deploy" -ForegroundColor White
Write-Host "- feature-development: Desenvolvimento de funcionalidades" -ForegroundColor White
Write-Host "- bug-fixing: Correcao de bugs" -ForegroundColor White
Write-Host "- code-review: Revisao de codigo" -ForegroundColor White

Write-Host "`nComandos Principais:" -ForegroundColor Cyan
Write-Host "`n1. Configuracao Inicial:" -ForegroundColor Yellow
Write-Host "   ./scripts/setup.ps1 -ProjectName 'MeuProjeto'" -ForegroundColor Green
Write-Host "   # Configura o ambiente e cria estrutura do projeto" -ForegroundColor Gray

Write-Host "`n2. Ativar um Agente:" -ForegroundColor Yellow
Write-Host "   ./scripts/activate-agent.ps1 product-owner" -ForegroundColor Green
Write-Host "   ./scripts/activate-agent.ps1 architect" -ForegroundColor Green
Write-Host "   ./scripts/activate-agent.ps1 frontend-dev" -ForegroundColor Green
Write-Host "   # Ativa um agente especifico e carrega sua configuracao" -ForegroundColor Gray

Write-Host "`n3. Iniciar um Workflow:" -ForegroundColor Yellow
Write-Host "   ./scripts/start-workflow.ps1 complete-development" -ForegroundColor Green
Write-Host "   ./scripts/start-workflow.ps1 feature-development" -ForegroundColor Green
Write-Host "   # Inicia um workflow com multiplos agentes" -ForegroundColor Gray

Write-Host "`n4. Listar Agentes:" -ForegroundColor Yellow
Write-Host "   ./scripts/list-agents.ps1" -ForegroundColor Green
Write-Host "   # Mostra todos os agentes disponiveis" -ForegroundColor Gray

Write-Host "`n5. Ver Ajuda:" -ForegroundColor Yellow
Write-Host "   ./scripts/help.ps1" -ForegroundColor Green
Write-Host "   # Mostra esta tela de ajuda" -ForegroundColor Gray

Write-Host "`n6. Gerenciar Outputs:" -ForegroundColor Yellow
Write-Host "   ./scripts/save-output.ps1 [agent] [content] [filename]" -ForegroundColor Green
Write-Host "   ./scripts/load-context.ps1 [agent]" -ForegroundColor Green
Write-Host "   ./scripts/handoff.ps1 [from-agent] [to-agent]" -ForegroundColor Green
Write-Host "   ./scripts/manage-outputs.ps1 [action]" -ForegroundColor Green
Write-Host "   # Gerencia outputs e contexto automatico" -ForegroundColor Gray

Write-Host "`n7. Workflow Automatico:" -ForegroundColor Yellow
Write-Host "   ./scripts/auto-workflow.ps1 [workflow-name]" -ForegroundColor Green
Write-Host "   # Executa workflow completo com handoff automatico" -ForegroundColor Gray

Write-Host "`nExemplos de Uso:" -ForegroundColor Cyan

Write-Host "`nExemplo 1: Desenvolvimento de uma Nova Feature" -ForegroundColor Yellow
Write-Host "1. ./scripts/start-workflow.ps1 feature-development" -ForegroundColor Green
Write-Host "2. ./scripts/activate-agent.ps1 product-owner" -ForegroundColor Green
Write-Host "3. # Defina requisitos e user stories" -ForegroundColor Gray
Write-Host "4. ./scripts/activate-agent.ps1 architect" -ForegroundColor Green
Write-Host "5. # Projete a arquitetura tecnica" -ForegroundColor Gray
Write-Host "6. ./scripts/activate-agent.ps1 frontend-dev" -ForegroundColor Green
Write-Host "7. # Implemente a interface" -ForegroundColor Gray

Write-Host "`nExemplo 2: Correcao de Bug" -ForegroundColor Yellow
Write-Host "1. ./scripts/start-workflow.ps1 bug-fixing" -ForegroundColor Green
Write-Host "2. ./scripts/activate-agent.ps1 tester" -ForegroundColor Green
Write-Host "3. # Analise e reproduza o bug" -ForegroundColor Gray
Write-Host "4. ./scripts/activate-agent.ps1 backend-dev" -ForegroundColor Green
Write-Host "5. # Implemente a correcao" -ForegroundColor Gray

Write-Host "`nExemplo 3: Code Review" -ForegroundColor Yellow
Write-Host "1. ./scripts/start-workflow.ps1 code-review" -ForegroundColor Green
Write-Host "2. ./scripts/activate-agent.ps1 architect" -ForegroundColor Green
Write-Host "3. # Revise arquitetura e padroes" -ForegroundColor Gray
Write-Host "4. ./scripts/activate-agent.ps1 tester" -ForegroundColor Green
Write-Host "5. # Execute testes e validacoes" -ForegroundColor Gray

Write-Host "`nEstrutura de Arquivos:" -ForegroundColor Cyan
Write-Host "agent-team-template/" -ForegroundColor White
Write-Host "├── agents/           # Configuracoes dos agentes" -ForegroundColor Gray
Write-Host "├── workflows/        # Fluxos de trabalho" -ForegroundColor Gray
Write-Host "├── templates/        # Templates de prompts" -ForegroundColor Gray
Write-Host "├── scripts/          # Scripts de automacao" -ForegroundColor Gray
Write-Host "└── docs/            # Documentacao" -ForegroundColor Gray

Write-Host "`nDicas de Uso:" -ForegroundColor Cyan
Write-Host "- Use os templates em templates/ para prompts especificos" -ForegroundColor White
Write-Host "- Siga os workflows para processos estruturados" -ForegroundColor White
Write-Host "- Cada agente tem expertise especifica - use conforme necessario" -ForegroundColor White
Write-Host "- Os agentes podem colaborar entre si nos workflows" -ForegroundColor White
Write-Host "- Mantenha o contexto ativo com .active-agent e .active-workflow" -ForegroundColor White

Write-Host "`nPrecisa de mais ajuda?" -ForegroundColor Cyan
Write-Host "- Consulte a documentacao em docs/" -ForegroundColor White
Write-Host "- Use ./scripts/list-agents.ps1 para ver agentes disponiveis" -ForegroundColor White
Write-Host "- Cada agente tem templates especificos em templates/" -ForegroundColor White
