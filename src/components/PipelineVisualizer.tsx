import React, { useState } from 'react';
import { 
  FolderCode, 
  Bot, 
  RefreshCw, 
  Gamepad2, 
  Copy, 
  Check, 
  Clock, 
  ArrowRight,
  Terminal,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { BlueprintConfig, BlueprintStep } from '../types';

interface PipelineVisualizerProps {
  steps: BlueprintStep[];
  config: BlueprintConfig;
  currentStepId: number | null;
  onSelectStep?: (stepId: number) => void;
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({
  steps,
  config,
  currentStepId,
}) => {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(id);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const getStepDotColor = (id: number) => {
    switch (id) {
      case 1:
        return 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]';
      case 2:
        return 'bg-sky-500 shadow-[0_0_6px_rgba(14,165,233,0.7)]';
      case 3:
        return 'bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.7)]';
      case 4:
        return 'bg-white shadow-[0_0_8px_white]';
      default:
        return 'bg-slate-400';
    }
  };

  const getStepIcon = (iconName: string, active: boolean, completed: boolean) => {
    const iconClass = `w-4 h-4 ${
      completed
        ? 'text-emerald-400'
        : active
        ? 'text-sky-400 animate-pulse'
        : 'text-slate-400'
    }`;

    switch (iconName) {
      case 'FolderCode':
        return <FolderCode className={iconClass} />;
      case 'Bot':
        return <Bot className={iconClass} />;
      case 'RefreshCw':
        return <RefreshCw className={iconClass} />;
      case 'Gamepad2':
        return <Gamepad2 className={iconClass} />;
      default:
        return <Terminal className={iconClass} />;
    }
  };

  return (
    <section className="bg-[#12161F] rounded-xl border border-slate-800 p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-5 border-b border-slate-800/80 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[10px] font-bold uppercase tracking-widest border border-sky-500/20">
              Fluxo Arquitetural
            </span>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">4 Fases Sequenciais</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1.5 tracking-tight uppercase">
            Blueprint de Inicialização do Ambiente
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Orquestração nativa partindo de <code className="text-xs bg-black/50 text-sky-400 px-1.5 py-0.5 rounded font-mono border border-slate-800">{config.baseDirectory}</code>
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto bg-[#1A1F2B] border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">Respiro:</span>
          <span className="font-bold font-mono text-amber-300 text-xs">
            {config.delaySeconds}s (IA &rarr; Rojo)
          </span>
        </div>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {steps.map((step) => {
          const isActive = currentStepId === step.id;
          const isCompleted = currentStepId !== null && currentStepId > step.id;
          const isPending = currentStepId === null || currentStepId < step.id;

          return (
            <div
              key={step.id}
              className={`relative rounded-xl border transition-all duration-200 flex flex-col justify-between p-4.5 overflow-hidden ${
                isActive
                  ? 'border-sky-500/60 bg-[#161C27] shadow-[0_0_15px_rgba(14,165,233,0.15)] ring-1 ring-sky-500/30'
                  : isCompleted
                  ? 'border-emerald-500/30 bg-emerald-950/10'
                  : 'border-slate-800 bg-[#0E121A]/70 hover:border-slate-700'
              }`}
            >
              {/* Subtle background watermark number 01, 02, etc. */}
              <div className="absolute top-0 right-0 p-3 opacity-10 font-mono text-5xl select-none text-slate-300 pointer-events-none font-bold">
                0{step.id}
              </div>

              {/* Header inside Card */}
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStepDotColor(step.id)}`} />
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      Fase 0{step.id}
                    </span>
                  </div>

                  {isActive && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                      <span className="w-1 h-1 rounded-full bg-sky-400 animate-ping" />
                      Executando
                    </span>
                  )}
                  {isCompleted && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider">
                      <Check className="w-3 h-3" /> OK
                    </span>
                  )}
                  {isPending && (
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-800/40 px-2 py-0.5 rounded uppercase tracking-wider">
                      Standby
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded bg-black/40 border border-slate-800 shrink-0 mt-0.5">
                    {getStepIcon(step.iconName, isActive, isCompleted)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xs sm:text-sm uppercase tracking-wide leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {step.terminalName || 'Diretório Raiz'}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                  {step.objective}
                </p>

                {step.syncNote && (
                  <div className="mt-2.5 p-2 rounded bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-1.5 font-mono">
                    <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{step.syncNote}</span>
                  </div>
                )}
              </div>

              {/* Bottom Command Display */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 relative z-10">
                {step.command ? (
                  <div className="flex items-center justify-between gap-1.5 bg-black/50 border border-slate-800 text-sky-300 px-2.5 py-1.5 rounded font-mono text-[11px]">
                    <span className="truncate max-w-[150px] sm:max-w-[170px]" title={step.command}>
                      {step.command}
                    </span>
                    <button
                      type="button"
                      id={`copy-cmd-step-${step.id}`}
                      onClick={() => handleCopy(step.command!, `step-${step.id}`)}
                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
                      title="Copiar comando"
                    >
                      {copiedCommand === `step-${step.id}` ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-1.5 bg-black/50 border border-slate-800 text-emerald-400/90 px-2.5 py-1.5 rounded font-mono text-[11px]">
                    <span className="truncate" title={config.baseDirectory}>
                      cd /d {config.baseDirectory}
                    </span>
                    <button
                      type="button"
                      id="copy-cmd-dir"
                      onClick={() => handleCopy(`cd /d "${config.baseDirectory}"`, 'dir')}
                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
                      title="Copiar caminho"
                    >
                      {copiedCommand === 'dir' ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Context Verification Strip */}
      <div className="mt-4 p-3 bg-[#0B0E14] border border-slate-800/90 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong className="text-slate-200">Garantia de Contexto Nativo:</strong> Todos os 3 terminais são iniciados com injeção explícita de diretório antes da invocação dos binários.
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px] shrink-0">
          <span>Rojo: <strong className="text-indigo-400">{config.rojoPort}</strong></span>
          <span>•</span>
          <span>Cloud Code: <strong className="text-sky-400">3001</strong></span>
        </div>
      </div>
    </section>
  );
};
