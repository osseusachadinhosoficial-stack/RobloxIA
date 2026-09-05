import React from 'react';
import { Gamepad2, RefreshCw, Zap, Wifi, Layers, CheckCircle2, Play, Square } from 'lucide-react';
import { BlueprintConfig, ServiceState } from '../types';

interface RobloxStudioMiniPreviewProps {
  config: BlueprintConfig;
  rojoService?: ServiceState;
  lastSyncedFile?: string;
  lastSyncTime?: string;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  onForceSync?: () => void;
}

export const RobloxStudioMiniPreview: React.FC<RobloxStudioMiniPreviewProps> = ({
  config,
  rojoService,
  lastSyncedFile = 'src/server/LeaderstatsService.server.luau',
  lastSyncTime = 'Agora mesmo',
  isPlaying = false,
  onTogglePlay,
  onForceSync
}) => {
  const isRojoOnline = rojoService ? rojoService.status === 'running' : true;

  return (
    <div className="bg-[#12161F] rounded-xl border border-slate-800 shadow-sm overflow-hidden flex flex-col">
      {/* Studio Window Bar */}
      <div className="px-3.5 py-2 bg-[#0A0D13] border-b border-slate-800/80 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          {/* Traffic light window controls */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
          </div>
          <span className="text-slate-400 text-[11px] flex items-center gap-1.5 pl-1.5 border-l border-slate-800">
            <Gamepad2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Roblox Studio • {config.robloxPlaceFile}</span>
          </span>
        </div>

        {/* Live Rojo Port Status */}
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isRojoOnline
                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.9)] animate-pulse'
                : 'bg-rose-500'
            }`}
          />
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
            Rojo :{config.rojoPort}
          </span>
          <span
            className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider border ${
              isRojoOnline
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}
          >
            {isRojoOnline ? 'Conectado' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Simulated 3D Viewport with Ambient Baseplate */}
      <div className="relative h-28 sm:h-32 bg-[#06080D] flex items-center justify-center overflow-hidden border-b border-slate-800/60 select-none">
        {/* Perspective Grid / Baseplate Simulation */}
        <div className="absolute inset-0 opacity-25 bg-[linear-gradient(to_right,#38bdf8_1px,transparent_1px),linear-gradient(to_bottom,#38bdf8_1px,transparent_1px)] [background-size:20px_20px] [transform:perspective(300px)_rotateX(45deg)] origin-bottom" />

        {/* Simulated SpawnLocation Block */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-8 bg-slate-800/90 border border-sky-500/40 rounded-sm shadow-[0_0_20px_rgba(56,189,248,0.2)] flex items-center justify-center [transform:rotateX(20deg)]">
            <div className="w-6 h-6 rounded-full border border-dashed border-sky-400/60 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            </div>
          </div>
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-1">
            SpawnLocation (0, 0.5, 0)
          </span>
        </div>

        {/* Top-Left Telemetry Overlay */}
        <div className="absolute top-2 left-2.5 z-20 flex items-center gap-2 font-mono text-[10px]">
          <span className="px-1.5 py-0.5 rounded bg-black/70 border border-slate-800 text-emerald-400 font-bold">
            60 FPS
          </span>
          <span className="px-1.5 py-0.5 rounded bg-black/70 border border-slate-800 text-slate-400">
            Render: Vulkan/D3D11
          </span>
        </div>

        {/* Top-Right Play Solo Toggle */}
        <div className="absolute top-2 right-2.5 z-20">
          <button
            type="button"
            onClick={onTogglePlay}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider transition-all ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm'
            }`}
          >
            {isPlaying ? (
              <>
                <Square className="w-2.5 h-2.5 fill-current" />
                <span>Stop Test</span>
              </>
            ) : (
              <>
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>Play Solo</span>
              </>
            )}
          </button>
        </div>

        {/* Center Flash Banner if Syncing */}
        {isPlaying && (
          <div className="absolute bottom-2 z-20 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold animate-pulse">
            ● Play Solo Ativo (Local Server + 1 Client)
          </div>
        )}
      </div>

      {/* Sync Status Footer Bar */}
      <div className="px-3.5 py-2 bg-[#0E121A] flex items-center justify-between text-[11px] font-mono gap-2">
        <div className="flex items-center gap-2 text-slate-400 truncate">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">
            Último Sync: <strong className="text-slate-200">{lastSyncedFile.split('/').pop()}</strong>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-500 shrink-0">{lastSyncTime}</span>
        </div>

        {onForceSync && (
          <button
            type="button"
            onClick={onForceSync}
            className="text-[10px] text-sky-400 hover:text-sky-300 uppercase tracking-wider font-bold shrink-0 flex items-center gap-1 transition-colors"
            title="Forçar handshake com Rojo"
          >
            <RefreshCw className="w-2.5 h-2.5" />
            <span>Sync</span>
          </button>
        )}
      </div>
    </div>
  );
};
