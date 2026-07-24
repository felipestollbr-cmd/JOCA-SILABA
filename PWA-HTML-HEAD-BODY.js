<!-- 
    ========================================
    ADICIONAR ISTO NO <HEAD> DO index.html
    DEPOIS DA LINHA: <meta name="theme-color" content="#5c94fc">
    ======================================== 
-->

<!-- PWA - Meta tags para instalação -->
<meta name="apple-mobile-web-app-capable" content="true">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Joca">
<meta name="mobile-web-app-capable" content="yes">
<meta name="application-name" content="Sílaba Aventura com o Joca">

<!-- PWA - Cor e ícone -->
<meta name="msapplication-TileColor" content="#5c94fc">
<meta name="msapplication-TileImage" content="icon-512.png">

<!-- PWA - Link para manifest -->
<link rel="manifest" href="manifest.json">

<!-- PWA - Ícones (adicione as imagens na pasta raiz) -->
<link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">
<link rel="icon" type="image/png" sizes="512x512" href="icon-512.png">
<link rel="apple-touch-icon" href="icon-192.png">

<!-- PWA - Splash screen (opcional) -->
<link rel="apple-touch-startup-image" href="splash-screen.png">


<!-- 
    ========================================
    ADICIONAR ISTO ANTES DO </BODY>
    ======================================== 
-->

<script>
  // ========================================
  // PWA - Registrar Service Worker
  // ========================================
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('✅ Service Worker registrado:', registration);
          
          // Verificar atualizações a cada hora
          setInterval(() => {
            registration.update();
          }, 3600000);
        })
        .catch(error => {
          console.error('❌ Erro ao registrar Service Worker:', error);
        });

      // Detectar atualizações do app
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('🔄 Nova versão do app disponível!');
        // Mostrar notificação de atualização
        if (confirm('Nova versão disponível! Recarregar?')) {
          window.location.reload();
        }
      });
    });
  }

  // ========================================
  // PWA - Detectar quando app está installável
  // ========================================
  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (e) => {
    // Previne o mini-infobar de aparecer
    e.preventDefault();
    // Guarda o evento para dispará-lo depois
    deferredPrompt = e;
    
    console.log('✅ App está pronta para instalar!');
    
    // Mostrar botão "Instalar" customizado se quiser
    // document.getElementById('install-button').style.display = 'block';
  });

  // Função para instalar o app (usar em um botão se quiser)
  function installApp() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('✅ App instalado com sucesso!');
        } else {
          console.log('❌ Instalação cancelada');
        }
        deferredPrompt = null;
      });
    }
  }

  // ========================================
  // PWA - Detectar se rodando como app
  // ========================================
  if (window.navigator.standalone === true) {
    console.log('🎮 Rodando como app instalado (iOS)!');
    document.body.classList.add('app-mode');
  }

  // Chrome/Android
  if (window.matchMedia('(display-mode: fullscreen)').matches) {
    console.log('🎮 Rodando como app instalado (Android/Windows)!');
    document.body.classList.add('app-mode');
  }

  // Detectar mudanças no modo de exibição
  window.matchMedia('(display-mode: fullscreen)').addListener((e) => {
    if (e.matches) {
      console.log('🎮 Entrando em modo fullscreen!');
      document.body.classList.add('app-mode');
    } else {
      console.log('🌐 Saindo de modo app!');
      document.body.classList.remove('app-mode');
    }
  });

  // ========================================
  // PWA - Informações do App
  // ========================================
  console.log('%c🎮 Sílaba Aventura com o Joca', 'font-size: 20px; color: #5c94fc; font-weight: bold;');
  console.log('%cPWA: Progressive Web App instalável', 'color: #2ECC71; font-size: 14px;');
  console.log('%cFunciona offline: Sim', 'color: #2ECC71; font-size: 14px;');
  console.log('%cInstalável: Sim (menu do navegador)', 'color: #2ECC71; font-size: 14px;');
</script>
