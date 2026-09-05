import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Search,
  Trash2,
  Copy,
  Download,
  Play,
  Pause,
  ArrowDown,
  Filter,
  Check,
  RefreshCw,
  Zap,
  Activity,
  Radio,
  FileText
} from 'lucide-react';
import { LiveLogItem, LogChannel, LogLevel } from '../types';

interface LiveLogsTerminalProps {
  logs: LiveLogItem[];
  onClearLogs: () => void;
  isStreamingActive: boolean;
  onToggleStreaming: () => void;
  onInjectSampleLog: (channel: 'rojo' | 'fcc-server' | 'fcc-claude' | 'studio') => void;
}

export const LiveLogsTerminal: React.FC<LiveLogsTerminalProps> = ({
  logs,
  onClearLogs,
  isStreamingActive,
  onToggleStreaming,
  onInjectSampleLog
}) => {
  const [selectedChannel, setSelectedChannel] = useState<LogChannel>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [autoScroll, setAutoScroll] = useState(true);
  const [copied, setCopied] = useState(false);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll effect
  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  // Filter logs by channel, level, search query
  const filteredLogs = logs.filter((log) => {
    if (selectedChannel !== 'all' && log.channel !== selectedChannel) {
      return false;
    }
    if (selectedLevel !== 'ALL' && log.level !== selectedLevel) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.text.toLowerCase().includes(q) ||
        log.channel.toLowerCase().includes(q) ||
        log.timestamp.includes(q) ||
        log.level.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCopyLogs = () => {
    const text = filteredLogs
      .map((l) => `[${l.timestamp}] [${l.channel.toUpperCase()}] [${l.level}] ${l.text}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportLogFile = () => {
    const text = filteredLogs
      .map((l) => `[${l.timestamp}] [${l.channel.toUpperCase()}] [${l.level}] ${l.text}`)
      .join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `roblox-dev-${selectedChannel}-${Date.now()}.log`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getLevelBadgeStyle = (level: LogLevel) => {
    switch (level) {
      case 'SUCCESS':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'WARN':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'ERROR':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'SYNC':
        return 'text-sky-400 bg-sky-500/15 border-sky-500/30 font-bold';
      case 'INFO':
      default:
        return 'text-slate-400 bg-slate-800/40 border-slate-700/40';
    }
  };

  const getChannelBadgeStyle = (channel: string) => {
    switch (channel) {
      case 'rojo':
        return 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10';
      case 'fcc-server':
        return 'text-sky-400 border-sky-500/20 bg-sky-500/10';
      case 'fcc-claude':
        return 'text-amber-400 border-amber-500/20 bg-amber-500/10';
      case 'studio':
        return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
      default:
        return 'text-slate-400 border-slate-700 bg-slate-800';
    }
  };

  return (
    <section className="bg-[#12161F] rounded-xl border border-slate-800 p-5 sm:p-6 shadow-sm flex flex-col">
      {/* Header & Status Indicator */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[10px] font-bold uppercase tracking-widest border border-sky-500/20">
              Terminal Embutido Nativo
            </span>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
              {filteredLogs.length} Entradas
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1.5 tracking-tight uppercase">
            Logs Dinâmicos em Tempo Real
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitore o <code className="text-[11px] text-indigo-300 font-mono">rojo serve</code> e o <code className="text-[11px] text-sky-300 font-mono">fcc-server</code> transmitindo eventos sem depender de janelas externas do Windows.
          </p>
        </div>

        {/* Live Stream Status & Toolbar */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Live streaming status toggle */}
          <button
            type="button"
            onClick={onToggleStreaming}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold uppercase tracking-wider transition-all ${
              isStreamingActive
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                : 'bg-slate-800/60 border border-slate-700 text-slate-400'
            }`}
            title="Pausar ou Retomar simulação de tráfego de logs"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isStreamingActive
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.9)] animate-pulse'
                  : 'bg-slate-500'
              }`}
            />
            <span>{isStreamingActive ? 'Stream Ativo' : 'Stream Pausado'}</span>
          </button>

          {/* Inject sample sync log button */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onInjectSampleLog('rojo')}
              className="px-2 py-1.5 rounded text-[10px] font-mono font-bold uppercase bg-[#1A1F2B] border border-slate-700 text-indigo-300 hover:text-white transition-all"
              title="Disparar batimento de sincronização do Rojo no terminal"
            >
              + Ping Rojo
            </button>
            <button
              type="button"
              onClick={() => onInjectSampleLog('fcc-server')}
              className="px-2 py-1.5 rounded text-[10px] font-mono font-bold uppercase bg-[#1A1F2B] border border-slate-700 text-sky-300 hover:text-white transition-all"
              title="Disparar evento de indexação AST do Cloud Code"
            >
              + AST Index
            </button>
          </div>

          {/* Copy all logs */}
          <button
            type="button"
            onClick={handleCopyLogs}
            className="p-1.5 rounded bg-[#1A1F2B] border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition-all"
            title="Copiar todos os logs visíveis"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Export log */}
          <button
            type="button"
            onClick={handleExportLogFile}
            className="p-1.5 rounded bg-[#1A1F2B] border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition-all"
            title="Exportar arquivo .log"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Clear screen */}
          <button
            type="button"
            onClick={onClearLogs}
            className="p-1.5 rounded bg-[#1A1F2B] border border-rose-900/30 hover:bg-rose-950/20 text-rose-400 transition-all"
            title="Limpar logs do console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Channel Tabs & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mt-4 pt-1 pb-3 border-b border-slate-800 font-mono text-xs">
        {/* Channel Switchers */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {(
            [
              { id: 'all', label: 'Todos' },
              { id: 'rojo', label: 'rojo serve' },
              { id: 'fcc-server', label: 'fcc-server' },
              { id: 'fcc-claude', label: 'fcc-claude' },
              { id: 'studio', label: 'Roblox Studio' }
            ] as const
          ).map((ch) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => setSelectedChannel(ch.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedChannel === ch.id
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'bg-[#0B0E14] text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {ch.label}
            </button>
          ))}
        </div>

        {/* Filter by Level & Text Search */}
        <div className="flex items-center gap-2">
          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-2 py-1.5 rounded-lg bg-[#0B0E14] border border-slate-700 text-[11px] font-mono text-slate-300 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">Nível: Todos</option>
            <option value="INFO">INFO</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="SYNC">SYNC (Rojo)</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
          </select>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrar logs..."
              className="pl-8 pr-3 py-1 text-xs bg-[#0B0E14] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 w-36 sm:w-44 font-mono"
            />
          </div>

          {/* Auto scroll toggle button */}
          <button
            type="button"
            onClick={() => setAutoScroll(!autoScroll)}
            className={`px-2 py-1.5 rounded text-[11px] font-mono font-bold uppercase transition-all flex items-center gap-1 ${
              autoScroll
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                : 'bg-slate-800/50 text-slate-500 border border-slate-700'
            }`}
            title="Travar ou destravar auto-scroll na base do terminal"
          >
            <ArrowDown className={`w-3 h-3 ${autoScroll ? 'text-sky-400' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">AutoScroll</span>
          </button>
        </div>
      </div>

      {/* Dark Futuristic Console Canvas */}
      <div
        ref={scrollContainerRef}
        className="mt-4 rounded-xl border border-slate-800/90 bg-[#070A0F] p-4 font-mono text-xs overflow-y-auto max-h-[440px] min-h-[320px] relative shadow-inner select-text"
      >
        {/* Subtle scanline line */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />

        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-600 space-y-2">
            <Terminal className="w-8 h-8 opacity-40" />
            <p className="text-xs">Nenhum evento registrado para os filtros selecionados.</p>
            <button
              type="button"
              onClick={() => onInjectSampleLog('rojo')}
              className="text-xs text-sky-400 hover:underline font-mono"
            >
              + Disparar log de teste
            </button>
          </div>
        ) : (
          <div className="space-y-1.5 relative z-10">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-2.5 py-0.5 hover:bg-slate-900/60 rounded px-1.5 transition-colors font-mono leading-relaxed"
              >
                {/* Timestamp */}
                <span className="text-slate-500 shrink-0 select-none text-[11px]">
                  [{log.timestamp}]
                </span>

                {/* Channel tag */}
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider border shrink-0 ${getChannelBadgeStyle(
                    log.channel
                  )}`}
                >
                  {log.channel}
                </span>

                {/* Level badge */}
                <span
                  className={`px-1 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider border shrink-0 ${getLevelBadgeStyle(
                    log.level
                  )}`}
                >
                  {log.level}
                </span>

                {/* Log message */}
                <span
                  className={`flex-1 break-all text-[11px] ${
                    log.level === 'SYNC'
                      ? 'text-sky-300 font-bold'
                      : log.level === 'SUCCESS'
                      ? 'text-emerald-300'
                      : log.level === 'WARN'
                      ? 'text-amber-300'
                      : log.level === 'ERROR'
                      ? 'text-rose-400'
                      : 'text-slate-300'
                  }`}
                >
                  {log.text}
                </span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>

      {/* Terminal Footer Bar */}
      <div className="flex items-center justify-between pt-3 mt-2 text-[11px] font-mono text-slate-500 border-t border-slate-800/80">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Porta Rojo: <strong className="text-indigo-400">34872</strong>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            Porta Cloud Code: <strong className="text-sky-400">3001</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span>Auto-Scroll: <strong>{autoScroll ? 'Ligado' : 'Pausado'}</strong></span>
        </div>
      </div>
    </section>
  );
};
