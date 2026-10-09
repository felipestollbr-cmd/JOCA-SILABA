# Matriz pedagógica inicial — JOGO-JOCA / Sílaba Aventura

> **Status: proposta de trabalho para revisão pedagógica.** Esta matriz orienta o desenvolvimento; não declara que o jogo já atende integralmente à BNCC nem substitui planejamento docente. A correspondência final depende das atividades implementadas, da faixa/ano escolar e da revisão de profissional de alfabetização.

## Princípios de projeto

1. **Aprender com sentido:** relacionar letras, sons, sílabas, palavras e textos a situações compreensíveis; evitar tratar acerto em quiz como prova isolada de alfabetização.
2. **Progressão observável:** registrar a habilidade-alvo, o item apresentado, a resposta, a ajuda usada e a possibilidade de resolver itens novos.
3. **Erro como informação:** dar feedback específico, permitir nova tentativa e variar a representação ou a pista, sem retirar progresso pedagógico por errar.
4. **Transferência:** não considerar domínio demonstrado pela repetição da mesma palavra. Usar palavras diferentes e, quando adequado, tarefas de produção/explicação.
5. **Inclusão e acessibilidade:** instruções curtas, controles por teclado e toque, contraste legível, alternativa a informação exclusivamente sonora/visual e opção de apoio do adulto.
6. **Jogo como plataforma:** a exploração, movimentação e história do Joca devem continuar sendo parte central; as atividades de leitura devem fazer sentido dentro dos mundos, não interromper a experiência a cada passo.

## Mapeamento inicial de habilidades e atividades

| Etapa no jogo | Objetivo observável | Atividade sugerida | Evidência a registrar | Referência BNCC inicial |
|---|---|---|---|---|
| Descobrir — letras e escrita | Relacionar letras/grafemas a sons e distinguir letras de outros sinais | Encontrar a letra inicial de palavras conhecidas; comparar letras próximas; localizar letras no cenário | Resposta independente, confusões recorrentes e itens diferentes usados | EF01LP04, EF01LP05, EF01LP07 |
| Descobrir — consciência silábica | Segmentar oralmente palavras e perceber partes sonoras | Falar a palavra devagar, marcar sílabas com pulos/ritmo e comparar palavras | Segmentação, tipo de palavra e ajuda necessária | EF01LP06 |
| Construir — leitura de palavras | Ler palavras novas e reconhecer padrões, não apenas memorizar a posição de respostas | Montar palavras com sílabas, ler a palavra completa e escolher uma imagem/contexto compatível | Acerto em palavras variadas e resposta independente | EF12LP01; conforme atividade, EF01LP05–EF01LP07 |
| Construir — escrita e frase | Produzir/organizar palavras com sentido e observar segmentação e pontuação | Organizar frase, depois completar ou escrever palavra/frase com apoio graduado | Ordem, separação entre palavras, uso de maiúscula/pontuação quando trabalhado | EF01LP02; para convenções previstas no 2º ano, EF02LP01 |
| Compreender — texto curto | Localizar informação explícita e responder a uma pergunta com base no texto | Ler uma ficha curta, voltar ao trecho relevante e explicar/selecionar a resposta | Resposta, referência ao texto, nível de ajuda e transferência para outro texto | EF12LP02; ampliar conforme gênero, objetivo e ano escolar |
| Transferir — mundo novo | Aplicar estratégia já praticada em palavra/texto ainda não visto | Desafio surpresa em outro cenário, com vocabulário e estrutura adequados | Desempenho em item novo, sem pistas ou com pista registrada | Evidência complementar; não é um código BNCC isolado |

**Atenção à faixa escolar:** a referência EF02LP01 trata convenções de escrita no 2º ano. Não se deve exigir essa habilidade de todos os jogadores sem considerar etapa, percurso escolar e mediação. A BNCC inclui habilidades comuns ao bloco 1º–2º ano e habilidades específicas por ano; o currículo local e o material adotado precisam ser consultados.

## Regras propostas para a trilha adaptativa

- Separar **desempenho recente** de **domínio**. Um acerto não deve marcar uma habilidade como concluída.
- Considerar acertos independentes, erros, pistas, variedade de itens e recência. Não confundir velocidade com aprendizagem.
- Após erro, oferecer pista graduada: (1) repetir a instrução; (2) chamar atenção para uma parte relevante; (3) modelar um exemplo análogo. Depois, oferecer nova tentativa.
- Alternar itens para reduzir memorização da sequência de botões. A resposta correta não pode ficar associada a uma posição fixa.
- Se houver erros repetidos, reduzir a dificuldade ou retomar pré-requisito; se houver acertos independentes em itens variados, avançar gradualmente e incluir revisão espaçada.
- Manter um caminho acessível para professor/família escolherem a habilidade, sem deixar a recomendação automática como única opção.
- Exibir à criança uma mensagem encorajadora e simples; reservar indicadores detalhados para a área de acompanhamento do adulto.
- Não apresentar percentagem como nota escolar, diagnóstico ou certificado de alfabetização. O progresso local é um indicador limitado do que foi praticado neste dispositivo.

## Critérios mínimos de validação pedagógica

Antes de declarar uma habilidade como dominada, a equipe deve revisar:
- se a pergunta mede de fato a habilidade nomeada;
- se os distratores são plausíveis, mas não ambíguos;
- se a palavra é adequada à etapa e se a segmentação está linguisticamente correta;
- se o feedback ensina uma estratégia, e não apenas revela a resposta;
- se a criança consegue demonstrar a habilidade em itens diferentes;
- se o jogo oferece alternativas acessíveis e não penaliza diferenças de ritmo.

## Referências oficiais

- Ministério da Educação, **Base Nacional Comum Curricular (BNCC)** — documento oficial: https://basenacionalcomum.mec.gov.br/images/BNCC_EI_EF_110518_versaofinal_site.pdf
- Portal oficial para consultar e baixar habilidades da BNCC por etapa, ano e componente: https://downloadbncc.mec.gov.br/

## Próximas entregas técnicas sugeridas

1. Revisar cada item de `learning-content.js` e `world-data.js` com chave estável, sílabas validadas, objetivo pedagógico e nível de dificuldade.
2. Criar um validador automático que compare palavra, sílabas, resposta e opções, além de detectar ausência de conteúdo de leitura/frase.
3. Introduzir níveis de pista explícitos e consistentes; atualmente o progresso registra nível de ajuda, mas isso ainda precisa ser validado ponta a ponta.
4. Testar o motor adaptativo em casos determinísticos e em navegador antes de ligar qualquer métrica a relatórios escolares.
5. Validar com docente/alfabetizador e, depois, testar com crianças mediante autorização e cuidados de privacidade apropriados.
