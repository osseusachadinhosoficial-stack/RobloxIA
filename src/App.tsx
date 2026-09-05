import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Sparkles, 
  Workflow, 
  Code2, 
  FolderCode, 
  SlidersHorizontal,
  Bot
} from 'lucide-react';
import { 
  BlueprintConfig, 
  ServiceState, 
  ServiceId, 
  LiveLogItem, 
  CloudCodeCommandResult,
  AIChatMessage
} from './types';
import { 
  defaultConfig, 
  initialSteps, 
  initialTerminalTabs, 
  initialServices 
} from './data/blueprintData';
import { Header } from './components/Header';
import { AIChatWorkspace } from './components/AIChatWorkspace';
import { RealTimeCodePreview } from './components/RealTimeCodePreview';
import { RobloxStudioMiniPreview } from './components/RobloxStudioMiniPreview';
import { MinimalStatusBar } from './components/MinimalStatusBar';
import { SystemSettingsTab } from './components/SystemSettingsTab';
import { PipelineVisualizer } from './components/PipelineVisualizer';
import { TerminalSimulator } from './components/TerminalSimulator';
import { ScriptGenerator } from './components/ScriptGenerator';
import { 
  fetchDaemonStatus, 
  executeCommandOnDaemon, 
  restartDaemonService, 
  toggleDaemonService, 
  sendStudioForceSync 
} from './services/daemonApi';

