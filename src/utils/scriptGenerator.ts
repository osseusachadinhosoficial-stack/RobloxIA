import { BlueprintConfig } from '../types';

export function generateBatchScript(config: BlueprintConfig): string {
  const { baseDirectory, delaySeconds, rojoPort, robloxPlaceFile, autoLaunchStudio } = config;

  return `@echo off
chcp 65001 > nul
title Orquestrador do Ambiente Roblox - Blueprint
cls

echo ================================================================
echo    ROBLOX WIZARD DEV ENVIRONMENT - INICIALIZADOR AUTOMATICO
echo ================================================================
echo.
echo [*] Diretorio Base: ${baseDirectory}
echo [*] Intervalo de Respiro: ${delaySeconds} segundo(s)
echo [*] Porta Rojo: ${rojoPort}
echo.

:: 1. Verificacao de Diretorio Base
if not exist "${baseDirectory}" (
    echo [ERRO] O diretorio base nao foi encontrado: "${baseDirectory}"
    echo Verifique o caminho e tente novamente.
    pause
    exit /b 1
)

cd /d "${baseDirectory}"
echo [OK] Diretório base confirmado: %CD%
echo.

:: 2. Subida dos Servicos de IA (Backend e Claude)
echo [ETAPA 2/4] Iniciando Servidor Cloud Code (fcc-server)...
start "1. Backend - fcc-server" cmd /k "cd /d "${baseDirectory}" && title fcc-server && echo [Servidor] Iniciando fcc-server no diretorio: %CD% && fcc-server"

echo [*] Aguardando respiro de sincronia (${delaySeconds}s para nao sobrecarregar o sistema)...
timeout /t ${delaySeconds} /nobreak > nul

echo [ETAPA 2/4] Iniciando Claude Interface (fcc-claude)...
start "2. Claude - fcc-claude" cmd /k "cd /d "${baseDirectory}" && title fcc-claude && echo [Claude] Inicializando interface vinculada ao projeto... && fcc-claude"

echo [*] Aguardando respiro (${delaySeconds}s)...
timeout /t ${delaySeconds} /nobreak > nul

:: 3. Subida do Motor de Sincronizacao (Rojo)
echo [ETAPA 3/4] Iniciando Motor de Sincronizacao Rojo (rojo serve)...
start "3. Rojo Engine - rojo serve" cmd /k "cd /d "${baseDirectory}" && title Rojo Serve - Porta ${rojoPort} && echo [Rojo] Escutando alteracoes locais na porta ${rojoPort}... && rojo serve --port ${rojoPort}"

echo [*] Aguardando sincronizacao do Rojo (2s)...
timeout /t 2 /nobreak > nul

:: 4. Abertura do Ambiente Visual (Roblox Studio)
${autoLaunchStudio ? `echo [ETAPA 4/4] Abrindo Roblox Studio...
${robloxPlaceFile ? `if exist "${robloxPlaceFile}" (
    echo [*] Abrindo arquivo de projeto: "${robloxPlaceFile}"
    start "" "${robloxPlaceFile}"
) else (
    echo [*] Abrindo aplicativo Roblox Studio...
    start "" "RobloxStudio.exe" 2>nul || start "" "RobloxStudioBeta.exe" 2>nul || echo [AVISO] Inicie o Roblox Studio manualmente e conecte ao Rojo plugin.
)` : `echo [*] Abrindo Roblox Studio...
start "" "RobloxStudio.exe" 2>nul || start "" "RobloxStudioBeta.exe" 2>nul || echo [AVISO] Inicie o Roblox Studio manualmente e abra o projeto.`}` : `echo [ETAPA 4/4] Abra o Roblox Studio e clique em 'Connect' no plugin do Rojo.`}

echo.
echo ================================================================
echo    TODOS OS SERVICOS FORAM INICIALIZADOS COM SUCESSO!
echo    - Terminal 1: fcc-server (Backend)
echo    - Terminal 2: fcc-claude (Interface Claude)
echo    - Terminal 3: rojo serve (Canal de Sync na porta ${rojoPort})
echo    - Roblox Studio pronto para conexao
echo ================================================================
echo.
pause
`;
}

