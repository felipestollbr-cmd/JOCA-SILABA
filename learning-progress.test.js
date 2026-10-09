const createJocaProgress = require('./learning-progress');

function makeStorage(initial) {
  const data = new Map(initial ? [['joca-learning-progress', JSON.stringify(initial)]] : []);
  return {
    getItem: (key) => data.has(key) ? data.get(key) : null,
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key)
  };
}
function makeSessionStorage() {
  const data = new Map();
  return { getItem: (key) => data.get(key) || null, setItem: (key, value) => data.set(key, value) };
}

describe('motor da timeline adaptativa do Joca', () => {
  test('registra acertos e erros sem descartar o histórico', () => {
    const store = createJocaProgress(makeStorage(), makeSessionStorage());
    store.recordAttempt('first', 'macaco', false, { at: '2026-10-01T10:00:00.000Z' });
    store.recordAttempt('first', 'macaco', true, { at: '2026-10-01T10:01:00.000Z' });
    const progress = store.read();
    expect(progress.attempts).toHaveLength(2);
    expect(progress.attempts[0].correct).toBe(false);
    expect(progress.attempts[1].correct).toBe(true);
  });

  test('repetir a mesma palavra não conta como item diferente', () => {
    const store = createJocaProgress(makeStorage(), makeSessionStorage());
    store.recordAttempt('first', 'macaco', true);
    store.recordAttempt('first', 'macaco', true);
    expect(store.allStats(store.read()).first.uniqueItems).toBe(1);
  });

  test('não marca domínio com uma única palavra, mesmo com muitos acertos', () => {
    const store = createJocaProgress(makeStorage(), makeSessionStorage());
    for (let i = 0; i < 8; i++) store.recordAttempt('first', 'macaco', true);
    expect(store.allStats(store.read()).first.mastered).toBe(false);
  });

  test('recomenda habilidades ainda não praticadas e retorna progresso estruturado', () => {
    const store = createJocaProgress(makeStorage(), makeSessionStorage());
    expect(store.recommendMode()).toBe('initialLetter');
    const timeline = store.timeline();
    expect(timeline.target).toBe(6);
    expect(timeline.percent).toBe(0);
    expect(timeline.recommendedLabel).toBeTruthy();
  });

  test('a timeline deixa de recomendar uma habilidade já dominada', () => {
    const store = createJocaProgress(makeStorage(), makeSessionStorage());
    ['macaco', 'leão', 'zebra'].forEach((word) => store.recordAttempt('initialLetter', word, true));
    expect(store.allStats(store.read()).initialLetter.mastered).toBe(true);
    expect(store.timeline().recommended).toBe('first');
  });

  test('considera diferentes palavras e respostas independentes para domínio', () => {
    const store = createJocaProgress(makeStorage(), makeSessionStorage());
    ['macaco', 'leão', 'zebra'].forEach((word) => store.recordAttempt('first', word, true));
    const stats = store.allStats(store.read()).first;
    expect(stats.uniqueItems).toBe(3);
    expect(stats.mastered).toBe(true);
  });
});
