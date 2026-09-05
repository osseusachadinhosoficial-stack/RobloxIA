import React, { useState } from 'react';
import { 
  Stethoscope, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  ExternalLink, 
  Terminal, 
  HelpCircle,
  Folder,
  Bot,
  RefreshCw,
  Gamepad2
} from 'lucide-react';
import { DiagnosticItem } from '../types';
import { diagnosticChecklist } from '../data/blueprintData';

export const DiagnosticChecklist: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});

  const handleCopy = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleChecked = (id: string) => {
    setCheckedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'directory':
        return <Folder className="w-4 h-4 text-sky-400" />;
      case 'ai':
        return <Bot className="w-4 h-4 text-amber-400" />;
      case 'rojo':
        return <RefreshCw className="w-4 h-4 text-indigo-400" />;
      case 'studio':
        return <Gamepad2 className="w-4 h-4 text-slate-300" />;
      default:
        return <Terminal className="w-4 h-4 text-slate-400" />;
    }
  };

  const totalChecks = diagnosticChecklist.length;
  const completedChecks = Object.values(checkedMap).filter(Boolean).length;

  return (
    <section className="bg-[#12161F] rounded-xl border border-slate-800 p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight uppercase">
              Diagnóstico e Pré-Voo do Ambiente
            </h2>
            <p className="text-xs text-slate-400">
              Verifique os pré-requisitos antes de rodar os scripts de automação
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#1A1F2B] border border-slate-700 px-3 py-1.5 rounded-lg text-xs self-start sm:self-auto">
          <span className="text-slate-400 font-medium">Validação:</span>
          <span className="font-bold text-emerald-400 font-mono">
            {completedChecks}/{totalChecks} Verificados
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        {diagnosticChecklist.map((item) => {
          const isChecked = !!checkedMap[item.id];

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all ${
                isChecked
                  ? 'bg-[#12161F] border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.08)]'
                  : 'bg-[#0B0E14] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded bg-[#12161F] border border-slate-800 mt-0.5">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xs sm:text-sm uppercase tracking-wide">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Esperado: <span className="text-slate-300 font-medium">{item.expectedResult}</span>
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  id={`check-${item.id}`}
                  checked={isChecked}
                  onChange={() => toggleChecked(item.id)}
                  className="w-4 h-4 text-emerald-500 bg-slate-900 border-slate-700 rounded focus:ring-emerald-500 cursor-pointer mt-1 accent-emerald-500"
                  title="Marcar como verificado"
                />
              </div>

              {/* Command box with copy */}
              <div className="mt-3 flex items-center justify-between gap-2 bg-black/50 text-sky-400 px-2.5 py-1.5 rounded border border-slate-800 font-mono text-[11px]">
                <span className="truncate" title={item.checkCommand}>
                  {item.checkCommand}
                </span>
                <button
                  type="button"
                  id={`btn-copy-diag-${item.id}`}
                  onClick={() => handleCopy(item.checkCommand, item.id)}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors shrink-0"
                  title="Copiar comando de verificação"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Troubleshooting Tip */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-1.5 font-mono">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-amber-300">Dica:</strong> {item.troubleshootTip}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
