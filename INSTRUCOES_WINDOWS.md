# Roblox Wizard Orchestrator - Guia de Execução Local

Este projeto foi modularizado para ser baixado como ZIP, extraído e executado localmente com um único clique no Windows.

## 🚀 Como Executar em 1 Clique (Windows)

1. Extraia o arquivo ZIP na pasta de sua preferência.
2. Dê dois cliques no arquivo **`start.bat`**.
   - O script solicitará automaticamente permissão de Administrador (UAC).
   - Verificará o Node.js e executará `npm install` caso necessário.
   - Subirá o **`server.js`** com todos os daemons em segundo plano (`fcc-server`, `fcc-claude`, `rojo serve :34872`).
   - Abrirá o seu navegador diretamente em **`http://localhost:3000`**.

## 🧠 Arquitetura Oculta em Segundo Plano

- **Sem Janelas Pretas Poluindo a Tela**: Os serviços rodam de forma invisível via `server.js` usando `windowsHide: true`.
- **Rojo Engine**: Escuta nativamente na porta `34872` sincronizando alterações com o Roblox Studio.
- **Cloud Code & Claude**: Backend na porta `3001` pronto para receber comandos em português.

## ⚙️ Configurações Manuais
Se precisar reiniciar manualmente algum serviço ou trocar a porta do Rojo, acesse a aba **"Configurações & Sistema"** no menu superior da aplicação.
