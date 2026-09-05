import { BlueprintConfig, BlueprintStep, DiagnosticItem, TerminalTabLog, ServiceState, LiveLogItem } from '../types';

export const defaultConfig: BlueprintConfig = {
  baseDirectory: 'C:\\Users\\Max\\RobloxWizardProject',
  delaySeconds: 3,
  rojoPort: 34872,
  projectFileName: 'default.project.json',
  robloxPlaceFile: 'place.rbxl',
  terminalMode: 'batch',
  autoLaunchStudio: true,
};

export const initialSteps: BlueprintStep[] = [
  {
    id: 1,
    phase: 'Passo 1: O Ponto de Partida',
    title: 'Diretório Base do Projeto',
    objective: 'Todas as ferramentas e comandos devem ser iniciados nativamente dentro desta pasta para que encontrem os arquivos de configuração corretos (default.project.json, regras do Cloud Code e contexto local).',
    status: 'idle',
    iconName: 'FolderCode',
    details: [
      'Local de execução: C:\\Users\\Max\\RobloxWizardProject',
      'Contexto de execução obrigatório para fcc-server, fcc-claude e rojo serve',
      'Validação de arquivos essenciais antes da inicialização'
    ]
  },
  {
    id: 2,
    phase: 'Passo 2: Serviços de IA',
    title: 'Backend Cloud Code & Interface Claude',
    command: 'fcc-server  ->  [Respiro 3s]  ->  fcc-claude',
    terminalName: 'Terminais 1 & 2',
    objective: 'Iniciar o servidor de backend do Cloud Code na Aba 1, aguardar respiro de sincronia para evitar sobrecarga no hardware, e inicializar a interface do Claude na Aba 2 vinculada ao contexto do projeto.',
    syncNote: 'Nota de sincronia: O script dá um breve respiro de 3 segundos entre os comandos para estabilizar a porta e os sockets de IA.',
    status: 'idle',
    iconName: 'Bot',
    port: 3001,
    details: [
      'Aba 1 (fcc-server): Sobe o servidor de processamento e backend do Cloud Code',
      'Intervalo de Respiro: 3 segundos de folga para não engasgar a CPU/RAM',
      'Aba 2 (fcc-claude): Conecta a CLI/interface do Claude alimentada pela árvore do projeto'
    ]
  },
  {
    id: 3,
    phase: 'Passo 3: Motor de Sincronização',
    title: 'Rojo Engine (Canal Local)',
    command: 'rojo serve',
    terminalName: 'Terminal 3',
    objective: 'Abrir o canal de comunicação local via WebSockets que fica escutando as alterações de código no disco para transmiti-las em tempo real para o Roblox Studio.',
    status: 'idle',
    iconName: 'RefreshCw',
    port: 34872,
    details: [
      'Porta padrão: localhost:34872',
      'Lê o arquivo default.project.json para mapear src/ para o DataModel do Roblox',
      'File-watcher em alta frequência para sincronização instantânea de scripts Luau'
    ]
  },
  {
    id: 4,
    phase: 'Passo 4: Ambiente Visual',
    title: 'Roblox Studio (Conexão e Testes)',
    command: 'RobloxStudio.exe / place.rbxl',
    terminalName: 'Aplicação Gráfica',
    objective: 'Abrir o projeto correspondente no Roblox Studio para que ele se conecte automaticamente à porta do Rojo (34872) e permita testar o jogo em tempo real.',
    status: 'idle',
    iconName: 'Gamepad2',
    details: [
      'Abre o arquivo .rbxl do projeto ou o executável do Roblox Studio',
      'Plugin do Rojo dentro do Studio faz o handshake com localhost:34872',
      'Pronto para testes no Play Solo ou Server/Client local'
    ]
  }
];

export const initialTerminalTabs: TerminalTabLog[] = [
  {
    id: 'fcc-server',
    title: '1. fcc-server',
    command: 'fcc-server',
    badge: 'Backend AI',
    status: 'offline',
    lines: []
  },
  {
    id: 'fcc-claude',
    title: '2. fcc-claude',
    command: 'fcc-claude',
    badge: 'Claude UI',
    status: 'offline',
    lines: []
  },
  {
    id: 'rojo',
    title: '3. rojo serve',
    command: 'rojo serve',
    badge: 'Sync Engine',
    status: 'offline',
    lines: []
  },
  {
    id: 'studio',
    title: '4. Roblox Studio',
    command: 'RobloxStudio.exe',
    badge: 'Game Client',
    status: 'offline',
    lines: []
  }
];

