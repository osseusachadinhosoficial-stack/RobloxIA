import React from 'react';
import {
  Play,
  Square,
  RotateCcw,
  Bot,
  RefreshCw,
  Gamepad2,
  Terminal,
  Activity,
  Cpu,
  Layers,
  CheckCircle2,
  AlertCircle,
  Zap,
  Clock
} from 'lucide-react';
import { ServiceState, ServiceId, BlueprintConfig } from '../types';

interface ServiceStateControlsProps {
  services: ServiceState[];
  config: BlueprintConfig;
  onStartService: (id: ServiceId) => void;
  onStopService: (id: ServiceId) => void;
  onRestartService: (id: ServiceId) => void;
  onStartAll: () => void;
  onStopAll: () => void;
  onRestartAll: () => void;
  isStartingAll?: boolean;
}

export const ServiceStateControls: React.FC<ServiceStateControlsProps> = ({
  services,
  config,
  onStartService,
  onStopService,
  onRestartService,
  onStartAll,
  onStopAll,
  onRestartAll,
  isStartingAll = false
}) => {
  const getServiceIcon = (id: ServiceId) => {
    switch (id) {
      case 'fcc-server':
        return <Terminal className="w-4 h-4 text-sky-400" />;
      case 'fcc-claude':
        return <Bot className="w-4 h-4 text-amber-400" />;
      case 'rojo':
        return <RefreshCw className="w-4 h-4 text-indigo-400" />;
      case 'studio':
        return <Gamepad2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Layers className="w-4 h-4 text-slate-400" />;
    }
  };

  const formatUptime = (seconds: number) => {
    if (seconds <= 0) return '0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  const totalRunning = services.filter((s) => s.status === 'running').length;
  const allRunning = totalRunning === services.length;
  const anyRunning = totalRunning > 0;

  return (
    <section className="bg-[#12161F] rounded-xl border border-slate-800 p-5 sm:p-6 shadow-sm">
      {/* Header & Global Master Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-slate-800/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[10px] font-bold uppercase tracking-widest border border-sky-500/20">
              Controles de Estado
            </span>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
              {totalRunning}/{services.length} Serviços Ativos
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1.5 tracking-tight uppercase">
            Gerenciamento Individual de Serviços
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ligue, reinicie ou finalize cada processo nativo com feedback visual em tempo real.
          </p>
        </div>

        {/* Global Cluster Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            type="button"
            id="btn-master-start-all"
            onClick={onStartAll}
            disabled={allRunning || isStartingAll}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all ${
              allRunning
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                : isStartingAll
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isStartingAll ? 'Iniciando Cadeia...' : 'Iniciar Todos (Com Respiro)'}</span>
          </button>

          <button
            type="button"
            id="btn-master-restart-all"
            onClick={onRestartAll}
            disabled={!anyRunning}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded text-xs font-bold uppercase tracking-wider bg-[#1A1F2B] border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
            <span>Reiniciar Cluster</span>
          </button>

          <button
            type="button"
            id="btn-master-stop-all"
            onClick={onStopAll}
            disabled={!anyRunning}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded text-xs font-bold uppercase tracking-wider bg-[#1A1F2B] border border-rose-900/40 hover:bg-rose-950/20 text-rose-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Square className="w-3.5 h-3.5 text-rose-400 fill-current" />
            <span>Parar Todos</span>
          </button>
        </div>
      </div>

      {/* 4 Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-5">
        {services.map((service) => {
          const isRunning = service.status === 'running';
          const isPending = service.status === 'starting' || service.status === 'restarting';
          const isStopped = service.status === 'stopped';

          return (
            <div
              key={service.id}
              className={`rounded-xl border p-4 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                isRunning
                  ? 'border-emerald-500/40 bg-[#0E151E] shadow-[0_0_18px_rgba(16,185,129,0.07)]'
                  : isPending
                  ? 'border-amber-500/40 bg-[#161713] shadow-[0_0_18px_rgba(245,158,11,0.08)]'
                  : 'border-slate-800 bg-[#0A0D13] opacity-85'
              }`}
            >
              {/* Top Row: Service Name + Status Badge */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded bg-black/40 border border-slate-800 shrink-0">
                      {getServiceIcon(service.id)}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                        {service.name}
                      </h3>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {service.port ? `Porta :${service.port}` : 'CLI / UI'}
                      </span>
                    </div>
                  </div>

                  {/* Status LED & Badge */}
                  <div>
                    {isRunning && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.9)] animate-pulse" />
                        ONLINE
                      </span>
                    )}
                    {isPending && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                        {service.status === 'restarting' ? 'REINICIANDO' : 'SUBINDO'}
                      </span>
                    )}
                    {isStopped && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-800/40 border border-slate-700/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                        PARADO
                      </span>
                    )}
                  </div>
                </div>

                {/* Role description */}
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  {service.role}
                </p>

                {/* Command preview */}
                <div className="mt-3 bg-black/40 border border-slate-800/90 rounded px-2.5 py-1 text-[10px] font-mono text-slate-400 truncate" title={service.command}>
                  <span className="text-slate-600">$ </span>
                  {service.command}
                </div>

                {/* Live Metrics strip */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 font-mono text-[10px]">
                  <div className="bg-[#12161F] p-1.5 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase">PID</span>
                    <span className="text-slate-300 font-bold">{isRunning ? service.pid : '—'}</span>
                  </div>
                  <div className="bg-[#12161F] p-1.5 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase">Uptime</span>
                    <span className={`font-bold ${isRunning ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {isRunning ? formatUptime(service.uptimeSeconds) : '0s'}
                    </span>
                  </div>
                  <div className="bg-[#12161F] p-1.5 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase">RAM</span>
                    <span className="text-slate-300 font-bold">{isRunning ? `${service.memoryMb}MB` : '0MB'}</span>
                  </div>
                </div>
              </div>

              {/* Individual Control Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-1.5">
                {/* Play button */}
                <button
                  type="button"
                  id={`btn-service-start-${service.id}`}
                  onClick={() => onStartService(service.id)}
                  disabled={isRunning || isPending}
                  className={`flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider transition-all ${
                    isRunning
                      ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm'
                  }`}
                  title={`Iniciar ${service.name}`}
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Play</span>
                </button>

                {/* Restart button */}
                <button
                  type="button"
                  id={`btn-service-restart-${service.id}`}
                  onClick={() => onRestartService(service.id)}
                  disabled={isStopped || isPending}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#1A1F2B] border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  title={`Reiniciar ${service.name} com ${config.delaySeconds}s de respiro`}
                >
                  <RotateCcw className="w-3 h-3 text-sky-400" />
                  <span>Restart</span>
                </button>

                {/* Stop button */}
                <button
                  type="button"
                  id={`btn-service-stop-${service.id}`}
                  onClick={() => onStopService(service.id)}
                  disabled={isStopped || isPending}
                  className="inline-flex items-center justify-center p-1.5 rounded text-[11px] font-bold bg-[#1A1F2B] border border-rose-900/30 hover:border-rose-700/50 text-rose-400 hover:bg-rose-950/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  title={`Parar ${service.name}`}
                >
                  <Square className="w-3 h-3 fill-current" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