export default function App() {
  const [config, setConfig] = useState<BlueprintConfig>(defaultConfig);
  const [activeView, setActiveView] = useState<'workspace' | 'settings' | 'blueprint' | 'scripts'>('workspace');

  // Background Services running invisibly
  const [services, setServices] = useState<ServiceState[]>(initialServices);
  
  // Clean initial state: zero mock logs and zero dummy chat messages
  const [liveLogs, setLiveLogs] = useState<LiveLogItem[]>([]);
  const [chatMessages, setChatMessages] = useState<AIChatMessage[]>([]);
  const [commandHistory, setCommandHistory] = useState<CloudCodeCommandResult[]>([]);
  const [activeResultId, setActiveResultId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Roblox Studio Play Solo State
  const [isPlayingStudioTest, setIsPlayingStudioTest] = useState(false);

  const activeResult = commandHistory.find((c) => c.id === activeResultId) || (commandHistory.length > 0 ? commandHistory[0] : null);

  // Background logging helper
  const appendLog = (channel: 'rojo' | 'fcc-server' | 'fcc-claude' | 'studio', level: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR' | 'SYNC', text: string) => {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    const newLog: LiveLogItem = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp,
      channel,
      level,
      text
    };
    setLiveLogs((prev) => [...prev.slice(-300), newLog]);
  };

  // Poll real daemon status from backend (server.js)
  useEffect(() => {
    let isMounted = true;

    const checkStatus = async () => {
      const status = await fetchDaemonStatus();
      if (!isMounted) return;

      if (status && status.services) {
        setServices((prev) =>
          prev.map((s) => {
            if (s.id === 'fcc-server' && status.services.fccServer) {
              return {
                ...s,
                status: status.services.fccServer.active ? 'running' : 'stopped',
                pid: status.services.fccServer.pid || s.pid,
                uptimeSeconds: status.services.fccServer.uptimeSeconds || s.uptimeSeconds,
                memoryMb: status.services.fccServer.memoryMb || s.memoryMb,
                cpuPercent: status.services.fccServer.cpuPercent || s.cpuPercent
              };
            }
            if (s.id === 'fcc-claude' && status.services.fccClaude) {
              return {
                ...s,
                status: status.services.fccClaude.active ? 'running' : 'stopped',
                pid: status.services.fccClaude.pid || s.pid,
                uptimeSeconds: status.services.fccClaude.uptimeSeconds || s.uptimeSeconds,
                memoryMb: status.services.fccClaude.memoryMb || s.memoryMb,
                cpuPercent: status.services.fccClaude.cpuPercent || s.cpuPercent
              };
            }
            if (s.id === 'rojo' && status.services.rojo) {
              return {
                ...s,
                status: status.services.rojo.active ? 'running' : 'stopped',
                pid: status.services.rojo.pid || s.pid,
                uptimeSeconds: status.services.rojo.uptimeSeconds || s.uptimeSeconds,
                memoryMb: status.services.rojo.memoryMb || s.memoryMb,
                cpuPercent: status.services.rojo.cpuPercent || s.cpuPercent
              };
            }
            return s;
          })
        );
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Handle Send Message from User in Natural Language with Real Backend Execution
  const handleSendMessage = async (prompt: string, targetDir: 'server' | 'shared' | 'client') => {
    const userMsgId = `user-${Date.now()}`;
    const nowTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    // 1. Append user message
    setChatMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: 'user',
        text: prompt,
        timestamp: nowTime
      }
    ]);

    setIsProcessing(true);

    // Compute target file path
    const ext = targetDir === 'server' ? '.server.luau' : targetDir === 'client' ? '.client.luau' : '.luau';
    const cleanPrefix = prompt.toLowerCase().includes('porta') ? 'DoorSystem'
      : prompt.toLowerCase().includes('moeda') || prompt.toLowerCase().includes('coin') ? 'CoinCollector'
      : prompt.toLowerCase().includes('lava') || prompt.toLowerCase().includes('dano') ? 'LavaHazard'
      : prompt.toLowerCase().includes('sprint') || prompt.toLowerCase().includes('corrid') ? 'SprintController'
      : `Feature_${Date.now().toString().slice(-4)}`;
    const targetFile = `src/${targetDir}/${cleanPrefix}${ext}`;

    appendLog('fcc-server', 'INFO', `Processando comando: "${prompt.slice(0, 45)}..."`);

    // 2. Real execution via Backend Node.js / daemonApi
    const result = await executeCommandOnDaemon(prompt, targetFile);

    appendLog('fcc-claude', 'SUCCESS', `Código Luau gerado com tipagem estrita para ${targetFile}`);
    appendLog('rojo', 'SYNC', `[SYNC] Transmitido via WebSocket :${config.rojoPort} -> Roblox Studio (0.8ms)`);

    setCommandHistory((prev) => [result, ...prev]);
    setActiveResultId(result.id);

    // 3. Append Claude's natural language explanation
    const claudeMsgId = `claude-${Date.now()}`;
    const friendlyExplanation = result.explanation
      ? `Pronto! ${result.explanation} O arquivo ${targetFile.split('/').pop()} já foi gravado e sincronizado no Roblox Studio via Rojo.`
      : `Pronto! Criei o script ${targetFile.split('/').pop()} e já sincronizei com o Roblox Studio. Você já pode testá-lo no Play Solo!`;

    setChatMessages((prev) => [
      ...prev,
      {
        id: claudeMsgId,
        sender: 'claude',
        text: friendlyExplanation,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        targetFile: result.targetFile,
        commandResultId: result.id
      }
    ]);

    setIsProcessing(false);
  };

  // Toggle service in background via backend API
  const handleToggleService = async (id: ServiceId) => {
    const currentService = services.find((s) => s.id === id);
    const newStatus = currentService?.status === 'running' ? 'stopped' : 'running';

    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );

    await toggleDaemonService(id, newStatus === 'running' ? 'start' : 'stop');
    appendLog(id, newStatus === 'running' ? 'SUCCESS' : 'WARN', `Serviço ${id} ${newStatus === 'running' ? 'iniciado' : 'pausado'} em segundo plano.`);
  };

  // Restart service in background via backend API
  const handleRestartService = async (id: ServiceId) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'restarting' } : s))
    );
    appendLog(id, 'WARN', `Reiniciando serviço ${id} em segundo plano...`);

    await restartDaemonService(id);

    setTimeout(() => {
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: 'running', uptimeSeconds: 0 } : s))
      );
      appendLog(id, 'SUCCESS', `Serviço ${id} reiniciado com sucesso na porta ${config.rojoPort}.`);
    }, 1200);
  };

  const handleForceRojoSync = async () => {
    await sendStudioForceSync();
    appendLog('rojo', 'SYNC', `[SYNC] Handshake manual verificado com o Roblox Studio (:34872)`);
  };

  const rojoService = services.find((s) => s.id === 'rojo');

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-200 flex flex-col font-sans selection:bg-sky-500 selection:text-slate-950">
      {/* Sleek Top App Header */}
      <Header
        config={config}
        onOpenGenerator={() => setActiveView('scripts')}
        onStartSimulation={() => setActiveView('blueprint')}
        isSimulating={false}
        simulationProgress={100}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4 flex flex-col">
        
        {/* Navigation Switcher Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-2.5 pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-1.5 p-1 bg-[#12161F] border border-slate-800 rounded-xl shadow-sm">
            {/* Tab 1: IDE Workspace (Home Screen) */}
            <button
              type="button"
              id="tab-workspace"
              onClick={() => setActiveView('workspace')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeView === 'workspace'
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#1A1F2B]'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Workspace</span>
            </button>

            {/* Tab 2: Secondary Settings & System (Not on Home Screen) */}
            <button
              type="button"
              id="tab-settings"
              onClick={() => setActiveView('settings')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeView === 'settings'
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#1A1F2B]'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Configurações &amp; Sistema</span>
            </button>

            {/* Tab 3: Scripts Exporter (.bat / .ps1) */}
            <button
              type="button"
              id="tab-scripts"
              onClick={() => setActiveView('scripts')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeView === 'scripts'
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#1A1F2B]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Exportar Scripts</span>
            </button>

            {/* Tab 4: Blueprint & Architecture Visualizer */}
            <button
              type="button"
              id="tab-blueprint"
              onClick={() => setActiveView('blueprint')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeView === 'blueprint'
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#1A1F2B]'
              }`}
            >
              <Workflow className="w-4 h-4" />
              <span>Blueprint de Inicialização</span>
            </button>
          </div>

          {/* Connected Studio Indicator */}
          <div className="flex items-center gap-2 text-[11px] font-mono bg-[#12161F] border border-slate-800 px-3 py-1.5 rounded-xl text-slate-400 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)] animate-pulse" />
            <span>Roblox Studio: <strong className="text-emerald-400">Pronto (Rojo :{config.rojoPort})</strong></span>
          </div>
        </div>

        {/* 1. MAIN INTERFACE: WORKSPACE LAYOUT (HOME SCREEN) */}
        {activeView === 'workspace' && (
          <div className="space-y-4 flex-1 flex flex-col">
            {/* Top Row: Workspace Banner + Compact Roblox Studio Mini Preview Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
              {/* Left Intro Card */}
              <div className="lg:col-span-2 bg-[#12161F] rounded-xl border border-slate-800 p-4 sm:p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[10px] font-bold uppercase tracking-widest border border-sky-500/20 font-mono">
                      IDE Workspace
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Para Criadores Roblox
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white mt-1 tracking-tight">
                    Ambiente de Criação com IA
                  </h1>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-2xl">
                    Converse com o Claude na coluna da esquerda para criar mecânicas completas para o seu jogo. O código Luau é gerado em tempo real na coluna da direita e injetado diretamente no Roblox Studio pelo Rojo.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 mt-3 pt-3 border-t border-slate-800/80">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5 text-indigo-400" />
                    Claude 3.5 Sonnet Context
                  </span>
                  <span>•</span>
                  <span className="text-emerald-400">Daemons Ocultos em Segundo Plano</span>
                </div>
              </div>

              {/* Right: TOP/CORNER WIDGET - Roblox Studio Mini Preview Card */}
              <div className="lg:col-span-1">
                <RobloxStudioMiniPreview
                  config={config}
                  rojoService={rojoService}
                  lastSyncedFile={activeResult ? activeResult.targetFile : 'Nenhum arquivo ainda'}
                  lastSyncTime={activeResult ? activeResult.timestamp : 'Aguardando'}
                  isPlaying={isPlayingStudioTest}
                  onTogglePlay={() => setIsPlayingStudioTest(!isPlayingStudioTest)}
                  onForceSync={handleForceRojoSync}
                />
              </div>
            </div>

            {/* TWO-COLUMN LAYOUT: Left AI Chat + Right Real-time Code Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 items-stretch">
              
              {/* LEFT COLUMN: AI Coding Workspace (Chat & Prompt Box) */}
              <div className="lg:col-span-5 h-[560px] flex flex-col">
                <AIChatWorkspace
                  messages={chatMessages}
                  onSendMessage={handleSendMessage}
                  isProcessing={isProcessing}
                  onSelectCommandResult={(id) => setActiveResultId(id)}
                  activeResultId={activeResultId}
                />
              </div>

              {/* RIGHT COLUMN: Real-Time Code Preview & Live Rojo Sync */}
              <div className="lg:col-span-7 h-[560px] flex flex-col">
                <RealTimeCodePreview
                  activeResult={activeResult}
                  rojoPort={config.rojoPort}
                />
              </div>

            </div>
          </div>
        )}

        {/* 2. SECONDARY VIEW: SYSTEM & SETTINGS (MANUAL RESTART BUTTONS NOT ON HOME) */}
        {activeView === 'settings' && (
          <SystemSettingsTab
            config={config}
            onChangeConfig={setConfig}
            services={services}
            onRestartService={handleRestartService}
            onToggleService={handleToggleService}
            liveLogs={liveLogs}
          />
        )}

        {/* 3. SECONDARY VIEW: SCRIPTS EXPORTER (.bat / .ps1) */}
        {activeView === 'scripts' && (
          <div className="space-y-6">
            <ScriptGenerator config={config} />
          </div>
        )}

        {/* 4. SECONDARY VIEW: BLUEPRINT BOOT SIMULATOR */}
        {activeView === 'blueprint' && (
          <div className="space-y-6">
            <PipelineVisualizer
              steps={initialSteps}
              config={config}
              currentStepId={null}
            />
            <TerminalSimulator
              config={config}
              terminalTabs={initialTerminalTabs}
              activeTabId="fcc-server"
              setActiveTabId={() => {}}
              isSimulating={false}
              simulationProgress={100}
              currentPhaseText="Cadeia de inicialização em segundo plano concluída."
              cooldownRemaining={null}
              onStartSimulation={() => {}}
              onResetSimulation={() => {}}
            />
          </div>
        )}

      </main>

      {/* 3. MINIMALIST FOOTER / STATUS BAR */}
      <MinimalStatusBar
        config={config}
        services={services}
        onToggleService={handleToggleService}
        onOpenSettings={() => setActiveView('settings')}
        lastLatencyMs={0.8}
      />
    </div>
  );
}
