# Distribuição do Sílaba Aventura com o Joca

## Estratégia: uma base, várias formas de jogar

O projeto continua sendo um jogo web HTML/CSS/JavaScript com backend Node/Express. A estratégia é ampliar a distribuição sem reescrever o núcleo do jogo.

### 1. Site principal — prioridade imediata

- Frontend hospedado na Vercel.
- API de mundos, monstros e vocabulário na Railway.
- O jogo deve funcionar bem em desktop e telas de toque.
- Futuro: domínio próprio e página simples com descrição para famílias/professores.

### 2. PWA instalável

O manifest, o ícone SVG e o service worker fazem o site se apresentar como aplicação instalável em navegadores compatíveis. O botão de instalação aparece somente quando o navegador disponibiliza a instalação guiada.

**Limite offline atual:** os arquivos do jogo ficam em cache e o cliente guarda respostas da API depois que os mundos são visitados online. Para jogar offline em qualquer mundo logo após instalar, o pacote ainda precisa incluir todos os dados pedagógicos dos seis mundos e sincronizar progresso quando a rede voltar. O progresso atual é local ao navegador/dispositivo.

### 3. Portáteis tipo Steam Deck e ROG Ally

**Primeira validação recomendada:** abrir a versão web em navegador no portátil, verificar tela horizontal, escala, navegação por teclado/controles e legibilidade a uma distância normal de jogo. No Steam Deck, o site pode ser adicionado como atalho de jogo não-Steam pelo modo desktop.

**Próxima etapa:** se a experiência no navegador for boa, criar um pacote desktop a partir do mesmo frontend com Tauri ou Electron. Esse pacote precisará de uma estratégia para dados offline; não deve depender de um servidor Railway estar acessível para iniciar o jogo. ROG Ally executa Windows e permite testar o pacote Windows. O Steam Deck exige validar o pacote Linux/SteamOS e o comportamento dos controles.

### 4. Plataforma de jogos/stream

Há dois objetivos diferentes e independentes:

- **Loja/portal de jogos:** itch.io aceita jogos HTML5 enviados como ZIP. A versão publicada precisa incluir os arquivos estáticos e usar caminhos relativos. Se continuar usando a API Railway, é necessário permitir a origem de hospedagem no CORS; para distribuição resiliente/offline, recomenda-se incluir os dados essenciais no cliente.
- **Transmissão ao vivo:** integração com Twitch pode começar por links de compartilhamento e layout de transmissão. Login, sincronização de conta e funções interativas de stream seriam uma etapa posterior e opcional.

### 5. Consoles fechados

Nintendo Switch não é apenas uma instalação do site. A publicação exige registro no portal de desenvolvedores, acesso às ferramentas autorizadas, acordo de publicação, classificação indicativa e revisão do produto pela Nintendo. Tratar como projeto futuro, depois de validar o jogo no site e em um portátil PC.

## Rota recomendada

1. Corrigir e validar atividades de alfabetização/letramento e a API.
2. Validar Vercel preview e testes do backend.
3. Testar a PWA instalada em celular/tablet e desktop.
4. Testar interface em Steam Deck/ROG Ally.
5. Criar pacote desktop offline.
6. Publicar espelho HTML5 no itch.io ou escolher uma plataforma de transmissão específica.

## Referência pedagógica

As trilhas do jogo são inspiradas em princípios públicos de experimentação, autonomia, progressão e leitura com sentido. O jogo é complementar; não é material oficial do Sistema Positivo de Ensino nem representa homologação da editora.
