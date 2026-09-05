import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  FileCode, 
  Terminal, 
  Sparkles, 
  CheckCircle2, 
  Info,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { BlueprintConfig } from '../types';
import { 
  generateBatchScript, 
  generatePowerShellScript, 
  generateWindowsTerminalCommand, 
  generateVSCodeTasks 
} from '../utils/scriptGenerator';

interface ScriptGeneratorModalProps {
  config: BlueprintConfig;
}

export const ScriptGenerator: React.FC<ScriptGeneratorModalProps> = ({ config }) => {
  const [selectedFormat, setSelectedFormat] = useState<'batch' | 'powershell' | 'wt' | 'vscode'>('batch');
  const [copied, setCopied] = useState(false);

  const getScriptContent = () => {
    switch (selectedFormat) {
      case 'batch':
        return generateBatchScript(config);
      case 'powershell':
        return generatePowerShellScript(config);
      case 'wt':
        return generateWindowsTerminalCommand(config);
      case 'vscode':
        return generateVSCodeTasks(config);
      default:
        return generateBatchScript(config);
    }
  };

  const getFileName = () => {
    switch (selectedFormat) {
      case 'batch':
        return 'iniciar_ambiente.bat';
      case 'powershell':
        return 'iniciar_ambiente.ps1';
      case 'wt':
        return 'iniciar_windows_terminal.cmd';
      case 'vscode':
        return 'tasks.json';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getScriptContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = getScriptContent();
    const fileName = getFileName();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="bg-[#12161F] rounded-xl border border-slate-800 p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-slate-800/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[10px] font-bold uppercase tracking-widest border border-sky-500/20">
              Gerador de Scripts Nativos
            </span>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Deploy Imediato</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1.5 tracking-tight uppercase">
            Scripts de Automação do Ambiente
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Gere o arquivo executável pré-configurado com os caminhos nativos de <code className="text-xs bg-black/50 text-sky-400 px-1.5 py-0.5 rounded font-mono border border-slate-800">{config.baseDirectory}</code>.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            id="btn-download-script"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded text-xs font-bold uppercase tracking-wider bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Baixar {getFileName()}</span>
          </button>

          <button
            type="button"
            id="btn-copy-script"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded text-xs font-bold uppercase tracking-wider border border-slate-700 bg-[#1A1F2B] hover:border-slate-600 text-slate-200 hover:text-white transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copiar Código</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Format Selector Tabs */}
      <div className="flex items-center gap-2 pt-4 border-b border-slate-800 overflow-x-auto">
        <button
          type="button"
          id="tab-format-batch"
          onClick={() => setSelectedFormat('batch')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono transition-all border-b-2 whitespace-nowrap uppercase tracking-wider ${
            selectedFormat === 'batch'
              ? 'border-sky-400 text-white font-bold bg-[#1A1F2B] rounded-t'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#1A1F2B]/40'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-sky-400" />
          <span>Windows Batch (.bat)</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
            Recomendado
          </span>
        </button>

        <button
          type="button"
          id="tab-format-powershell"
          onClick={() => setSelectedFormat('powershell')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono transition-all border-b-2 whitespace-nowrap uppercase tracking-wider ${
            selectedFormat === 'powershell'
              ? 'border-sky-400 text-white font-bold bg-[#1A1F2B] rounded-t'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#1A1F2B]/40'
          }`}
        >
          <FileCode className="w-3.5 h-3.5 text-amber-400" />
          <span>PowerShell (.ps1)</span>
        </button>

        <button
          type="button"
          id="tab-format-wt"
          onClick={() => setSelectedFormat('wt')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono transition-all border-b-2 whitespace-nowrap uppercase tracking-wider ${
            selectedFormat === 'wt'
              ? 'border-sky-400 text-white font-bold bg-[#1A1F2B] rounded-t'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#1A1F2B]/40'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>Windows Terminal (wt.exe)</span>
        </button>

        <button
          type="button"
          id="tab-format-vscode"
          onClick={() => setSelectedFormat('vscode')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono transition-all border-b-2 whitespace-nowrap uppercase tracking-wider ${
            selectedFormat === 'vscode'
              ? 'border-sky-400 text-white font-bold bg-[#1A1F2B] rounded-t'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#1A1F2B]/40'
          }`}
        >
          <FileCode className="w-3.5 h-3.5 text-indigo-400" />
          <span>VS Code (tasks.json)</span>
        </button>
      </div>

      {/* Code Display Box */}
      <div className="mt-4 relative bg-[#090C11] rounded-xl border border-slate-800 p-4 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto max-h-[420px] scrollbar-thin">
        <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 mb-3 border-b border-slate-800">
          <span>Arquivo: <strong className="text-sky-400">{getFileName()}</strong></span>
          <span>Codificação: UTF-8 / Windows Command</span>
        </div>
        <pre className="leading-relaxed text-slate-300">
          <code>{getScriptContent()}</code>
        </pre>
      </div>

      {/* Step-by-Step Usage Instructions */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-xl bg-[#0E121A] border border-slate-800">
          <div className="w-6 h-6 rounded bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center text-xs font-bold font-mono mb-2">
            01
          </div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wide">Salvar no Projeto</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Clique em <strong>Baixar {getFileName()}</strong> e salve o arquivo na raiz: <code className="text-[11px] bg-black/50 text-sky-400 px-1 py-0.5 rounded font-mono border border-slate-800">{config.baseDirectory}</code>.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0E121A] border border-slate-800">
          <div className="w-6 h-6 rounded bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center text-xs font-bold font-mono mb-2">
            02
          </div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wide">Executar com 1 Clique</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Dê dois cliques no arquivo <code className="text-[11px] bg-black/50 text-sky-400 px-1 py-0.5 rounded font-mono border border-slate-800">{getFileName()}</code>. Ele abrirá os terminais em sequência com o delay de {config.delaySeconds}s.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0E121A] border border-slate-800">
          <div className="w-6 h-6 rounded bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center text-xs font-bold font-mono mb-2">
            03
          </div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wide">Sincronização no Studio</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Com o Rojo rodando na porta <code className="text-[11px] bg-black/50 text-sky-400 px-1 py-0.5 rounded font-mono border border-slate-800">{config.rojoPort}</code>, o Roblox Studio sincronizará as alterações em tempo real.
          </p>
        </div>
      </div>
    </section>
  );
};
