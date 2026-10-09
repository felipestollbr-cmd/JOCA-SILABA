/* Combate educativo do Sílaba Aventura com o Joca.
 * Executado no navegador; usa as palavras e sílabas vindas do backend.
 */
(function () {
  "use strict";

  const byId = (id) => document.getElementById(id);
  const syllableBank = [
    "ba", "be", "ca", "co", "da", "de", "do", "fa", "fo", "ga", "gai", "go",
    "gua", "la", "le", "li", "lo", "ma", "me", "na", "ne", "no", "on",
    "pa", "pi", "po", "ra", "re", "ri", "ro", "sa", "se", "ta", "to",
    "tu", "ur", "va", "vi", "za", "ão", "ça", "é", "á"
  ];
  const letterBank = ["a", "b", "c", "e", "f", "g", "l", "m", "o", "p", "r", "s", "t", "u", "z", "á"];

  const state = {
    monster: null,
    isBoss: false,
    monsterMaxHp: 0,
    monsterHp: 0,
    playerMaxHp: 100,
    playerHp: 100,
    xp: 0,
    round: -1,
    syllables: [],
    question: null,
    selected: [],
    result: null
  };

  function shuffle(items) {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function pickDistractors(correct, amount) {
    return shuffle([...new Set(syllableBank.filter((s) => s !== correct))]).slice(0, amount);
  }

  function getLearningPath() {
    try {
      const path = localStorage.getItem("joca-learning-path");
      return ["descobrir", "construir", "compreender"].includes(path) ? path : "descobrir";
    } catch (_) {
      return "descobrir";
    }
  }

  function getLearningInfo(monsterId) {
    return window.JOCA_LEARNING_CONTENT && window.JOCA_LEARNING_CONTENT[monsterId]
      ? window.JOCA_LEARNING_CONTENT[monsterId]
      : null;
  }

  function saveLearningProgress(mode, word) {
    try {
      const key = "joca-learning-progress";
      const progress = JSON.parse(localStorage.getItem(key) || '{"total":0,"skills":{},"words":{}}');
      progress.total = (progress.total || 0) + 1;
      progress.skills = progress.skills || {};
      progress.words = progress.words || {};
      progress.skills[mode] = (progress.skills[mode] || 0) + 1;
      progress.words[word] = (progress.words[word] || 0) + 1;
      progress.lastActivity = new Date().toISOString();
      localStorage.setItem(key, JSON.stringify(progress));
      // Atualiza a linha do tempo assim que uma resposta correta for registrada.
      window.dispatchEvent(new Event("joca:progress-updated"));
      return progress.total;
    } catch (_) {
      return 0;
    }
  }

  function getMonsterEmoji(id) {
    const emojis = {
      leao: "🦁", macaco: "🐵", zebra: "🦓",
      cobra: "🐍", onca: "🐆", papagaio: "🦜",
      tubarao: "🦈", polvo: "🐙", agua_viva: "🪼",
      escorpiao: "🦂", camelo: "🐪", lagarto: "🦎",
      urso_polar: "🐻‍❄️", pinguim: "🐧", foca: "🦭",
      lobo: "🐺", urso: "🐻", raposa: "🦊"
    };
    return emojis[id] || "👹";
  }

  function renderAnswer() {
    const container = byId("syllable-answer");
    container.replaceChildren();
    if (state.selected.length === 0) {
      const empty = document.createElement("span");
      empty.className = "answer-empty";
      empty.textContent = "Escolha as sílabas acima";
      container.appendChild(empty);
    } else {
      state.selected.forEach((choice, index) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "syllable-chip answer-chip";
        chip.textContent = choice.label;
        chip.title = "Remover da resposta";
        chip.setAttribute("aria-label", "Remover " + choice.label);
        chip.addEventListener("click", () => {
          if (state.result) return;
          state.selected.splice(index, 1);
          renderAnswer();
          renderChoices();
        });
        container.appendChild(chip);
      });
    }
    const expected = state.question && state.question.mode === "assemble"
      ? state.syllables.length
      : state.question && state.question.mode === "sentence"
        ? state.question.targetWords.length
        : 1;
    byId("check-answer").disabled = state.selected.length === 0 ||
      (state.question && state.question.mode === "assemble" && state.selected.length !== expected);
  }

  function renderChoices() {
    const container = byId("syllable-options");
    container.replaceChildren();
    (state.question ? state.question.choices : []).forEach((choice) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "syllable-chip";
      button.textContent = choice.label;
      const used = state.selected.some((selected) => selected.id === choice.id);
      const multiChoice = state.question.mode === "assemble" || state.question.mode === "sentence";
      const targetCount = state.question.mode === "assemble"
        ? state.syllables.length
        : state.question.mode === "sentence" ? state.question.targetWords.length : 1;
      const maxReached = multiChoice && state.selected.length >= targetCount;
      button.disabled = used || maxReached || Boolean(state.result);
      button.addEventListener("click", () => {
        if (state.result) return;
        if (!multiChoice) state.selected = [];
        state.selected.push(choice);
        renderAnswer();
        renderChoices();
      });
      container.appendChild(button);
    });
  }

  function updateHealth() {
    const playerPercent = Math.max(0, (state.playerHp / state.playerMaxHp) * 100);
    const monsterPercent = Math.max(0, (state.monsterHp / state.monsterMaxHp) * 100);
    byId("player-health-bar").style.width = playerPercent + "%";
    byId("monster-health-bar").style.width = monsterPercent + "%";
    byId("player-health-label").textContent = state.playerHp + "/" + state.playerMaxHp + " HP";
    byId("monster-health-label").textContent = state.monsterHp + "/" + state.monsterMaxHp + " HP";
    byId("combat-xp").textContent = "⭐ XP conquistado: " + state.xp;
  }

  function setResolvedControls(label) {
    byId("check-answer").hidden = true;
    byId("clear-answer").hidden = true;
    byId("next-round").hidden = false;
    byId("next-round").textContent = label;
    renderChoices();
  }

  function nextQuestion() {
    if (!state.monster || state.result) return;
    state.round += 1;
    state.selected = [];
    state.result = null;

    const path = getLearningPath();
    const coreModes = ["initialLetter", "assemble", "first", "count"];
    const modes = path === "construir"
      ? [...coreModes, "sentence"]
      : path === "compreender"
        ? [...coreModes, "sentence", "reading"]
        : coreModes;
    const mode = modes[state.round % modes.length];
    const word = state.monster.vocab.word;
    const syllables = state.syllables;
    const info = getLearningInfo(state.monster.id);
    let choices;
    let instruction;
    let badge;
    let displayText = "Palavra: " + word;
    let correctAnswer = null;
    let targetWords = null;

    if (mode === "initialLetter") {
      badge = "🔤 PRIMEIRA LETRA";
      instruction = "Qual letra começa a palavra?";
      const initial = word.toLocaleLowerCase("pt-BR").slice(0, 1);
      correctAnswer = initial;
      const extras = shuffle(letterBank.filter((letter) => letter !== initial)).slice(0, 3);
      choices = shuffle([
        { id: "letter-correct", value: initial, label: initial.toLocaleUpperCase("pt-BR") },
        ...extras.map((value, index) => ({ id: "letter-extra-" + index, value, label: value.toLocaleUpperCase("pt-BR") }))
      ]);
    } else if (mode === "assemble") {
      badge = "⚔️ ATAQUE SILÁBICO";
      instruction = "Monte a palavra usando as sílabas na ordem correta.";
      choices = shuffle(syllables.map((value, index) => ({
        id: "part-" + index, value, label: value
      })));
    } else if (mode === "first") {
      badge = "🎯 OLHO NA PRIMEIRA SÍLABA";
      instruction = "Qual é a primeira sílaba desta palavra?";
      const extras = pickDistractors(syllables[0], 3);
      choices = shuffle([
        { id: "first-correct", value: syllables[0], label: syllables[0] },
        ...extras.map((value, index) => ({ id: "first-extra-" + index, value, label: value }))
      ]);
    } else if (mode === "count") {
      badge = "🧠 CONTAGEM SILÁBICA";
      instruction = "Quantas sílabas tem esta palavra?";
      const options = new Set([String(syllables.length)]);
      while (options.size < 3) options.add(String(1 + Math.floor(Math.random() * 5)));
      choices = shuffle([...options].map((value, index) => ({
        id: "count-" + index, value, label: value
      })));
    } else if (mode === "sentence" && info && Array.isArray(info.sentence)) {
      badge = "✍️ CONSTRUÇÃO DE FRASES";
      instruction = "Organize as palavras para formar uma frase com sentido.";
      displayText = "Tema: " + word + ". Use cada peça uma vez e observe o início e o final da frase.";
      targetWords = info.sentence.slice();
      choices = shuffle(targetWords.map((value, index) => ({
        id: "sentence-" + index, value, label: value
      })));
    } else if (mode === "reading" && info && Array.isArray(info.choices)) {
      badge = "📖 FICHA INFORMATIVA";
      instruction = info.question;
      displayText = "FICHA DO ANIMAL — " + info.text;
      correctAnswer = info.answer;
      choices = shuffle(info.choices.map((value, index) => ({
        id: "reading-" + index, value, label: value
      })));
    } else {
      badge = "⚔️ ATAQUE SILÁBICO";
      instruction = "Monte a palavra usando as sílabas na ordem correta.";
      choices = shuffle(syllables.map((value, index) => ({
        id: "part-" + index, value, label: value
      })));
    }

    state.question = { mode, choices, correctAnswer, targetWords };
    byId("combat-challenge-badge").textContent = badge;
    byId("combat-instruction").textContent = instruction;
    byId("combat-word").textContent = displayText;
    byId("combat-word").classList.toggle("reading-passage", mode === "reading");
    byId("combat-feedback").textContent = "";
    byId("check-answer").hidden = false;
    byId("clear-answer").hidden = false;
    byId("next-round").hidden = true;
    renderChoices();
    renderAnswer();
  }

  function checkAnswer() {
    if (!state.question || state.result || state.selected.length === 0) return;
    const mode = state.question.mode;
    const expectedCount = mode === "assemble"
      ? state.syllables.length
      : mode === "sentence"
        ? state.question.targetWords.length
        : 1;
    if ((mode === "assemble" || mode === "sentence") && state.selected.length !== expectedCount) {
      byId("combat-feedback").textContent = "Use todas as peças antes de conferir.";
      return;
    }

    const answer = state.selected.map((item) => item.value);
    let correct = false;
    if (mode === "assemble") {
      correct = answer.length === state.syllables.length &&
        answer.every((value, index) => value === state.syllables[index]);
    } else if (mode === "initialLetter") {
      correct = answer[0] === state.question.correctAnswer;
    } else if (mode === "first") {
      correct = answer[0] === state.syllables[0];
    } else if (mode === "count") {
      correct = answer[0] === String(state.syllables.length);
    } else if (mode === "sentence") {
      correct = answer.length === state.question.targetWords.length &&
        answer.every((value, index) => value === state.question.targetWords[index]);
    } else if (mode === "reading") {
      correct = answer[0] === state.question.correctAnswer;
    }

    if (correct) {
      const damage = Math.max(12, state.syllables.length * 6);
      state.monsterHp = Math.max(0, state.monsterHp - damage);
      state.xp += 10;
      try { localStorage.setItem("joca-xp", String(state.xp)); } catch (_) {}
      const activities = saveLearningProgress(mode, state.monster.vocab.word);
      updateHealth();
      state.result = state.monsterHp === 0 ? "victory" : "correct";
      byId("combat-feedback").textContent = mode === "reading"
        ? "Muito bem! Você encontrou a informação no texto. Joca acertou o ataque e causou " + damage + " de dano."
        : mode === "sentence"
          ? "Frase formada! As palavras estão na ordem certa. Joca causou " + damage + " de dano."
          : "Muito bem! Você descobriu a resposta e Joca causou " + damage + " de dano!";
      if (activities) {
        byId("combat-xp").textContent = "⭐ XP: " + state.xp + " · Atividades corretas neste dispositivo: " + activities;
      }
      setResolvedControls(state.monsterHp === 0 ? "VOLTAR AO MUNDO" : "PRÓXIMA PERGUNTA");
      if (state.monsterHp === 0) {
        state.result = "victory";
        state.xp += Number(state.monster.score) || 0;
        try { localStorage.setItem("joca-xp", String(state.xp)); } catch (_) {}
        updateHealth();
        byId("combat-feedback").textContent =
          "🏆 Vitória! Você derrotou " + state.monster.name + " e ganhou " +
          (Number(state.monster.score) || 0) + " XP. Aprender é experimentar, revisar e tentar de novo!";
        byId("next-round").textContent = "VOLTAR AO MUNDO";
      }
    } else {
      state.result = "incorrect";
      setResolvedControls("TENTAR NOVAMENTE");
      byId("combat-feedback").textContent = mode === "reading"
        ? "Ainda não. Leia a ficha mais uma vez e procure a informação que responde à pergunta."
        : mode === "sentence"
          ? "Quase! Pense na ordem das palavras, na letra maiúscula do início e na pontuação do final. Tente novamente."
          : mode === "count"
            ? "Vamos por partes: fale a palavra devagar e conte cada pedaço falado. Depois tente novamente."
            : "Tudo bem errar ao aprender! Fale a palavra devagar, observe as partes escritas e tente outra vez.";
    }
  }

  function clearAnswer() {
    if (state.result) return;
    state.selected = [];
    renderAnswer();
    renderChoices();
    byId("combat-feedback").textContent = "";
  }

  function closeCombat() {
    byId("combat-overlay").hidden = true;
    state.monster = null;
    state.question = null;
    state.selected = [];
    if (state.playerHp <= 0) state.playerHp = state.playerMaxHp;
  }

  function continueRound() {
    if (state.result === "victory" || state.result === "defeat") {
      closeCombat();
      return;
    }
    if (state.result === "incorrect") {
      state.result = null;
      state.selected = [];
      byId("check-answer").hidden = false;
      byId("clear-answer").hidden = false;
      byId("next-round").hidden = true;
      byId("combat-feedback").textContent = "";
      renderChoices();
      renderAnswer();
      return;
    }
    state.result = null;
    nextQuestion();
  }

  function startJocaCombat(monster, isBoss) {
    if (!monster || !monster.vocab || !monster.vocab.syllables) {
      console.error("Não foi possível iniciar o combate: o monstro não possui sílabas.");
      return;
    }
    if (state.playerHp <= 0) state.playerHp = state.playerMaxHp;
    try { state.xp = Number(localStorage.getItem("joca-xp") || state.xp || 0); } catch (_) {}
    state.monster = monster;
    state.isBoss = Boolean(isBoss);
    state.monsterMaxHp = Math.max(1, Number(monster.health) || 20);
    state.monsterHp = state.monsterMaxHp;
    state.syllables = monster.vocab.syllables.split(/[-‑–]/).map((part) => part.trim()).filter(Boolean);
    if (state.syllables.length === 0) return;
    state.round = -1;
    state.result = null;
    byId("combat-title").textContent = state.isBoss ? "👑 BATALHA CONTRA O CHEFE" : "⚔️ DESAFIO DE SÍLABAS";
    byId("combat-monster-emoji").textContent = getMonsterEmoji(monster.id);
    byId("combat-monster-name").textContent = monster.name;
    byId("combat-overlay").hidden = false;
    byId("check-answer").hidden = false;
    byId("clear-answer").hidden = false;
    updateHealth();
    nextQuestion();
    byId("close-combat").focus();
  }

  byId("check-answer").addEventListener("click", checkAnswer);
  byId("clear-answer").addEventListener("click", clearAnswer);
  byId("next-round").addEventListener("click", continueRound);
  byId("close-combat").addEventListener("click", closeCombat);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !byId("combat-overlay").hidden) closeCombat();
  });

  window.startJocaCombat = startJocaCombat;
})();