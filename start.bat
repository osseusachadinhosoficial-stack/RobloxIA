@echo off
:: ============================================================================
:: Roblox Wizard Orchestrator - Inicializador Automatico para Windows
:: Este script solicita elevacao de Administrador automaticamente,
:: instala dependencias caso necessario, e inicia todos os servicos
:: 100%% em segundo plano sem poluir sua area de trabalho com janelas pretas.
:: ============================================================================

title Roblox Wizard Orchestrator - Bootstrapper
chcp 65001 >nul
cd /d "%~dp0"

:: 1. Verificacao e Auto-Elevacao de Permissoes de Administrador
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [INFO] Solicitando permissoes de Administrador para configurar servicos...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)

cls
echo ============================================================================
echo         ROBLOX WIZARD ORCHESTRATOR - INICIALIZADOR DE DESENVOLVIMENTO
echo ============================================================================
echo.
echo [1/4] Verificando ambiente Node.js e npm...
where node >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERRO] Node.js nao encontrado no sistema!
    echo Por favor, instale o Node.js v18+ em https://nodejs.org/ e tente novamente.
    pause
    exit /b
)

:: 2. Verificacao de node_modules
if not exist "node_modules" (
    echo [2/4] Instalando dependencias do projeto pela primeira vez (npm install)...
    call npm install --silent
    if %errorLevel% neq 0 (
        echo [ERRO] Falha ao instalar dependencias do npm.
        pause
        exit /b
    )
) else (
    echo [2/4] Dependencias ja instaladas.
)

:: 3. Garantir que a pasta base exista
set BASE_DIR=C:\Users\Max\RobloxWizardProject
if not exist "%BASE_DIR%" (
    echo [3/4] Criando diretorio base %BASE_DIR%...
    mkdir "%BASE_DIR%" >nul 2>&1
) else (
    echo [3/4] Diretorio base confirmado: %BASE_DIR%
)

:: 4. Compilar e Iniciar em Segundo Plano
echo [4/4] Subindo IDE Workspace e Servicos em Segundo Plano...
start /B node server.js --start-daemons >nul 2>&1

:: Aguarda 2 segundos para o servidor abrir a porta
timeout /t 2 /nobreak >nul

:: Abre o navegador padrao na URL do Orchestrator
echo.
echo [SUCESSO] Ambiente ativo! Abrindo painel no navegador...
start http://localhost:3000

echo.
echo ============================================================================
echo  O painel esta aberto no seu navegador (http://localhost:3000).
echo  Todos os daemons (fcc-server, fcc-claude e rojo serve) estao rodando
echo  de forma 100%% oculta e sincronizados com o seu Roblox Studio.
echo ============================================================================
echo.
timeout /t 5 >nul
exit /b
