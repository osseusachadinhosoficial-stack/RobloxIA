import React from 'react';
import {
  RotateCcw,
  Play,
  Square,
  Terminal,
  Bot,
  RefreshCw,
  Gamepad2,
  CheckCircle2,
  AlertCircle,
  Folder,
  Settings,
  ShieldCheck,
  Cpu,
  Layers,
  Activity
} from 'lucide-react';
import { BlueprintConfig, ServiceState, ServiceId, LiveLogItem } from '../types';
import { CustomizerPanel } from './CustomizerPanel';
import { DiagnosticChecklist } from './DiagnosticChecklist';

interface SystemSettingsTabProps {
  config: BlueprintConfig;
  onChangeConfig: (newConfig: BlueprintConfig) => void;
  services: ServiceState[];
  onRestartService: (id: ServiceId) => void;
  onToggleService: (id: ServiceId) => void;
  liveLogs: LiveLogItem[];
}

export const SystemSettingsTab: React.FC<SystemSettingsTabProps> = ({
  config,
  onChangeConfig,
  services,
  onRestartService,
  onToggleService,
  liveLogs
}) => {
  const getServiceIcon = (id: ServiceId) => {
    switch (id) {
      case 'rojo':
        return <RefreshCw className="w-4 h-4 text-indigo-400" />;
      case 'fcc-server':
        return <Terminal className="w-4 h-4 text-sky-400" />;
      case 'fcc-claude':
        return <Bot className="w-4 h-4 text-amber-400" />;
      case 'studio':
        return <Gamepad2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Layers className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#12161F] rounded-xl border border-slate-800 p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[10px] font-bold uppercase tracking-widest border border-sky-500/20 font-mono">
            Painel Avançado do Sistema
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            Gerenciamento Manual de Serviços
          </span>
        </div>
        <h2 className="text-xl font-bold text-white mt-1 tracking-tight">
          Configurações e Serviços em Segundo Plano
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Estes serviços rodam de forma 100% invisível em segundo plano na tela principal. Use esta tela apenas se precisar reiniciar ou verificar manualmente o status do Rojo ou do Cloud Code.
        </p>
      </div>

      {/* Manual Service Toggle Cards */}
      <div className="bg-[#12161F] rounded-xl border border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" />
            <span>Serviços de Segundo Plano (Controle Manual)</span>
          </h3>

          {/* Global Cluster Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={async () => {
                services.forEach(s => onRestartService(s.id));
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase bg-[#1A1F2B] border border-slate-700 hover:border-sky-500/50 text-slate-200 hover:text-white transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
              <span>Reiniciar Cluster</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {services.map((service) => {
            const isRunning = service.status === 'running';
            const isPending = service.status === 'starting' || service.status === 'restarting';

            return (
              <div
                key={service.id}
                className="bg-[#0A0D13] border border-slate-800 rounded-xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-black/50 border border-slate-800">
                        {getServiceIcon(service.id)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white font-mono uppercase">
                          {service.name}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {service.port ? `Porta :${service.port}` : 'Bridge Context'}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${
                        isRunning
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : isPending
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                          : 'bg-slate-800 text-slate-500 border-slate-700'
                      }`}
                    >
                      {isRunning ? 'Ativo' : isPending ? 'Iniciando' : 'Parado'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed mt-2">
                    {service.role}
                  </p>

                  <div className="mt-3 p-2 bg-[#12161F] rounded border border-slate-800/80 font-mono text-[10px] text-slate-400 truncate">
                    $ {service.command}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onRestartService(service.id)}
                    disabled={isPending}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono font-bold uppercase bg-[#1A1F2B] border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white transition-all disabled:opacity-50"
                  >
                    <RotateCcw className="w-3 h-3 text-sky-400" />
                    <span>Reiniciar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleService(service.id)}
                    className={`px-3 py-1.5 rounded text-xs font-mono font-bold uppercase transition-all ${
                      isRunning
                        ? 'bg-rose-950/30 text-rose-300 border border-rose-900/40 hover:bg-rose-950/50'
                        : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                    }`}
                  >
                    {isRunning ? 'Parar' : 'Ligar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Directory & Port Customization */}
      <CustomizerPanel config={config} onChangeConfig={onChangeConfig} />

      {/* Health Diagnostics Checklist */}
      <DiagnosticChecklist />
    </div>
  );
};
