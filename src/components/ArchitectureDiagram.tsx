import React from 'react';
import { 
  FolderGit2, 
  Terminal, 
  Bot, 
  RefreshCw, 
  Gamepad2, 
  ArrowRight, 
  ArrowDown, 
  Zap, 
  ShieldCheck, 
  Layers 
} from 'lucide-react';
import { BlueprintConfig } from '../types';

interface ArchitectureDiagramProps {
  config: BlueprintConfig;
}

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({ config }) => {
  return (
    <section className="bg-[#12161F] rounded-xl border border-slate-800 p-5 sm:p-6 shadow-sm">
      <div className="pb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[10px] font-bold uppercase tracking-widest border border-sky-500/20">
            Topologia do Sistema
          </span>
          <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Arquitetura de Conexões</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-white mt-1.5 tracking-tight uppercase">
          Diagrama de Comunicação e Sincronia
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Como os terminais nativos, o motor Rojo e o Roblox Studio interagem sem sobrecarga.
        </p>
      </div>

      <div className="mt-5 p-5 sm:p-6 bg-[#0B0E14] rounded-xl border border-slate-800 text-slate-200 overflow-x-auto">
        <div className="min-w-[640px] flex flex-col gap-5">
          
          {/* Top Level: Base Folder */}
          <div className="p-4 rounded-xl bg-[#12161F] border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                  Raiz do Projeto (Ponto de Partida Nativo)
                </div>
                <div className="text-sm font-mono font-bold text-white">
                  {config.baseDirectory}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-black/50 px-3 py-1.5 rounded border border-slate-800">
              <span className="text-slate-400">default.project.json</span>
              <span>•</span>
              <span className="text-emerald-400">src/ (Luau)</span>
            </div>
          </div>

          {/* Connection Branches */}
          <div className="grid grid-cols-2 gap-5 relative">
            
            {/* Left Branch: AI Cluster */}
            <div className="p-4 rounded-xl bg-[#12161F] border border-amber-500/20 flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Bot className="w-4 h-4" /> Terminais 1 & 2: Cluster de IA
                </span>
                <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold uppercase">
                  Respiro {config.delaySeconds}s
                </span>
              </div>

              {/* Terminal 1 */}
              <div className="p-3 rounded-lg bg-[#090C11] border border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white font-bold">Aba 1: fcc-server</span>
                  <span className="text-sky-400 text-[11px]">Backend :3001</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Servidor Cloud Code local com indexação de símbolos Luau e AST do projeto.
                </p>
              </div>

              {/* Transition arrow with breather note */}
              <div className="flex items-center justify-center gap-2 text-[10px] text-amber-400 font-mono py-0.5 uppercase tracking-wider">
                <ArrowDown className="w-3 h-3" />
                <span>Pausa de estabilização ({config.delaySeconds}s)</span>
                <ArrowDown className="w-3 h-3" />
              </div>

              {/* Terminal 2 */}
              <div className="p-3 rounded-lg bg-[#090C11] border border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white font-bold">Aba 2: fcc-claude</span>
                  <span className="text-amber-400 text-[11px]">Context-Bound</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Interface do Claude com acesso direto ao contexto e ferramentas de geração de código.
                </p>
              </div>
            </div>

            {/* Right Branch: Sync & Game Visual */}
            <div className="p-4 rounded-xl bg-[#12161F] border border-sky-500/20 flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <RefreshCw className="w-4 h-4" /> Terminais 3 & 4: Sync & Visual
                </span>
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-bold uppercase">
                  WebSocket :{config.rojoPort}
                </span>
              </div>

              {/* Terminal 3 */}
              <div className="p-3 rounded-lg bg-[#090C11] border border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white font-bold">Aba 3: rojo serve</span>
                  <span className="text-indigo-400 text-[11px]">Porta {config.rojoPort}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Servidor local que escuta alterações no disco e transmite deltas instantaneamente.
                </p>
              </div>

              {/* Transition arrow to Roblox Studio */}
              <div className="flex items-center justify-center gap-2 text-[10px] text-emerald-400 font-mono py-0.5 uppercase tracking-wider">
                <ArrowDown className="w-3 h-3" />
                <span>Handshake Automático via Plugin</span>
                <ArrowDown className="w-3 h-3" />
              </div>

              {/* Step 4 Roblox Studio */}
              <div className="p-3 rounded-lg bg-[#090C11] border border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white font-bold">Roblox Studio</span>
                  <span className="text-emerald-400 text-[11px]">Play Solo Live</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  ReplicatedStorage, ServerScriptService e Workspace sincronizados ao vivo.
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Summary Strip */}
          <div className="p-3 rounded-lg bg-[#12161F] border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Zap className="w-4 h-4 text-amber-400" />
              Fluxo nativo e sem atrito: do prompt do Claude à execução no Roblox Studio em segundos.
            </span>
            <span className="font-mono text-[11px] text-slate-500">
              Protocolo: Rojo v7 + WebSocket Local
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};
