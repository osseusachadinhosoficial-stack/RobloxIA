import React from 'react';
import { Terminal, FolderGit2, Play, Sparkles, RefreshCw } from 'lucide-react';
import { BlueprintConfig } from '../types';

interface HeaderProps {
  config: BlueprintConfig;
  onOpenGenerator: () => void;
  onStartSimulation: () => void;
  isSimulating: boolean;
  simulationProgress: number;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  onOpenGenerator,
  onStartSimulation,
  isSimulating,
  simulationProgress,
}) => {
  return (
    <header className="border-b border-slate-800 bg-[#12161F] sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Project & Title Info */}
        <div className="flex items-center gap-3.5">
          <div className="w-8 h-8 bg-sky-500 rounded flex items-center justify-center text-slate-950 shadow-sm">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-sm font-bold text-white tracking-tight uppercase">
                Roblox Dev Blueprint
              </h1>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20 font-bold flex items-center gap-1.5 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
                System Ready
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono mt-0.5">
              <FolderGit2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate max-w-[260px] sm:max-w-md text-sky-400 font-medium">
                {config.baseDirectory}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            id="btn-quick-simulate"
            onClick={onStartSimulation}
            disabled={isSimulating}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all border ${
              isSimulating
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 cursor-wait'
                : 'bg-[#1A1F2B] border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white'
            }`}
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>Simulando ({Math.round(simulationProgress)}%)</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current text-sky-400" />
                <span>Simular Boot</span>
              </>
            )}
          </button>

          <button
            type="button"
            id="btn-open-generator-header"
            onClick={onOpenGenerator}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-sky-500 hover:bg-sky-400 text-slate-950 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gerar Scripts (.bat / .ps1)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
