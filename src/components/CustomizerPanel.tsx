import React from 'react';
import { Settings2, RotateCcw, Folder, Clock, Hash, Gamepad2, Info } from 'lucide-react';
import { BlueprintConfig } from '../types';
import { defaultConfig } from '../data/blueprintData';

interface CustomizerPanelProps {
  config: BlueprintConfig;
  onChangeConfig: (newConfig: BlueprintConfig) => void;
}

export const CustomizerPanel: React.FC<CustomizerPanelProps> = ({ config, onChangeConfig }) => {
  const handleReset = () => {
    onChangeConfig(defaultConfig);
  };

  return (
    <section className="bg-[#12161F] rounded-xl border border-slate-800 p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
            <Settings2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight uppercase">
              Parâmetros do Ambiente
            </h2>
            <p className="text-xs text-slate-400">
              Personalize caminhos, portas e intervalos de sincronia do Blueprint
            </p>
          </div>
        </div>

        <button
          type="button"
          id="btn-reset-config"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white bg-[#1A1F2B] hover:border-slate-600 border border-slate-700 rounded transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
          <span>Restaurar Padrão Max</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
        {/* Diretório Base */}
        <div className="lg:col-span-2">
          <label htmlFor="input-base-dir" className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Folder className="w-3.5 h-3.5 text-sky-400" />
            <span>1. Diretório Base de Execução (Obrigatório)</span>
          </label>
          <input
            type="text"
            id="input-base-dir"
            value={config.baseDirectory}
            onChange={(e) => onChangeConfig({ ...config, baseDirectory: e.target.value })}
            className="w-full px-3.5 py-2 rounded-lg border border-slate-700 bg-[#0B0E14] text-slate-200 font-mono text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-all"
            placeholder="Ex: C:\Users\Max\RobloxWizardProject"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Todas as abas e ferramentas executarão comandos nativamente dentro desta pasta.
          </p>
        </div>

        {/* Respiro de Sincronia */}
        <div>
          <label htmlFor="input-delay" className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>2. Respiro de Sincronia</span>
            </span>
            <span className="text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-xs font-mono font-bold">
              {config.delaySeconds}s
            </span>
          </label>
          <div className="flex items-center gap-3 mt-2">
            <input
              type="range"
              id="input-delay"
              min={1}
              max={10}
              step={1}
              value={config.delaySeconds}
              onChange={(e) => onChangeConfig({ ...config, delaySeconds: parseInt(e.target.value, 10) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            Pausa entre <code className="text-[10px] bg-black/40 text-sky-300 px-1 py-0.5 rounded font-mono border border-slate-800">fcc-server</code> e <code className="text-[10px] bg-black/40 text-amber-300 px-1 py-0.5 rounded font-mono border border-slate-800">fcc-claude</code> para não sobrecarregar.
          </p>
        </div>

        {/* Porta Rojo */}
        <div>
          <label htmlFor="input-rojo-port" className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-indigo-400" />
            <span>3. Porta do Rojo Engine</span>
          </label>
          <input
            type="number"
            id="input-rojo-port"
            value={config.rojoPort}
            onChange={(e) => onChangeConfig({ ...config, rojoPort: parseInt(e.target.value, 10) || 34872 })}
            className="w-full px-3.5 py-2 rounded-lg border border-slate-700 bg-[#0B0E14] text-slate-200 font-mono text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
            placeholder="34872"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Porta padrão de escuta do Rojo (34872).
          </p>
        </div>

        {/* Arquivo de Place Roblox */}
        <div>
          <label htmlFor="input-place-file" className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Gamepad2 className="w-3.5 h-3.5 text-sky-400" />
            <span>4. Arquivo do Jogo (.rbxl)</span>
          </label>
          <input
            type="text"
            id="input-place-file"
            value={config.robloxPlaceFile}
            onChange={(e) => onChangeConfig({ ...config, robloxPlaceFile: e.target.value })}
            className="w-full px-3.5 py-2 rounded-lg border border-slate-700 bg-[#0B0E14] text-slate-200 font-mono text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
            placeholder="Ex: place.rbxl"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Arquivo aberto diretamente ao final da inicialização.
          </p>
        </div>

        {/* Toggle Auto Launch Studio */}
        <div className="flex flex-col justify-center">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Automação Visual
          </label>
          <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-800 bg-[#0B0E14]">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="toggle-auto-launch-studio"
                checked={config.autoLaunchStudio}
                onChange={(e) => onChangeConfig({ ...config, autoLaunchStudio: e.target.checked })}
                className="w-4 h-4 text-sky-500 bg-slate-900 border-slate-700 rounded focus:ring-sky-500 cursor-pointer accent-sky-500"
              />
              <label htmlFor="toggle-auto-launch-studio" className="text-xs font-medium text-slate-300 cursor-pointer">
                Abrir Roblox Studio automaticamente
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
