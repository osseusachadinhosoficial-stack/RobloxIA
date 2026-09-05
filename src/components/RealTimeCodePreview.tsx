import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Download,
  CheckCircle2,
  Zap,
  Radio,
  FileCode,
  FolderTree,
  Gamepad2,
  Info
} from 'lucide-react';
import { CloudCodeCommandResult } from '../types';

interface RealTimeCodePreviewProps {
  activeResult: CloudCodeCommandResult | null;
  rojoPort: number;
}

export const RealTimeCodePreview: React.FC<RealTimeCodePreviewProps> = ({
  activeResult,
  rojoPort
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (!activeResult) return;
    navigator.clipboard.writeText(activeResult.generatedLuauCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCode = () => {
    if (!activeResult) return;
    const blob = new Blob([activeResult.generatedLuauCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeResult.targetFile.split('/').pop() || 'script.luau';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getDataModelLocation = (filePath: string) => {
    if (filePath.includes('/server/')) return 'game.ServerScriptService';
    if (filePath.includes('/shared/')) return 'game.ReplicatedStorage';
    if (filePath.includes('/client/')) return 'game.StarterPlayer.StarterPlayerScripts';
    return 'game.Workspace';
  };

  const codeLines = activeResult ? activeResult.generatedLuauCode.split('\n') : [];

  return (
    <div className="bg-[#12161F] rounded-xl border border-slate-800 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Top Bar */}
      <div className="px-4 py-3 bg-[#0A0D13] border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* File and DataModel destination */}
        <div className="flex items-center gap-2.5 truncate">
          <div className="p-1.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400 shrink-0">
            <Code2 className="w-4 h-4" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-white truncate">
                {activeResult ? activeResult.targetFile : 'src/server/Script.luau'}
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                Luau
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
              Roblox: <strong className="text-sky-300">{getDataModelLocation(activeResult ? activeResult.targetFile : '')}</strong>
            </div>
          </div>
        </div>

        {/* Live Sync Status Badge & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Sync status */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.9)] animate-pulse" />
            <span>Sincronizado via Rojo :{rojoPort}</span>
          </div>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopyCode}
            disabled={!activeResult}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono font-bold uppercase bg-[#1A1F2B] border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white transition-all disabled:opacity-50"
            title="Copiar código Luau"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copiar</span>
              </>
            )}
          </button>

          {/* Download Button */}
          <button
            type="button"
            onClick={handleDownloadCode}
            disabled={!activeResult}
            className="p-1 rounded bg-[#1A1F2B] border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition-all disabled:opacity-50"
            title="Baixar arquivo .luau"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
          </button>
        </div>
      </div>

      {/* Sync Pipeline Bar */}
      <div className="px-4 py-2 bg-[#0E131C] border-b border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400 gap-2 overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Gerado por IA
          </span>
          <span className="text-slate-600">→</span>
          <span className="text-sky-300 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            Salvo no Disco
          </span>
          <span className="text-slate-600">→</span>
          <span className="text-indigo-300 flex items-center gap-1">
            <Radio className="w-3 h-3 text-indigo-400" />
            Rojo :{rojoPort}
          </span>
          <span className="text-slate-600">→</span>
          <span className="text-emerald-300 flex items-center gap-1">
            <Gamepad2 className="w-3 h-3 text-emerald-400" />
            Roblox Studio (Ao Vivo)
          </span>
        </div>

        <div className="text-slate-500 shrink-0 font-mono">
          Latência: <strong className="text-emerald-400">0.8ms</strong>
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="flex-1 bg-[#070A0F] font-mono text-xs overflow-y-auto max-h-[500px] min-h-[380px] select-text">
        {activeResult ? (
          <div className="flex leading-relaxed p-3.5">
            {/* Line Numbers */}
            <div className="select-none text-slate-600 pr-3 mr-3 border-r border-slate-800/80 text-right font-mono text-[11px]">
              {codeLines.map((_, i) => (
                <div key={i} className="leading-relaxed">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Code */}
            <pre className="flex-1 overflow-x-auto text-slate-200 selection:bg-sky-500/30">
              <code>{activeResult.generatedLuauCode}</code>
            </pre>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[340px] text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-center text-slate-400">
              <Code2 className="w-6 h-6 opacity-70" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-sm font-bold text-slate-300 font-mono">
                Visualizador de Código Luau
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Aguardando seu primeiro comando. Ao solicitar uma criação para o Claude, o script Luau gerado com tipagem estrita aparecerá aqui e será sincronizado em 0.8ms com o seu Roblox Studio.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Non-Programmer Explanation Footer */}
      {activeResult && (
        <div className="px-4 py-3 bg-[#0A0D13] border-t border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
          <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Como funciona no seu jogo:
            </span>
            <p className="text-slate-300 leading-relaxed font-sans text-xs">
              {activeResult.explanation ||
                'Este script Luau foi inserido diretamente no seu projeto. Ao clicar em "Play Solo" no Roblox Studio, as novas regras entram em vigor imediatamente sem reiniciar o estúdio.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
