import React from 'react';
import { 
  Terminal, 
  Folder, 
  RefreshCw, 
  Bot, 
  Gamepad2, 
  Wifi, 
  CheckCircle2, 
  Power, 
  Radio, 
  Cpu, 
  Clock 
} from 'lucide-react';
import { ServiceState, ServiceId, BlueprintConfig } from '../types';

interface MinimalStatusBarProps {
  config: BlueprintConfig;
  services: ServiceState[];
  onToggleService: (id: ServiceId) => void;
  onOpenSettings?: () => void;
  onOpenLogs?: () => void;
  lastLatencyMs?: number;
}

export const MinimalStatusBar: React.FC<MinimalStatusBarProps> = ({
  config,
  services,
  onToggleService,
  onOpenSettings,
  onOpenLogs,
  lastLatencyMs = 0.8
}) => {
  const getService = (id: ServiceId) => services.find((s) => s.id === id);

  const rojo = getService('rojo');
  const fccServer = getService('fcc-server');
  const fccClaude = getService('fcc-claude');

  const isRojoOnline = rojo?.status === 'running';
  const isServerOnline = fccServer?.status === 'running';
  const isClaudeOnline = fccClaude?.status === 'running';

  return (
    <footer className="sticky bottom-0 z-40 bg-[#070A0F] border-t border-slate-800/80 px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-2.5 text-xs text-slate-400 select-none shadow-lg">
      {/* Left: Base project directory */}
      <div className="flex items-center gap-2.5 font-mono text-[11px] truncate w-full md:w-auto">
        <Folder className="w-3.5 h-3.5 text-sky-400 shrink-0" />
        <span className="truncate text-slate-300" title={config.baseDirectory}>
          {config.baseDirectory}
        </span>
        <span className="text-slate-700 hidden sm:inline">•</span>
        <span className="text-slate-500 hidden sm:inline">{config.projectFileName}</span>
      </div>

      {/* Center: Discrete LED Status Indicators */}
      <div className="flex items-center gap-3 font-mono text-[11px]">
        {/* Rojo Server */}
        <div className="flex items-center gap-1.5 bg-[#0F141F] px-2.5 py-1 rounded-md border border-slate-800">
          <span
            className={`w-2 h-2 rounded-full ${
              isRojoOnline
                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.9)] animate-pulse'
                : 'bg-rose-500'
            }`}
          />
          <span className="font-bold text-slate-300">Rojo :{config.rojoPort}</span>
          <span className={`text-[9px] uppercase font-bold ${isRojoOnline ? 'text-emerald-400' : 'text-rose-400'}`}>
            ({isRojoOnline ? 'Conectado' : 'Desconectado'})
          </span>
        </div>

        {/* FCC-Server & Claude Bridge */}
        <div className="flex items-center gap-1.5 bg-[#0F141F] px-2.5 py-1 rounded-md border border-slate-800">
          <span
            className={`w-2 h-2 rounded-full ${
              isServerOnline && isClaudeOnline
                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.9)]'
                : 'bg-amber-400'
            }`}
          />
          <span className="font-bold text-slate-300">Cloud Code + Claude</span>
          <span className={`text-[9px] uppercase font-bold ${isServerOnline && isClaudeOnline ? 'text-emerald-400' : 'text-amber-400'}`}>
            ({isServerOnline && isClaudeOnline ? 'Ativo' : 'Inativo'})
          </span>
        </div>
      </div>

      {/* Right: Telemetry & Settings tab button */}
      <div className="flex items-center gap-3 font-mono text-[10px] w-full md:w-auto justify-end">
        <span className="flex items-center gap-1 text-slate-400">
          <Radio className="w-3 h-3 text-emerald-400" />
          <span>Sync: <strong className="text-emerald-400">{lastLatencyMs}ms</strong></span>
        </span>

        {onOpenSettings && (
          <>
            <span className="text-slate-700">•</span>
            <button
              type="button"
              onClick={onOpenSettings}
              className="text-slate-400 hover:text-sky-300 transition-colors flex items-center gap-1 underline decoration-dotted"
              title="Abrir configurações avançadas e reiniciar serviços"
            >
              <span>Gerenciar Serviços</span>
            </button>
          </>
        )}
      </div>
    </footer>
  );
};
