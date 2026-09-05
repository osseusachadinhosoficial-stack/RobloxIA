import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  FileCode,
  ArrowRight,
  RefreshCw,
  Zap,
  CornerDownLeft,
  Flame,
  Key,
  Shield,
  Coins
} from 'lucide-react';
import { AIChatMessage, CloudCodeCommandResult } from '../types';

interface AIChatWorkspaceProps {
  messages: AIChatMessage[];
  onSendMessage: (prompt: string, targetDir: 'server' | 'shared' | 'client') => Promise<void>;
  isProcessing: boolean;
  onSelectCommandResult: (resultId: string) => void;
  activeResultId?: string;
}

export const AIChatWorkspace: React.FC<AIChatWorkspaceProps> = ({
  messages,
  onSendMessage,
  isProcessing,
  onSelectCommandResult,
  activeResultId
}) => {
  const [inputText, setInputText] = useState('');
  const [targetDir, setTargetDir] = useState<'server' | 'shared' | 'client'>('server');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    const text = inputText.trim();
    setInputText('');
    onSendMessage(text, targetDir);
  };

  const handleQuickPrompt = (promptText: string, dir: 'server' | 'shared' | 'client') => {
    setTargetDir(dir);
    onSendMessage(promptText, dir);
  };

  const quickPrompts = [
    {
      icon: <Coins className="w-3.5 h-3.5 text-amber-400" />,
      label: 'Moeda com Efeito Sonoro',
      prompt: 'Crie uma moeda dourada colecionável que toca som, dá 10 moedas para o jogador ao encostar e some por 5 segundos.',
      dir: 'server' as const
    },
    {
      icon: <Key className="w-3.5 h-3.5 text-sky-400" />,
      label: 'Porta com Tecla E (Proximity)',
      prompt: 'Crie um sistema de porta que abre e fecha suavemente quando o jogador segura a tecla E usando ProximityPrompt.',
      dir: 'server' as const
    },
    {
      icon: <Flame className="w-3.5 h-3.5 text-rose-400" />,
      label: 'Bloco de Lava com Dano',
      prompt: 'Crie um bloco de lava que elimina o jogador imediatamente ao encostar nele, com partículas de fogo.',
      dir: 'server' as const
    },
    {
      icon: <Shield className="w-3.5 h-3.5 text-emerald-400" />,
      label: 'Salvar Moedas com DataStore',
      prompt: 'Crie um sistema de Leaderboard com Moedas e Nível que salva automaticamente os dados do jogador com DataStoreService.',
      dir: 'server' as const
    }
  ];

  return (
    <div className="bg-[#12161F] rounded-xl border border-slate-800 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Workspace Header */}
      <div className="px-4 py-3 bg-[#0A0D13] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Assistente Claude (Cloud Code)
            </h2>
            <p className="text-[10px] text-slate-400">
              Descreva o que deseja no jogo em português sem precisar programar
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)] animate-pulse" />
          IA Pronta
        </span>
      </div>

      {/* Quick Prompts Carousel for Non-Programmers */}
      <div className="px-3 py-2 bg-[#0E121A] border-b border-slate-800/80 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-[10px] uppercase font-mono text-slate-500 font-bold flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Ideias Rápidas:
          </span>
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickPrompt(item.prompt, item.dir)}
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#161B26] hover:bg-[#1E2535] border border-slate-800 hover:border-slate-700 text-[11px] text-slate-300 hover:text-white transition-all disabled:opacity-50"
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Thread Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 select-text min-h-[340px] max-h-[520px]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shadow-sm">
              <Bot className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-sm font-bold text-white font-mono">
                Pronto para Criar seu Jogo
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Descreva qualquer mecânica em português no campo abaixo ou clique em uma das ideias rápidas. O Claude irá gerar o código Luau e enviar automaticamente para o Roblox Studio via Rojo.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Sincronização Ativa com Roblox Studio</span>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-sky-500 text-slate-950 shadow-sm'
                      : 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-400'
                  }`}
                >
                  {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-sky-600/15 border border-sky-500/30 text-slate-100 rounded-tr-none'
                      : 'bg-[#0A0D13] border border-slate-800 text-slate-300 rounded-tl-none shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1 text-[10px] text-slate-500 font-mono">
                    <span className="font-bold text-slate-400">
                      {isUser ? 'Você' : 'Claude'}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Actions & Target File Summary */}
                  {!isUser && msg.targetFile && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                        <CheckCircle2 className="w-3 h-3 shrink-0" />
                        <span className="truncate">{msg.targetFile}</span>
                      </div>

                      {msg.commandResultId && (
                        <button
                          type="button"
                          onClick={() => onSelectCommandResult(msg.commandResultId!)}
                          className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded transition-all ${
                            activeResultId === msg.commandResultId
                              ? 'bg-sky-500 text-slate-950 font-bold'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          Ver Código
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Thinking Indicator */}
        {isProcessing && (
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-md bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Bot className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="bg-[#0A0D13] border border-slate-800 rounded-xl rounded-tl-none p-3 text-xs text-slate-400 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
              <span>Claude está gerando o código Luau e enviando via Rojo...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Area Form */}
      <form onSubmit={handleSubmit} className="p-3 bg-[#0A0D13] border-t border-slate-800 space-y-2">
        {/* Destination selector pills */}
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-500 text-[10px] uppercase font-bold">Onde aplicar:</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setTargetDir('server')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                targetDir === 'server'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Servidor (Regras)
            </button>
            <button
              type="button"
              onClick={() => setTargetDir('shared')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                targetDir === 'shared'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Compartilhado
            </button>
            <button
              type="button"
              onClick={() => setTargetDir('client')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                targetDir === 'client'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Interface / Jogador
            </button>
          </div>
        </div>

        {/* Text Input Container */}
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isProcessing}
            placeholder="Ex: Crie um portal que teletransporta o jogador para outro lugar..."
            className="w-full bg-[#12161F] border border-slate-700 rounded-xl px-3.5 py-2.5 pr-20 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-all font-sans"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isProcessing}
            className={`absolute right-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase font-mono tracking-wider flex items-center gap-1 transition-all ${
              !inputText.trim() || isProcessing
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-sky-500 hover:bg-sky-400 text-slate-950 cursor-pointer shadow-sm'
            }`}
          >
            <span>Enviar</span>
            <CornerDownLeft className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono px-1">
          <span>Pressione Enter para enviar</span>
          <span>Sincronização automática com Roblox Studio ativa</span>
        </div>
      </form>
    </div>
  );
};
