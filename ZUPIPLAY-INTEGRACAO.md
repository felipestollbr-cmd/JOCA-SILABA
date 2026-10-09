# Integração do Sílaba Aventura com o Joca no ZupiPlay

O endereço informado para o ZupiPlay é https://main.d2qenesx176lqd.amplifyapp.com/. A navegação automática desta sessão não conseguiu ler a página pública e o conector GitHub retornou 404 para o repositório `felipestollbr-cmd/zupiplay`; por isso, este documento define a integração do lado do Joca. A inclusão da opção no catálogo/menu do ZupiPlay deverá ser feita no repositório da própria plataforma.

## Experiência recomendada na TV

1. ZupiPlay apresenta uma categoria **Jogos** ou um card **Joca — Sílaba Aventura**.
2. Ao abrir o card, carrega o Joca em um iframe de tela ampla, sem cabeçalho extra da plataforma.
3. O parâmetro `mode=tv` ativa elementos grandes para tela de longe e foco visível.
4. O parâmetro `embed=zupiplay` muda o botão de retorno para **Voltar ao ZupiPlay**.
5. A navegação aceita setas do teclado, Enter/Espaço e gamepad, quando o navegador expõe a Gamepad API.
6. O Joca envia `{ type: "ZUPIPLAY_EXIT_GAME", game: "joca" }` ao pai quando o usuário escolhe voltar à plataforma.

## URL para teste da branch

Use a URL de preview do Vercel para testar esta versão antes de incorporá-la à branch principal:

`https://joca-silaba-git-feat-combate-s-47b7e7-felipes-projects-40f5c060.vercel.app/?mode=tv&embed=zupiplay`

Esta é uma URL de preview ligada à branch; não deve ser considerada URL definitiva de produção. Depois que as alterações forem aprovadas e publicadas, a URL de produção prevista é:

`https://joca-silaba.vercel.app/?mode=tv&embed=zupiplay`

Antes de ativar no ZupiPlay, abrir a URL de teste numa TV/navegador real para confirmar que o deployment está acessível, o iframe é permitido e a API Railway responde.

## Snippet HTML básico para o catálogo do ZupiPlay

Este bloco é independente do framework do ZupiPlay. Coloque o card onde a plataforma lista jogos e mostre o iframe ao selecionar o card.

```html
<!-- Card a inserir na página de catálogo do ZupiPlay -->
<button id="zupiplay-joca-card" type="button">
  <span aria-hidden="true">🎮</span>
  <strong>Joca — Sílaba Aventura</strong>
  <span>Aprenda letras, sílabas e leitura em uma aventura</span>
  <span>Jogar na TV</span>
</button>

<!-- Área de jogo: começa fechada e ocupa a tela quando aberta -->
<section id="zupiplay-joca-player" hidden aria-label="Jogo Joca">
  <button id="zupiplay-joca-close" type="button">← Voltar ao ZupiPlay</button>
  <iframe
    id="zupiplay-joca-frame"
    title="Joca — Sílaba Aventura"
    src="about:blank"
    allow="fullscreen; autoplay"
    allowfullscreen
    loading="lazy"
  ></iframe>
</section>

<style>
  #zupiplay-joca-player[hidden] { display: none !important; }
  #zupiplay-joca-player {
    position: fixed; inset: 0; z-index: 9999;
    width: 100vw; height: 100dvh; background: #10172a;
    display: flex; flex-direction: column;
  }
  #zupiplay-joca-close {
    min-height: 52px; padding: 12px 22px; flex: 0 0 auto;
    border: 0; background: #202f52; color: white; font-size: 1.1rem;
  }
  #zupiplay-joca-frame {
    border: 0; display: block; width: 100%; flex: 1 1 auto; min-height: 0;
  }
  #zupiplay-joca-card, #zupiplay-joca-close {
    cursor: pointer;
  }
  #zupiplay-joca-card:focus-visible, #zupiplay-joca-close:focus-visible {
    outline: 4px solid #9ce7ff; outline-offset: 4px;
  }
</style>

<script>
  (() => {
    const TEST_URL =
      'https://joca-silaba-git-feat-combate-s-47b7e7-felipes-projects-40f5c060.vercel.app/?mode=tv&embed=zupiplay';
    const card = document.getElementById('zupiplay-joca-card');
    const player = document.getElementById('zupiplay-joca-player');
    const frame = document.getElementById('zupiplay-joca-frame');
    const close = document.getElementById('zupiplay-joca-close');

    function closeJoca() {
      player.hidden = true;
      frame.src = 'about:blank';
      card.focus();
    }

    card.addEventListener('click', () => {
      player.hidden = false;
      frame.src = TEST_URL;
      close.focus();
    });

    close.addEventListener('click', closeJoca);

    // Mensagem de saída enviada pelo Joca. Validar a origem é obrigatório.
    window.addEventListener('message', (event) => {
      const expectedOrigin = new URL(TEST_URL).origin;
      if (event.origin !== expectedOrigin) return;
      if (event.data && event.data.type === 'ZUPIPLAY_EXIT_GAME' &&
          event.data.game === 'joca') {
        closeJoca();
      }
    });

    // Escape/Back fecha o jogo a partir do shell da plataforma.
    document.addEventListener('keydown', (event) => {
      if (!player.hidden && (event.key === 'Escape' || event.key === 'BrowserBack')) {
        closeJoca();
      }
    });
  })();
</script>
```

### Atenção ao ambiente

- O snippet usa a URL de preview. Em produção, altere `TEST_URL` para `https://joca-silaba.vercel.app/?mode=tv&embed=zupiplay` quando essa versão estiver publicada.
- Se o ZupiPlay tiver Content Security Policy própria, permitir o domínio do Joca em `frame-src`. Se o domínio do Joca definir `frame-ancestors` ou `X-Frame-Options`, a configuração também precisa aceitar o domínio do ZupiPlay. Não remova proteções globais sem avaliar o escopo.
- Requisições da API são feitas pela página do Joca, então o backend precisa permitir a origem da página Joca (não só a origem do pai ZupiPlay) no CORS.
- O cache offline é parcial. A primeira abertura de cada mundo ainda deve ocorrer com conexão.
- As APIs de controle remoto e gamepad variam por marca e modelo de TV. Testar em dispositivo real e manter uma opção de controle por teclado/controle Bluetooth.
- O iframe é adequado para uma versão web da plataforma; para Android TV/Fire TV nativos, pode ser necessário empacotar uma versão da aplicação.
