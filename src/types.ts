export interface BlueprintConfig {
  baseDirectory: string;
  delaySeconds: number;
  rojoPort: number;
  projectFileName: string;
  robloxPlaceFile: string;
  terminalMode: 'batch' | 'powershell' | 'wt' | 'vscode';
  autoLaunchStudio: boolean;
}

export type StepId = 1 | 2 | 3 | 4;

export interface BlueprintStep {
  id: StepId;
  phase: string;
  title: string;
  command?: string;
  terminalName?: string;
  objective: string;
  syncNote?: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  iconName: string;
  port?: number;
  details: string[];
}

export interface TerminalTabLog {
  id: string;
  title: string;
  command: string;
  badge: string;
  status: 'offline' | 'starting' | 'online';
  lines: Array<{
    timestamp: string;
    text: string;
    type: 'system' | 'info' | 'success' | 'warn' | 'command';
  }>;
}

export interface DiagnosticItem {
  id: string;
  title: string;
  category: 'directory' | 'ai' | 'rojo' | 'studio';
  checkCommand: string;
  expectedResult: string;
  troubleshootTip: string;
}

export type ServiceId = 'fcc-server' | 'fcc-claude' | 'rojo' | 'studio';

export interface ServiceState {
  id: ServiceId;
  name: string;
  command: string;
  port?: number;
  role: string;
  status: 'stopped' | 'starting' | 'running' | 'restarting';
  uptimeSeconds: number;
  pid: number;
  cpuPercent: number;
  memoryMb: number;
  lastActionTime?: string;
}

export type LogChannel = 'all' | 'fcc-server' | 'fcc-claude' | 'rojo' | 'studio';
export type LogLevel = 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR' | 'SYNC';

export interface LiveLogItem {
  id: string;
  timestamp: string;
  channel: 'fcc-server' | 'fcc-claude' | 'rojo' | 'studio';
  level: LogLevel;
  text: string;
  tag?: string;
}

export interface CloudCodeCommandResult {
  id: string;
  prompt: string;
  timestamp: string;
  status: 'processing' | 'success' | 'error';
  targetFile: string;
  generatedLuauCode: string;
  explanation: string;
  actionsTaken: string[];
  syncedWithRojo: boolean;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'claude';
  text: string;
  timestamp: string;
  targetFile?: string;
  commandResultId?: string;
  actionsSummary?: string[];
  isThinking?: boolean;
}