export const diagnosticChecklist: DiagnosticItem[] = [
  {
    id: 'diag-dir',
    title: 'Diretório e Arquivos do Projeto',
    category: 'directory',
    checkCommand: 'cd /d "C:\\Users\\Max\\RobloxWizardProject" && dir default.project.json',
    expectedResult: 'Arquivo "default.project.json" e pasta "src" listados no terminal.',
    troubleshootTip: 'Se não existir, rode "rojo init" dentro da pasta para criar a estrutura padrão de projeto Roblox.'
  },
  {
    id: 'diag-ai-server',
    title: 'Instalação do Cloud Code Backend (fcc-server)',
    category: 'ai',
    checkCommand: 'where fcc-server || npm list -g fcc-server',
    expectedResult: 'Caminho absoluto para o executável ou pacote global encontrado no PATH.',
    troubleshootTip: 'Certifique-se de que a ferramenta Cloud Code CLI está instalada globalmente ou adicione sua pasta de scripts ao PATH do Windows.'
  },
  {
    id: 'diag-ai-claude',
    title: 'Instalação do Claude Tool (fcc-claude)',
    category: 'ai',
    checkCommand: 'where fcc-claude || npm list -g fcc-claude',
    expectedResult: 'Executável fcc-claude disponível no ambiente de linha de comando.',
    troubleshootTip: 'Se o comando não for reconhecido, confirme se a CLI foi configurada na mesma versão do Node.js/Python utilizada pelo sistema.'
  },
  {
    id: 'diag-rojo',
    title: 'Instalação do Rojo CLI',
    category: 'rojo',
    checkCommand: 'rojo --version',
    expectedResult: 'Rojo versão 7.x.x ou superior retornada com sucesso.',
    troubleshootTip: 'Instale via gerenciador de ferramentas Roblox (Aftman ou Rokit) com "aftman add rojo-rbx/rojo" ou baixe o binário no GitHub.'
  },
  {
    id: 'diag-studio-plugin',
    title: 'Plugin do Rojo no Roblox Studio',
    category: 'studio',
    checkCommand: 'rojo plugin install',
    expectedResult: 'Plugin instalado na pasta de plugins locais do Roblox Studio (%LOCALAPPDATA%\\Roblox\\Plugins).',
    troubleshootTip: 'No Roblox Studio, vá na aba "Plugins" e clique no ícone "Rojo" para abrir o painel de conexão.'
  },
  {
    id: 'diag-port',
    title: 'Disponibilidade da Porta 34872',
    category: 'rojo',
    checkCommand: 'netstat -ano | findstr 34872',
    expectedResult: 'Nenhum processo concorrente ocupando a porta antes de iniciar o Rojo.',
    troubleshootTip: 'Se a porta estiver presa por uma sessão antiga do Rojo, mate o processo correspondente pelo PID com "taskkill /PID <PID> /F".'
  }
];

export const initialServices: ServiceState[] = [
  {
    id: 'fcc-server',
    name: 'fcc-server',
    command: 'fcc-server',
    port: 3001,
    role: 'Cloud Code Local Backend (AST & LSP Indexer)',
    status: 'running',
    uptimeSeconds: 0,
    pid: 0,
    cpuPercent: 0,
    memoryMb: 0
  },
  {
    id: 'fcc-claude',
    name: 'fcc-claude',
    command: 'fcc-claude',
    role: 'Claude Workspace CLI (Context-Bound Worker)',
    status: 'running',
    uptimeSeconds: 0,
    pid: 0,
    cpuPercent: 0,
    memoryMb: 0
  },
  {
    id: 'rojo',
    name: 'rojo serve',
    command: 'rojo serve --port 34872',
    port: 34872,
    role: 'Rojo Live File Synchronizer (WebSocket 34872)',
    status: 'running',
    uptimeSeconds: 0,
    pid: 0,
    cpuPercent: 0,
    memoryMb: 0
  },
  {
    id: 'studio',
    name: 'Roblox Studio Bridge',
    command: 'RobloxStudio.exe place.rbxl',
    role: 'Roblox DataModel Client & Play Solo Runtime',
    status: 'running',
    uptimeSeconds: 0,
    pid: 0,
    cpuPercent: 0,
    memoryMb: 0
  }
];

// Clean initial logs array - completely empty for real live events
export const initialLiveLogs: LiveLogItem[] = [];

export const promptPresets = [
  {
    title: 'Moeda com DataStore',
    prompt: 'Crie uma moeda que dá 10 pontos ao encostar e salva o progresso com DataStore.',
    targetFile: 'src/server/CoinCollector.server.luau',
    type: 'server'
  },
  {
    title: 'Porta com ProximityPrompt (Tecla E)',
    prompt: 'Crie uma porta que abre e fecha com ProximityPrompt ao segurar a tecla E.',
    targetFile: 'src/server/DoorSystem.server.luau',
    type: 'server'
  },
  {
    title: 'Bloco de Lava com Dano',
    prompt: 'Crie um bloco de lava perigoso que elimina o jogador instantaneamente ao pisar.',
    targetFile: 'src/server/LavaHazard.server.luau',
    type: 'server'
  },
  {
    title: 'Sistema de Corrida (Shift)',
    prompt: 'Crie um sistema de corrida rápida ao segurar a tecla Shift com barra de estamina.',
    targetFile: 'src/client/SprintController.client.luau',
    type: 'client'
  }
];
