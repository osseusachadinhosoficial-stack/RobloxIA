import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ExternalLink,
  Bot,
  RefreshCw,
  Gamepad2,
  Copy,
  Check
} from 'lucide-react';
import { BlueprintConfig, TerminalTabLog } from '../types';

interface TerminalSimulatorProps {
  config: BlueprintConfig;
  terminalTabs: TerminalTabLog[];
  activeTabId: string;
  setActiveTabId: (id: string) => void;
  isSimulating: boolean;
  simulationProgress: number;
  currentPhaseText: string;
  cooldownRemaining: number | null;
  onStartSimulation: () => void;
  onResetSimulation: () => void;
}

export const TerminalSimulator: React.FC<TerminalSimulatorProps> = ({
  config,
  terminalTabs,
  activeTabId,
  setActiveTabId,
  isSimulating,
  simulationProgress,
  currentPhaseText,
  cooldownRemaining,
  onStartSimulation,
  onResetSimulation,
}) => {
  const [copiedLog, setCopiedLog] = useState(false);

  const activeTab = terminalTabs.find((t) => t.id === activeTabId) || terminalTabs[0];

  const handleCopyLogs = () => {
    const text = activeTab.lines.map((l) => `[${l.timestamp}] ${l.text}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  const getStatusBadge = (status: 'offline' | 'starting' | 'online') => {
    switch (status) {
      case 'online':
        return (
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)] animate-pulse" />
            ONLINE
          </span>
        );
      case 'starting':
        return (
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            SUBINDO
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-slate-500 bg-slate-800/40 px-2 py-0.5 rounded">
            OFFLINE
          </span>
        );
    }
  };

  const getTabIcon = (id: string) => {
    switch (id) {
      case 'fcc-server':
        return <Terminal className="w-3.5 h-3.5 text-sky-400" />;
      case 'fcc-claude':
        return <Bot className="w-3.5 h-3.5 text-amber-400" />;
      case 'rojo':
        return <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />;
      case 'studio':
        return <Gamepad2 className="w-3.5 h-3.5 text-slate-200" />;
      default:
        return <Terminal className="w-3.5 h-3.5" />;
    }
  };

  return (
    <section className="bg-[#12161F] rounded-xl border border-slate-800 text-slate-300 shadow-sm overflow-hidden flex flex-col">
      {/* Terminal Top Window Header */}
      <div className="bg-[#0E121A] border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Mac-style mock buttons */}
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white tracking-wide uppercase font-mono">
              Terminal Multi-Aba Interativo
            </span>
            <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
              [{config.baseDirectory}]
            </span>
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2">
          {cooldownRemaining !== null && cooldownRemaining > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono animate-pulse">
              <Clock className="w-3.5 h-3.5" />
              <span>Respiro de sincronia: {cooldownRemaining}s</span>
            </div>
          )}

          <button
            type="button"
            id="btn-terminal-simulate"
            onClick={onStartSimulation}
            disabled={isSimulating}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all ${
              isSimulating
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400 cursor-wait'
                : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sm'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isSimulating ? 'Executando...' : 'Iniciar Boot'}</span>
          </button>

          <button
            type="button"
            id="btn-terminal-reset"
            onClick={onResetSimulation}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium uppercase tracking-wider bg-[#1A1F2B] border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition-colors"
            title="Reiniciar simulação"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            type="button"
            id="btn-copy-tab-log"
            onClick={handleCopyLogs}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium uppercase tracking-wider bg-[#1A1F2B] border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition-colors"
            title="Copiar log da aba atual"
          >
            {copiedLog ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Copiar Log</span>
          </button>
        </div>
      </div>

      {/* Progress Bar when Simulating */}
      {isSimulating && (
        <div className="w-full bg-slate-900 h-1">
          <div
            className="bg-sky-500 h-1 transition-all duration-300 shadow-[0_0_8px_rgba(14,165,233,0.8)]"
            style={{ width: `${simulationProgress}%` }}
          />
        </div>
      )}

      {/* Terminal Tabs Row */}
      <div className="bg-[#0B0E14] border-b border-slate-800 px-2 flex items-center gap-1 overflow-x-auto scrollbar-thin">
        {terminalTabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              type="button"
              id={`tab-btn-${tab.id}`}
              onClick={() => setActiveTabId(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono transition-all border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-sky-400 text-white bg-[#12161F] font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-[#12161F]/50'
              }`}
            >
              {getTabIcon(tab.id)}
              <span>{tab.title}</span>
              {getStatusBadge(tab.status)}
            </button>
          );
        })}
      </div>

      {/* Active Tab Info Strip */}
      <div className="bg-[#0E121A]/60 px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Comando:</span>
          <span className="text-sky-300 bg-black/40 border border-slate-800 px-2 py-0.5 rounded">
            {activeTab.command}
          </span>
          <span className="text-slate-600">| Papel:</span>
          <span className="text-amber-400">{activeTab.badge}</span>
        </div>
        <div className="text-[11px] text-slate-500">
          Status: <span className="text-slate-300 font-semibold">{currentPhaseText}</span>
        </div>
      </div>

      {/* Terminal Content Screen */}
      <div className="p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-relaxed min-h-[280px] max-h-[380px] overflow-y-auto bg-[#090C11] space-y-1.5">
        <div className="text-slate-600 text-[11px] pb-2 mb-2 border-b border-slate-800/80 flex items-center justify-between">
          <span>Microsoft Windows [Versão 10.0.22631.4317] - Orquestrador Nativo</span>
          <span className="text-sky-400/70">{config.baseDirectory}</span>
        </div>

        {activeTab.lines.map((line, idx) => {
          let textClass = 'text-slate-400';
          if (line.type === 'system') textClass = 'text-slate-600 italic';
          if (line.type === 'command') textClass = 'text-sky-400 font-bold';
          if (line.type === 'success') textClass = 'text-emerald-400 font-semibold';
          if (line.type === 'warn') textClass = 'text-amber-400';
          if (line.type === 'info') textClass = 'text-slate-300';

          return (
            <div key={idx} className="flex items-start gap-2.5 hover:bg-slate-900/50 px-1.5 py-0.5 rounded transition-colors">
              <span className="text-slate-600 select-none text-[11px] shrink-0 font-mono">
                {line.timestamp}
              </span>
              <span className="text-slate-600 select-none shrink-0">&gt;</span>
              <span className={`break-all ${textClass}`}>
                {line.text}
              </span>
            </div>
          );
        })}

        {isSimulating && (
          <div className="flex items-center gap-2 text-sky-400 animate-pulse pt-2 text-xs">
            <span className="w-2 h-4 bg-sky-400 inline-block animate-ping" />
            <span>Processando orquestração no ambiente Max...</span>
          </div>
        )}
      </div>

      {/* Terminal Footer with Quick Switcher */}
      <div className="bg-[#0E121A] border-t border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Diretório raiz verificado
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Delay {config.delaySeconds}s ativo
          </span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          Rojo Port: <strong className="text-indigo-400">{config.rojoPort}</strong> (Localhost)
        </div>
      </div>
    </section>
  );
};
