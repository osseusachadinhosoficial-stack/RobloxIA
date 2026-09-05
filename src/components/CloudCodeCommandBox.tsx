import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  FileCode,
  Check,
  Copy,
  Download,
  Terminal,
  RefreshCw,
  Zap,
  ArrowRight,
  Code2,
  CheckCircle2,
  Clock,
  Layers,
  Flame,
  AlertCircle
} from 'lucide-react';
import { BlueprintConfig, CloudCodeCommandResult } from '../types';
import { promptPresets } from '../data/blueprintData';

interface CloudCodeCommandBoxProps {
  config: BlueprintConfig;
  onExecuteCommand: (prompt: string, targetFile: string) => Promise<CloudCodeCommandResult>;
  isProcessing: boolean;
  history: CloudCodeCommandResult[];
}

export const CloudCodeCommandBox: React.FC<CloudCodeCommandBoxProps> = ({
  config,
  onExecuteCommand,
  isProcessing,
  history
}) => {
  const [prompt, setPrompt] = useState('');
  const [targetDir, setTargetDir] = useState<'server' | 'client' | 'shared'>('server');
  const [customFileName, setCustomFileName] = useState('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'history'>('editor');

  const activeResult = history[0] || null;

  const handleApplyPreset = (presetPrompt: string, suggestedFile: string, type: string) => {
    setPrompt(presetPrompt);
    if (type === 'server') setTargetDir('server');
    else if (type === 'client') setTargetDir('client');
    else setTargetDir('shared');

    const fileNameOnly = suggestedFile.split('/').pop() || '';
    setCustomFileName(fileNameOnly);
  };

  const getComputedTargetFilePath = () => {
    if (customFileName.trim()) {
      return `src/${targetDir}/${customFileName.trim()}`;
    }
    const ext = targetDir === 'server' ? '.server.luau' : targetDir === 'client' ? '.client.luau' : '.luau';
    return `src/${targetDir}/Script_${Date.now().toString().slice(-4)}${ext}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isProcessing) return;

    const path = getComputedTargetFilePath();
    await onExecuteCommand(prompt.trim(), path);
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleDownloadFile = (fileName: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.split('/').pop() || 'script.luau';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="bg-[#12161F] rounded-xl border border-slate-800 p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800/80 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-widest border border-amber-500/20">
              Cloud Code Prompt Direct
            </span>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
              Sem Alternar Telas
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1.5 tracking-tight uppercase">
            Caixa de Comandos Integrada
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Digite instruções em linguagem natural para o Cloud Code gerar e injetar código Luau diretamente na raiz do projeto.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 p-1 bg-[#0B0E14] border border-slate-800 rounded-lg text-xs self-start sm:self-auto font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1 rounded font-bold uppercase tracking-wider transition-all ${
              activeTab === 'editor'
                ? 'bg-sky-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Prompt & Código
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1 rounded font-bold uppercase tracking-wider transition-all ${
              activeTab === 'history'
                ? 'bg-sky-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Histórico ({history.length})
          </button>
        </div>
      </div>

      {activeTab === 'editor' ? (
        <div className="mt-5 space-y-5">
          {/* Quick Presets Bar */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Sugestões Rápidas de Luau para o Roblox
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {promptPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset.prompt, preset.targetFile, preset.type)}
                  className="text-left p-2.5 rounded-lg border border-slate-800 bg-[#0B0E14] hover:border-slate-700 hover:bg-[#161B26] transition-all group"
                >
                  <div className="text-[11px] font-bold text-slate-200 group-hover:text-sky-400 flex items-center justify-between">
                    <span>{preset.title}</span>
                    <span className="text-[9px] font-mono text-slate-500 uppercase px-1 rounded bg-black/40 border border-slate-800">
                      {preset.type}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 truncate mt-1">
                    {preset.targetFile}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Input Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Target directory selector */}
            <div className="flex items-center flex-wrap justify-between gap-3 p-2.5 rounded-lg bg-[#0B0E14] border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Destino:
                </span>
                <div className="flex items-center gap-1">
                  {(['server', 'shared', 'client'] as const).map((dir) => (
                    <button
                      key={dir}
                      type="button"
                      onClick={() => setTargetDir(dir)}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold uppercase transition-all ${
                        targetDir === dir
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'bg-[#12161F] text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      src/{dir}/
                    </button>
                  ))}
                </div>
              </div>

              {/* Target File name override */}
              <div className="flex items-center gap-2 flex-1 sm:max-w-xs">
                <FileCode className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <input
                  type="text"
                  value={customFileName}
                  onChange={(e) => setCustomFileName(e.target.value)}
                  placeholder={`Ex: ${targetDir === 'server' ? 'Leaderstats.server.luau' : targetDir === 'shared' ? 'Module.luau' : 'Controller.client.luau'}`}
                  className="w-full px-2.5 py-1 text-xs font-mono bg-[#12161F] border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Prompt textarea */}
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                rows={3}
                placeholder="Descreva o que deseja programar... Ex: Crie um script de servidor com DataStore salvando Moedas e XP ao sair, com auto-save e pcall."
                className="w-full p-3.5 pr-28 rounded-xl bg-[#0B0E14] border border-slate-700 text-slate-100 text-xs sm:text-sm font-sans placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all resize-y"
              />

              {/* Submit Button Inside/Beside */}
              <div className="absolute right-2.5 bottom-3 flex items-center gap-2">
                <button
                  type="submit"
                  disabled={!prompt.trim() || isProcessing}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    isProcessing
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 cursor-wait'
                      : !prompt.trim()
                      ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                      : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sm cursor-pointer'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Gerando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Executar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 font-mono">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-amber-400" />
                Pressione <kbd className="bg-slate-800 px-1 py-0.5 rounded text-slate-300">Enter</kbd> para enviar ou <kbd className="bg-slate-800 px-1 py-0.5 rounded text-slate-300">Shift+Enter</kbd> para pular linha.
              </span>
              <span>Alvo: <strong className="text-sky-400">{getComputedTargetFilePath()}</strong></span>
            </div>
          </form>

          {/* Generated Code Output Window */}
          {activeResult && (
            <div className="rounded-xl border border-slate-800 bg-[#0B0E14] overflow-hidden">
              {/* Output Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 bg-[#090C11] border-b border-slate-800 gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-1 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-white">
                        {activeResult.targetFile}
                      </span>
                      {activeResult.syncedWithRojo && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Rojo Synced
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                      Gerado pelo Cloud Code Engine às {activeResult.timestamp}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyCode(activeResult.generatedLuauCode, activeResult.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-[#1A1F2B] border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white transition-all font-mono"
                  >
                    {copiedCodeId === activeResult.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copiar Luau</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadFile(activeResult.targetFile, activeResult.generatedLuauCode)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-[#1A1F2B] border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white transition-all font-mono"
                  >
                    <Download className="w-3.5 h-3.5 text-sky-400" />
                    <span>Baixar</span>
                  </button>
                </div>
              </div>

              {/* Actions list taken */}
              <div className="px-4 py-2 bg-[#12161F]/60 border-b border-slate-800 text-[11px] font-mono text-slate-400 flex items-center flex-wrap gap-3">
                <span className="text-slate-500 font-bold uppercase">Ações Executadas:</span>
                {activeResult.actionsTaken.map((action, i) => (
                  <span key={i} className="flex items-center gap-1 text-slate-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {action}
                  </span>
                ))}
              </div>

              {/* Code display block */}
              <div className="p-4 max-h-96 overflow-y-auto font-mono text-xs text-slate-200 leading-relaxed selection:bg-sky-500/30">
                <pre>
                  <code>{activeResult.generatedLuauCode}</code>
                </pre>
              </div>

              {/* Explanation footer */}
              {activeResult.explanation && (
                <div className="p-3 bg-[#090C11] border-t border-slate-800 text-xs text-slate-400 leading-relaxed font-sans">
                  <strong className="text-slate-200 uppercase font-mono text-[10px] block mb-1">
                    Nota do Cloud Code:
                  </strong>
                  {activeResult.explanation}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* History View */
        <div className="mt-5 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-mono text-xs">
              Nenhum comando executado até o momento. Experimente digitar algo na aba &quot;Prompt &amp; Código&quot;.
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-800 bg-[#0B0E14] hover:border-slate-700 transition-all flex flex-col gap-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-sky-400">
                      {item.targetFile}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {item.timestamp}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(item.generatedLuauCode, item.id)}
                    className="p-1 rounded text-slate-400 hover:text-white bg-[#1A1F2B] border border-slate-800"
                    title="Copiar código gerado"
                  >
                    {copiedCodeId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-300 font-medium line-clamp-2">
                  &ldquo;{item.prompt}&rdquo;
                </p>
                <div className="text-[11px] font-mono text-slate-500 flex items-center gap-3 mt-1">
                  <span>{item.generatedLuauCode.split('\n').length} linhas geradas</span>
                  <span>•</span>
                  <span className="text-emerald-400">Sincronizado via Rojo</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
};
