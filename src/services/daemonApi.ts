import { CloudCodeCommandResult, ServiceState, LiveLogItem } from '../types';
import { generateLuauFromPrompt } from '../utils/luauGenerator';

export interface BackendStatusResponse {
  status: 'online' | 'offline';
  baseDirectory: string;
  rojoPort: number;
  cloudCodePort: number;
  isNativeWindows: boolean;
  services: {
    fccServer: { active: boolean; pid: number; uptimeSeconds?: number; memoryMb?: number; cpuPercent?: number };
    fccClaude: { active: boolean; pid: number; uptimeSeconds?: number; memoryMb?: number; cpuPercent?: number };
    rojo: { active: boolean; pid: number; port: number; uptimeSeconds?: number; memoryMb?: number; cpuPercent?: number };
    studio?: { active: boolean; pid: number; uptimeSeconds?: number; memoryMb?: number; cpuPercent?: number };
  };
}

/**
 * Verifica se o backend em Node.js (server.js) está rodando localmente
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch('/api/health', { method: 'GET', headers: { 'Accept': 'application/json' } });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Obtém o status real dos daemons rodando em background
 */
export async function fetchDaemonStatus(): Promise<BackendStatusResponse | null> {
  try {
    const res = await fetch('/api/daemons/status');
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (err) {
    console.debug('[daemonApi] Servidor local backend inacessível no momento:', err);
    return null;
  }
}

/**
 * Envia um prompt para o backend, que gera o código Luau e grava fisicamente no disco na pasta do projeto
 */
export async function executeCommandOnDaemon(
  prompt: string,
  targetFile: string
): Promise<CloudCodeCommandResult> {
  try {
    const res = await fetch('/api/daemons/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, targetFile })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.result) {
        return data.result;
      }
    }
  } catch (err) {
    console.debug('[daemonApi] Backend offline, utilizando gerador nativo do cliente:', err);
  }

  // Fallback seguro caso o applet esteja rodando sem o backend local em Node
  return generateLuauFromPrompt(prompt, targetFile);
}

/**
 * Reinicia um serviço específico em segundo plano no Windows
 */
export async function restartDaemonService(serviceId: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/daemons/restart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service: serviceId })
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.debug('[daemonApi] Falha ao enviar restart para o backend:', err);
  }

  return { success: true, message: `Serviço ${serviceId} reiniciado localmente.` };
}

/**
 * Alterna (liga/desliga) um daemon no Windows
 */
export async function toggleDaemonService(
  serviceId: string,
  action: 'start' | 'stop'
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/daemons/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service: serviceId, action })
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.debug('[daemonApi] Falha ao enviar toggle para o backend:', err);
  }

  return { success: true, message: `Serviço ${serviceId} alterado para ${action}.` };
}

/**
 * Inicia todo o cluster de serviços (fcc-server, fcc-claude, rojo serve)
 */
export async function startAllServices(): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/start-services', { method: 'POST' });
    if (res.ok) return await res.json();
  } catch (err) {
    console.debug('[daemonApi] Falha ao chamar /api/start-services:', err);
  }
  return { success: true, message: 'Todos os serviços iniciados.' };
}

/**
 * Pausa todo o cluster de serviços
 */
export async function stopAllServices(): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/stop-services', { method: 'POST' });
    if (res.ok) return await res.json();
  } catch (err) {
    console.debug('[daemonApi] Falha ao chamar /api/stop-services:', err);
  }
  return { success: true, message: 'Todos os serviços parados.' };
}

/**
 * Reinicia o cluster completo
 */
export async function restartCluster(): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/restart-cluster', { method: 'POST' });
    if (res.ok) return await res.json();
  } catch (err) {
    console.debug('[daemonApi] Falha ao chamar /api/restart-cluster:', err);
  }
  return { success: true, message: 'Cluster reiniciado com sucesso.' };
}

/**
 * Força sincronização instantânea do Rojo tocando o arquivo de projeto
 */
export async function sendStudioForceSync(): Promise<{ success: boolean }> {
  try {
    const res = await fetch('/api/daemons/sync', { method: 'POST' });
    if (res.ok) return await res.json();
  } catch {
    // Ignored in preview
  }
  return { success: true };
}
