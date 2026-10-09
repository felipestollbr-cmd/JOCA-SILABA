/* Combate educativo do Sílaba Aventura com o Joca.
 * Executado no navegador; usa as palavras e sílabas vindas do backend.
 */
(function () {
  "use strict";

  const byId = (id) => document.getElementById(id);
  const syllableBank = [
    "ba", "be", "ca", "co", "da", "de", "do", "fa", "fo", "ga", "go",
    "gua", "la", "le", "li", "lo", "ma", "me", "na", "ne", "no", "on",
    "pa", "pi", "po", "ra", "re", "ri", "ro", "sa", "se", "ta", "to",
    "tu", "ur", "va", "vi", "za", "ão", "ça", "é", "á"
  ];

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
    const expected = state.question && state.question.mode === "assemble" ? state.syllables.length : 1;
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
      const maxReached = state.question.mode === "assemble" && state.selected.length >= state.syllables.length;
      button.disabled = used || maxReached || Boolean(state.result);
      button.addEventListener("click", () => {
        if (state.result) return;
        if (state.question.mode !== "assemble") state.selected = [];
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

    const modes = ["assemble", "first", "count"];
    const mode = modes[state.round % modes.length];
    const word = state.monster.vocab.word;
    const syllables = state.syllables;
    let choices;
    let instruction;
    let badge;

    if (mode === "assemble") {
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
    } else {
      badge = "🧠 CONTAGEM SILÁBICA";
      instruction = "Quantas sílabas tem esta palavra?";
      const options = new Set([String(syllables.length)]);
      while (options.size < 3) options.add(String(1 + Math.floor(Math.random() * 5)));
      choices = shuffle([...options].map((value, index) => ({
        id: "count-" + index, value, label: value
      })));
    }

    state.question = { mode, choices };
    byId("combat-challenge-badge").textContent = badge;
    byId("combat-instruction").textContent = instruction;
    byId("combat-word").textContent = "Palavra: " + word;
    byId("combat-feedback").textContent = "";
    byId("check-answer").hidden = false;
    byId("clear-answer").hidden = false;
    byId("next-round").hidden = true;
    renderChoices();
    renderAnswer();
  }

  function checkAnswer() {
    if (!state.question || state.result || state.selected.length === 0) return;
    if (state.question.mode === "assemble" && state.selected.length !== state.syllables.length) {
      byId("combat-feedback").textContent = "Escolha todas as sílabas antes de conferir.";
      return;
    }

    const answer = state.selected.map((item) => item.value);
    let correct = false;
    if (state.question.mode === "assemble") {
      correct = answer.length === state.syllables.length &&
        answer.every((value, index) => value === state.syllables[index]);
    } else if (state.question.mode === "first") {
      correct = answer[0] === state.syllables[0];
    } else {
      correct = answer[0] === String(state.syllables.length);
    }

    if (correct) {
      const damage = Math.max(12, state.syllables.length * 6);
      state.monsterHp = Math.max(0, state.monsterHp - damage);
      updateHealth();
      byId("combat-feedback").textContent = "Muito bem! Joca acertou o ataque e causou " + damage + " de dano!";
      setResolvedControls(state.monsterHp === 0 ? "VOLTAR AO MUNDO" : "PRÓXIMA PERGUNTA");
      if (state.monsterHp === 0) {
        state.result = "victory";
        state.xp += Number(state.monster.score) || 0;
        updateHealth();
        byId("combat-feedback").textContent =
          "🏆 Vitória! Você derrotou " + state.monster.name + " e ganhou " +
          (Number(state.monster.score) || 0) + " XP!";
        byId("next-round").textContent = "VOLTAR AO MUNDO";
      }
    } else {
      const damage = Math.max(1, Number(state.monster.damage) || 4);
      state.playerHp = Math.max(0, state.playerHp - damage);
      updateHealth();
      setResolvedControls(state.playerHp === 0 ? "VOLTAR AO MUNDO" : "TENTAR OUTRA PERGUNTA");
      if (state.playerHp === 0) {
        state.result = "defeat";
        byId("combat-feedback").textContent =
          "😵 O monstro venceu esta rodada. Volte ao mundo para recuperar a energia e tente de novo!";
        byId("next-round").textContent = "VOLTAR AO MUNDO";
      } else {
        byId("combat-feedback").textContent =
          "Quase! O monstro contra-atacou e causou " + damage +
          " de dano. Revise as sílabas e tente outra pergunta.";
      }
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
    nextQuestion();
  }

  function startJocaCombat(monster, isBoss) {
    if (!monster || !monster.vocab || !monster.vocab.syllables) {
      console.error("Não foi possível iniciar o combate: o monstro não possui sílabas.");
      return;
    }
    if (state.playerHp <= 0) state.playerHp = state.playerMaxHp;
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