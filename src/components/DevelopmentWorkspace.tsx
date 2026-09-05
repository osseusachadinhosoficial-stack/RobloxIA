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
  Radio,
  Gamepad2,
  FolderTree,
  ChevronRight
} from 'lucide-react';
import { BlueprintConfig, CloudCodeCommandResult, ServiceState } from '../types';
import { promptPresets } from '../data/blueprintData';
import { RobloxStudioMiniPreview } from './RobloxStudioMiniPreview';

interface DevelopmentWorkspaceProps {
  config: BlueprintConfig;
  onExecuteCommand: (prompt: string, targetFile: string) => Promise<CloudCodeCommandResult>;
  isProcessing: boolean;
  activeResult: CloudCodeCommandResult | null;
  history: CloudCodeCommandResult[];
  onSelectHistoryItem: (item: CloudCodeCommandResult) => void;
  rojoService?: ServiceState;
  isPlayingStudioTest?: boolean;
  onTogglePlayStudio?: () => void;
  onForceRojoSync?: () => void;
}

export const DevelopmentWorkspace: React.FC<DevelopmentWorkspaceProps> = ({
  config,
  onExecuteCommand,
  isProcessing,
  activeResult,
  history,
  onSelectHistoryItem,
  rojoService,
  isPlayingStudioTest = false,
  onTogglePlayStudio,
  onForceRojoSync
}) => {
  const [prompt, setPrompt] = useState('');
  const [targetDir, setTargetDir] = useState<'server' | 'client' | 'shared'>('server');
  const [customFileName, setCustomFileName] = useState('');
  const [copied, setCopied] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);

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

  const handleCopyCode = () => {
    if (!activeResult) return;
    navigator.clipboard.writeText(activeResult.generatedLuauCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
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

  // Convert code into numbered lines
  const codeLines = activeResult ? activeResult.generatedLuauCode.split('\n') : [];

  // Determine DataModel path in Roblox
  const getDataModelLocation = (filePath: string) => {
    if (filePath.includes('/server/')) return 'game.ServerScriptService';
    if (filePath.includes('/shared/')) return 'game.ReplicatedStorage';
    if (filePath.includes('/client/')) return 'game.StarterPlayer.StarterPlayerScripts';
    return 'game.Workspace';
  };

  return (
    <div className="space-y-5">
      {/* Top Workspace Bar & Mini Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Workspace Intro Card */}
        <div className="lg:col-span-2 bg-[#12161F] rounded-xl border border-slate-800 p-5 shadow-sm flex flex-col justify-between min-h-[140px]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[10px] font-bold uppercase tracking-widest border border-sky-500/20 font-mono">
                Workspace Ativo
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Automação em Segundo Plano
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-1.5 tracking-tight">
              Desenvolvimento Roblox &amp; Cloud Code
            </h1>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-2xl">
              Crie lógica em Luau usando comandos em linguagem natural. O Cloud Code sintetiza o código e o Rojo o injeta diretamente no Roblox Studio sem alternar de tela.
            </p>
          </div>

          {/* Minimal quick status pills */}
          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400 mt-3 pt-3 border-t border-slate-800/80 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
              Daemons: <strong className="text-slate-200">100% Ocultos em Background</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              Motor: <strong className="text-indigo-300">Rojo :34872</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              Backend: <strong className="text-sky-300">Cloud Code :3001</strong>
            </span>
          </div>
        </div>

        {/* Compact Roblox Studio Mini Preview */}
        <div className="lg:col-span-1">
          <RobloxStudioMiniPreview
            config={config}
            rojoService={rojoService}
            lastSyncedFile={activeResult ? activeResult.targetFile : 'src/server/LeaderstatsService.server.luau'}
            lastSyncTime={activeResult ? activeResult.timestamp : 'Agora'}
            isPlaying={isPlayingStudioTest}
            onTogglePlay={onTogglePlayStudio}
            onForceSync={onForceRojoSync}
          />
        </div>
      </div>

      {/* Main Two Columns: Left (Prompt) & Right (Live Luau Code & Sync Status) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* LEFT COLUMN: Caixa de Comandos Integrada (Minimalista) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="bg-[#12161F] rounded-xl border border-slate-800 p-5 shadow-sm flex-1 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      Caixa de Comandos
                    </h2>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Prompt Direto do Cloud Code
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  Pronto
                </span>
              </div>

              {/* Main Input Form */}
              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                {/* Target Directory & File */}
                <div className="p-2.5 rounded-lg bg-[#0B0E14] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                      Destino no Roblox:
                    </span>
                    <span className="text-[10px] text-sky-400 font-mono">
                      {getDataModelLocation(`src/${targetDir}/`)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {(
                      [
                        { id: 'server', label: 'Server', path: 'src/server/' },
                        { id: 'shared', label: 'Shared', path: 'src/shared/' },
                        { id: 'client', label: 'Client', path: 'src/client/' }
                      ] as const
                    ).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setTargetDir(item.id)}
                        className={`flex-1 py-1 px-2 rounded text-[11px] font-mono font-bold transition-all text-center ${
                          targetDir === item.id
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                            : 'bg-[#12161F] text-slate-400 hover:text-slate-200 border border-slate-800'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {/* Target File Name */}
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
                    <FileCode className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={customFileName}
                      onChange={(e) => setCustomFileName(e.target.value)}
                      placeholder={targetDir === 'server' ? 'Leaderstats.server.luau' : targetDir === 'shared' ? 'Types.luau' : 'HUD.client.luau'}
                      className="w-full text-xs font-mono bg-transparent text-slate-200 placeholder-slate-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Prompt Textarea */}
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
                    rows={4}
                    placeholder="Descreva a mecânica ou script Luau... Ex: Crie um sistema de moedas com DataStore, auto-save e pcall para cada jogador."
                    className="w-full p-3 rounded-xl bg-[#0B0E14] border border-slate-700 text-slate-100 text-xs sm:text-sm font-sans placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all resize-none"
                  />

                  {/* Keyboard hint */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 px-1 font-mono">
                    <span>
                      <kbd className="bg-slate-800 px-1 py-0.5 rounded text-slate-400">Enter</kbd> executa • <kbd className="bg-slate-800 px-1 py-0.5 rounded text-slate-400">Shift+Enter</kbd> linha
                    </span>
                    <span className="text-slate-400 truncate max-w-[160px]">
                      {getComputedTargetFilePath()}
                    </span>
                  </div>
                </div>

                {/* Primary Execute Button */}
                <button
                  type="submit"
                  disabled={!prompt.trim() || isProcessing}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    isProcessing
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 cursor-wait'
                      : !prompt.trim()
                      ? 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700/50'
                      : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sm cursor-pointer'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Sintetizando Luau &amp; Sincronizando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Executar no Cloud Code</span>
                    </>
                  )}
                </button>
              </form>

              {/* Quick Presets Section */}
              <div className="mt-4 pt-4 border-t border-slate-800/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block mb-2">
                  Atalhos Rápidos de Luau:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {promptPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(preset.prompt, preset.targetFile, preset.type)}
                      className="p-2 rounded-lg bg-[#0B0E14] border border-slate-800/90 hover:border-sky-500/40 hover:bg-[#151A24] transition-all text-left group"
                    >
                      <div className="text-[11px] font-bold text-slate-300 group-hover:text-sky-300 flex items-center justify-between">
                        <span className="truncate">{preset.title}</span>
                        <span className="text-[8px] font-mono uppercase px-1 rounded bg-black/50 text-slate-400 border border-slate-800">
                          {preset.type}
                        </span>
                      </div>
                      <div className="text-[9px] font-mono text-slate-500 truncate mt-0.5">
                        {preset.targetFile}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Execution Chips */}
            {history.length > 1 && (
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono block mb-1.5">
                  Recentes:
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {history.slice(0, 4).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectHistoryItem(item)}
                      className={`px-2 py-1 rounded text-[10px] font-mono truncate max-w-[150px] transition-all ${
                        activeResult?.id === item.id
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                          : 'bg-[#0B0E14] text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                      title={item.prompt}
                    >
                      {item.targetFile.split('/').pop()}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Painel de Visualização em Tempo Real (Luau & Status de Envio) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="bg-[#12161F] rounded-xl border border-slate-800 shadow-sm flex-1 flex flex-col overflow-hidden">
            
            {/* Top Editor Bar */}
            <div className="px-4 py-3 bg-[#0A0D13] border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              {/* File Title & Roblox Target */}
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
                    Destino: <strong className="text-sky-300">{getDataModelLocation(activeResult ? activeResult.targetFile : '')}</strong>
                  </div>
                </div>
              </div>

              {/* Status Badge & Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Send Status Badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)] animate-pulse" />
                  <span>Enviado ao Roblox</span>
                </div>

                {/* Copy Button */}
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono font-bold uppercase bg-[#1A1F2B] border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white transition-all"
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
                  onClick={handleDownloadFile}
                  className="p-1 rounded bg-[#1A1F2B] border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition-all"
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
                  AST Válida
                </span>
                <span className="text-slate-600">→</span>
                <span className="text-sky-300 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  Gravado no Disco
                </span>
                <span className="text-slate-600">→</span>
                <span className="text-indigo-300 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-indigo-400" />
                  Rojo :34872
                </span>
                <span className="text-slate-600">→</span>
                <span className="text-emerald-300 flex items-center gap-1">
                  <Gamepad2 className="w-3 h-3 text-emerald-400" />
                  Roblox Studio Live
                </span>
              </div>

              <div className="text-slate-500 shrink-0">
                Latência: <strong className="text-emerald-400">0.8ms</strong>
              </div>
            </div>

            {/* Luau Code Display Window with Line Numbers */}
            <div className="flex-1 bg-[#070A0F] font-mono text-xs overflow-y-auto max-h-[500px] min-h-[380px] select-text">
              {activeResult ? (
                <div className="flex leading-relaxed p-3">
                  {/* Line Numbers column */}
                  {showLineNumbers && (
                    <div className="select-none text-slate-600 pr-3 mr-3 border-r border-slate-800/80 text-right font-mono text-[11px] space-y-0">
                      {codeLines.map((_, i) => (
                        <div key={i} className="leading-relaxed">
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Code Text Content */}
                  <pre className="flex-1 overflow-x-auto text-slate-200 selection:bg-sky-500/30">
                    <code>{activeResult.generatedLuauCode}</code>
                  </pre>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-72 text-slate-600 space-y-2 font-mono text-xs">
                  <Code2 className="w-8 h-8 opacity-40" />
                  <p>Aguardando comando na Caixa de Comandos...</p>
                </div>
              )}
            </div>

            {/* Explanation & Action Footer */}
            {activeResult && activeResult.explanation && (
              <div className="px-4 py-2.5 bg-[#0A0D13] border-t border-slate-800 text-[11px] text-slate-400 font-sans flex items-start gap-2">
                <span className="font-mono text-[10px] font-bold uppercase text-slate-300 shrink-0 mt-0.5">
                  Sincronia:
                </span>
                <span className="leading-normal">
                  {activeResult.explanation}
                </span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
