# Status de validação — Sílaba Aventura com o Joca

Data da última revisão manual: 9 de outubro de 2026  
Branch: `feat/combate-silabico-web`  
PR: https://github.com/felipestollbr-cmd/JOCA-SILABA/pull/1

## Verificações realizadas neste ambiente

- Sintaxe JavaScript analisada: `combat.js`, `learning-content.js`, `gameClient.js`, `backend-joca.js`, `backend-joca.test.js` e `service-worker.js`.
- Scripts inline de `index.html` analisados e JSON do manifest validado.
- Simulação do fluxo de combate com DOM simplificado: letra inicial, montagem da palavra, sílaba inicial, contagem silábica, construção de frase e compreensão de ficha informativa.
- Simulação do erro formativo: feedback sem retirar vida e retorno à mesma pergunta para tentar de novo.
- Verificação automática dos dados: as partes silábicas dos 18 animais, unidas, reconstroem a palavra cadastrada.
- Divisão de `papagaio` corrigida para `pa-pa-gai-o`.
- GitHub informa que o check da Vercel estava **pendente** no commit mais recente no momento desta consulta. O check de um commit anterior da mesma branch havia retornado sucesso.

## Verificações ainda necessárias

- Executar `npm ci` e `npm test -- --runInBand` com um runner funcional. O job do GitHub Actions estava encerrando como falha de inicialização antes de apresentar etapas; por isso, não se considera a suíte automatizada aprovada.
- Abrir a revisão em um navegador real, conferir Console/Network e percorrer os seis mundos.
- Confirmar que a API Railway responde, aceita CORS da URL de preview atual e fornece os dados corretos. A conectividade não foi confirmada por este ambiente.
- Testar a instalação PWA em Chrome/Edge e em dispositivos-alvo. A presença de manifest e service worker foi verificada no código, mas o prompt de instalação não foi testado em navegador real.
- Para o uso offline, visitar online os seis mundos antes de testar retomada sem conexão; o cache ainda é parcial e local ao dispositivo.
- Testar foco de teclado e controles em Steam Deck/ROG Ally. Não há pacote nativo publicado neste estágio.

## Significado do status

O check de build da Vercel e a análise estática não substituem testes funcionais completos. Esta branch segue em rascunho e **não foi incorporada à branch principal**.

## Continuação — timeline adaptativa (branch isolada)

Branch de trabalho: `feat/timeline-adaptativa-v1`.

- Corrigida a recomendação global da timeline: sem uma palavra-alvo, o motor prioriza habilidades ainda não dominadas, em vez de aplicar o limite de tentativas por palavra vazia.
- Adicionado teste de regressão que verifica se uma habilidade dominada deixa de ser a recomendação quando há outra habilidade sem prática.
- Adicionado workflow `.github/workflows/test.yml` para executar `npm ci` e `npm test -- --runInBand` no GitHub Actions.
- **Validação pendente:** a existência do workflow e dos testes no repositório não significa que a execução já terminou. Não marcar esta alteração como aprovada até consultar o resultado real do job e testar o jogo em navegador.

## Continuação — matriz pedagógica e integridade do conteúdo

- Criado `MATRIZ-PEDAGOGICA-BNCC.md` como proposta inicial de mapeamento entre habilidades, atividades e evidências. O documento declara explicitamente que requer revisão docente e não equivale a certificação de conformidade integral com a BNCC.
- Criado `learning-content.test.js` para verificar se as sílabas de cada personagem reconstroem a palavra e se cada personagem tem ficha de leitura, pergunta, opções com resposta correta e frase.
- **Execução pendente:** estes testes foram adicionados ao repositório, mas não há resultado de execução confirmado neste registro. Validar no GitHub Actions ou em ambiente Node funcional antes de declarar aprovação.
