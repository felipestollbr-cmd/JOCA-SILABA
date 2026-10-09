/* Registro local de evidências de aprendizagem do Joca.
 * Dados são locais ao navegador; não representam diagnóstico nem certificação escolar.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory;
  } else if (root) {
    root.JOCA_PROGRESS = factory(root.localStorage, root.sessionStorage);
  }
})(typeof window !== 'undefined' ? window : null, function createJocaProgress(storage, sessionStorage) {
  'use strict';
  const KEY = 'joca-learning-progress';
  const MAX_ATTEMPTS = 2000;
  const SKILL_ORDER = ['initialLetter', 'first', 'assemble', 'count', 'sentence', 'reading'];
  const SKILL_LABELS = {
    initialLetter: 'Reconhecimento da letra inicial',
    first: 'Identificação da sílaba inicial',
    assemble: 'Formação de palavras',
    count: 'Contagem de sílabas',
    sentence: 'Construção de frases',
    reading: 'Compreensão de leitura'
  };
  const DISCOVER = ['initialLetter', 'first', 'assemble', 'count'];

  function emptyProgress() {
    return { version: 2, attempts: [], sessionId: getSessionId(), updatedAt: null };
  }
  function getSessionId() {
    try {
      let id = sessionStorage && sessionStorage.getItem('joca-session-id');
      if (!id) {
        id = 'session-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
        if (sessionStorage) sessionStorage.setItem('joca-session-id', id);
      }
      return id;
    } catch (_) { return 'session-local'; }
  }
  function read() {
    try {
      const parsed = JSON.parse(storage.getItem(KEY) || 'null');
      if (parsed && Array.isArray(parsed.attempts)) {
        return { ...emptyProgress(), ...parsed, attempts: parsed.attempts.slice(-MAX_ATTEMPTS) };
      }
      // Preserva os contadores antigos como resumo histórico, sem convertê-los em domínio.
      const legacy = parsed && typeof parsed === 'object' ? {
        total: Number(parsed.total) || 0,
        skills: parsed.skills && typeof parsed.skills === 'object' ? parsed.skills : {},
        words: parsed.words && typeof parsed.words === 'object' ? parsed.words : {},
        lastActivity: parsed.lastActivity || null
      } : null;
      const fresh = emptyProgress();
      if (legacy) fresh.legacySummary = legacy;
      return fresh;
    } catch (_) { return emptyProgress(); }
  }
  function skillFor(mode) { return SKILL_ORDER.includes(mode) ? mode : 'first'; }
  function statsFor(progress, skill) {
    const attempts = progress.attempts.filter((a) => a.skill === skill);
    const byItem = new Map();
    attempts.forEach((a) => {
      const old = byItem.get(a.itemId) || { attempts: 0, correct: 0, independentCorrect: 0, lastAt: a.at };
      old.attempts += 1;
      if (a.correct) {
        old.correct += 1;
        if (!a.hintLevel) old.independentCorrect += 1;
      }
      old.lastAt = a.at;
      byItem.set(a.itemId, old);
    });
    const itemStats = [...byItem.values()];
    const total = attempts.length;
    const correct = attempts.filter((a) => a.correct).length;
    const accuracy = total ? correct / total : 0;
    const independentCorrect = attempts.filter((a) => a.correct && !a.hintLevel).length;
    const masteredItems = itemStats.filter((s) => s.independentCorrect > 0).length;
    const mastered = itemStats.length >= 3 && accuracy >= 0.75 && masteredItems >= 2 && independentCorrect >= 2;
    return { skill, label: SKILL_LABELS[skill], total, correct, accuracy, uniqueItems: itemStats.length, independentCorrect, mastered, lastAt: attempts.length ? attempts[attempts.length - 1].at : null };
  }
  function allStats(progress) {
    const out = {};
    SKILL_ORDER.forEach((skill) => { out[skill] = statsFor(progress, skill); });
    return out;
  }
  function recordAttempt(mode, word, correct, options) {
    const progress = read();
    const skill = skillFor(mode);
    const opts = options || {};
    const itemId = String(opts.itemId || (skill + ':' + String(word || 'item').normalize('NFC').toLocaleLowerCase('pt-BR')));
    const attempt = {
      id: 'attempt-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7),
      skill, mode: String(mode), itemId, word: String(word || ''),
      correct: Boolean(correct), hintLevel: Math.max(0, Number(opts.hintLevel) || 0),
      at: opts.at || new Date().toISOString(), sessionId: progress.sessionId
    };
    progress.attempts.push(attempt);
    progress.attempts = progress.attempts.slice(-MAX_ATTEMPTS);
    progress.updatedAt = attempt.at;
    try { storage.setItem(KEY, JSON.stringify(progress)); } catch (_) {}
    return { progress, attempt, stats: allStats(progress) };
  }
  function recommendMode(word) {
    const progress = read();
    const stats = allStats(progress);
    const currentWord = String(word || '').normalize('NFC').toLocaleLowerCase('pt-BR');
    const candidates = SKILL_ORDER.filter((skill) => {
      const attempts = progress.attempts.filter((a) => a.skill === skill && a.word.normalize('NFC').toLocaleLowerCase('pt-BR') === currentWord);
      return attempts.length < 2;
    });
    const pool = candidates.length ? candidates : SKILL_ORDER.filter((skill) => !stats[skill].mastered);
    if (!pool.length) return 'reading';
    // Prioriza habilidades já tentadas com dificuldade; em empate, segue a progressão.
    pool.sort((a, b) => {
      const sa = stats[a], sb = stats[b];
      const difficultyA = sa.total >= 2 && sa.accuracy < 0.7 ? 0 : 1;
      const difficultyB = sb.total >= 2 && sb.accuracy < 0.7 ? 0 : 1;
      return difficultyA - difficultyB || sa.uniqueItems - sb.uniqueItems || SKILL_ORDER.indexOf(a) - SKILL_ORDER.indexOf(b);
    });
    return pool[0];
  }
  function timeline() {
    const progress = read();
    const stats = allStats(progress);
    const discover = DISCOVER.filter((s) => stats[s].mastered).length;
    const build = stats.sentence.mastered ? 1 : 0;
    const reading = stats.reading.mastered ? 1 : 0;
    const total = discover + build + reading;
    const recommended = recommendMode();
    const stages = [
      { key: 'discover', title: 'Descobrir', count: discover, target: 4, complete: discover === 4 },
      { key: 'build', title: 'Construir', count: build, target: 1, complete: build === 1 },
      { key: 'read', title: 'Compreender', count: reading, target: 1, complete: reading === 1 }
    ];
    return { total, target: 6, percent: Math.round(total / 6 * 100), stages, stats, recommended, recommendedLabel: SKILL_LABELS[recommended], lastActivity: progress.updatedAt, attempts: progress.attempts.length, legacyAttempts: progress.legacySummary ? progress.legacySummary.total : 0 };
  }
  return { read, recordAttempt, statsFor, allStats, recommendMode, timeline, key: KEY };
});