export function generatePowerShellScript(config: BlueprintConfig): string {
  const { baseDirectory, delaySeconds, rojoPort, robloxPlaceFile, autoLaunchStudio } = config;

  return `# ================================================================
# Roblox Wizard Dev Environment - PowerShell Orchestrator
# Blueprint de Desenvolvimento Automatizado
# ================================================================

$OutputEncoding = [Console]::OutputEncoding = [Text.UTF8Encoding]::UTF8
$BaseDir = "${baseDirectory}"
$DelaySec = ${delaySeconds}
$RojoPort = ${rojoPort}

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "   ROBLOX DEV ENVIRONMENT - INICIALIZADOR POWERSHELL" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[*] Diretório Base: $BaseDir" -ForegroundColor Yellow
Write-Host "[*] Tempo de Respiro: $DelaySec segundos" -ForegroundColor Yellow
Write-Host ""

# 1. Verificando o diretório de trabalho
if (-not (Test-Path -LiteralPath $BaseDir)) {
    Write-Host "[ERRO CRÍTICO] Pasta não encontrada: $BaseDir" -ForegroundColor Red
    Write-Host "Crie a pasta ou configure o caminho correto." -ForegroundColor Red
    Read-Host "Pressione ENTER para sair..."
    exit 1
}

Set-Location -LiteralPath $BaseDir
Write-Host "[OK] Contexto definido para: $(Get-Location)" -ForegroundColor Green
Write-Host ""

# 2. Subida dos Serviços de IA (Backend e Claude)
Write-Host "[FASE 2/4] Abrindo Terminal 1: Servidor (fcc-server)..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location -LiteralPath '$BaseDir'; Write-Host '>>> Iniciando Cloud Code Server (fcc-server)...' -ForegroundColor Green; fcc-server"

Write-Host "[*] Respiro de sincronia ($DelaySec s)..." -ForegroundColor DarkGray
Start-Sleep -Seconds $DelaySec

Write-Host "[FASE 2/4] Abrindo Terminal 2: Claude (fcc-claude)..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location -LiteralPath '$BaseDir'; Write-Host '>>> Inicializando Claude com contexto do projeto...' -ForegroundColor Cyan; fcc-claude"

Write-Host "[*] Respiro de sincronia ($DelaySec s)..." -ForegroundColor DarkGray
Start-Sleep -Seconds $DelaySec

# 3. Subida do Motor de Sincronização (Rojo)
Write-Host "[FASE 3/4] Abrindo Terminal 3: Motor de Sincronização (rojo serve)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location -LiteralPath '$BaseDir'; Write-Host '>>> Escutando alterações para o Roblox Studio na porta $RojoPort...' -ForegroundColor Yellow; rojo serve --port $RojoPort"

Write-Host "[*] Aguardando porta do Rojo abrir (2s)..." -ForegroundColor DarkGray
Start-Sleep -Seconds 2

# 4. Abertura do Ambiente Visual (Roblox Studio)
${autoLaunchStudio ? `Write-Host "[FASE 4/4] Inicializando Roblox Studio..." -ForegroundColor Green
${robloxPlaceFile ? `if (Test-Path -LiteralPath "$BaseDir\\${robloxPlaceFile}") {
    Start-Process "$BaseDir\\${robloxPlaceFile}"
    Write-Host "[OK] Arquivo do projeto Roblox aberto com sucesso!" -ForegroundColor Green
} else {
    try {
        Start-Process "RobloxStudioBeta.exe" -ErrorAction Stop
    } catch {
        Write-Host "[INFO] Abra o Roblox Studio e clique em 'Connect' no plugin Rojo." -ForegroundColor Yellow
    }
}` : `try {
    Start-Process "RobloxStudioBeta.exe" -ErrorAction Stop
    Write-Host "[OK] Roblox Studio aberto!" -ForegroundColor Green
} catch {
    Write-Host "[INFO] Abra o Roblox Studio e conecte ao plugin Rojo." -ForegroundColor Yellow
}`}` : `Write-Host "[FASE 4/4] Abra o Roblox Studio e conecte ao Rojo na porta $RojoPort." -ForegroundColor Green`}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Green
Write-Host "   PIPELINE CONCLUÍDO! Todos os 3 terminais ativos." -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
`;
}

export function generateWindowsTerminalCommand(config: BlueprintConfig): string {
  const { baseDirectory, rojoPort } = config;
  // Windows Terminal command line to open tabs or panes
  return `wt.exe -w 0 -d "${baseDirectory}" --title "fcc-server" cmd /k "fcc-server" ; split-pane -d "${baseDirectory}" --title "fcc-claude" cmd /k "timeout /t ${config.delaySeconds} /nobreak >nul && fcc-claude" ; split-pane -d "${baseDirectory}" --title "rojo" cmd /k "timeout /t ${config.delaySeconds * 2} /nobreak >nul && rojo serve --port ${rojoPort}"`;
}

export function generateVSCodeTasks(config: BlueprintConfig): string {
  const { baseDirectory, delaySeconds, rojoPort } = config;

  return JSON.stringify(
    {
      version: "2.0.0",
      tasks: [
        {
          label: "1. fcc-server",
          type: "shell",
          command: "fcc-server",
          options: {
            cwd: baseDirectory
          },
          isBackground: true,
          problemMatcher: []
        },
        {
          label: "2. fcc-claude",
          type: "shell",
          command: `powershell -Command "Start-Sleep -Seconds ${delaySeconds}; fcc-claude"`,
          options: {
            cwd: baseDirectory
          },
          isBackground: true,
          problemMatcher: []
        },
        {
          label: "3. rojo-serve",
          type: "shell",
          command: `powershell -Command "Start-Sleep -Seconds ${delaySeconds * 2}; rojo serve --port ${rojoPort}"`,
          options: {
            cwd: baseDirectory
          },
          isBackground: true,
          problemMatcher: []
        },
        {
          label: "Iniciar Ambiente Completo (Blueprint)",
          dependsOn: ["1. fcc-server", "2. fcc-claude", "3. rojo-serve"],
          dependsOrder: "parallel",
          group: {
            kind: "build",
            isDefault: true
          },
          problemMatcher: []
        }
      ]
    },
    null,
    2
  );
}
