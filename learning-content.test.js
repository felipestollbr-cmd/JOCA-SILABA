const fs = require('fs');
const path = require('path');
const vm = require('vm');

function loadBrowserData(file, globalName) {
  const context = { window: {} };
  vm.runInNewContext(
    fs.readFileSync(path.join(__dirname, file), 'utf8'),
    context,
    { filename: file }
  );
  return context.window[globalName];
}
function normalizeWord(value) {
  return String(value || '')
    .normalize('NFC')
    .toLocaleLowerCase('pt-BR')
    .replace(/[^\\p{L}\\p{N}]/gu, '');
}

describe('integridade do conteúdo pedagógico do Joca', () => {
  const worlds = loadBrowserData('world-data.js', 'JOCA_WORLD_DATA');
  const lessons = loadBrowserData('learning-content.js', 'JOCA_LEARNING_CONTENT');

  test('cada palavra do mundo pode ser reconstruída pelas sílabas cadastradas', () => {
    Object.values(worlds).forEach((world) => {
      world.monsters.forEach((monster) => {
        const pieces = String(monster.vocab.syllables || '').split('-');
        expect(pieces.every(Boolean)).toBe(true);
        expect(normalizeWord(pieces.join(''))).toBe(normalizeWord(monster.vocab.word));
      });
    });
  });

  test('cada personagem tem conteúdo de leitura com resposta entre as opções', () => {
    Object.values(worlds).forEach((world) => {
      world.monsters.forEach((monster) => {
        const lesson = lessons[monster.id];
        expect(lesson).toBeTruthy();
        expect(typeof lesson.text).toBe('string');
        expect(lesson.text.length).toBeGreaterThan(10);
        expect(typeof lesson.question).toBe('string');
        expect(Array.isArray(lesson.choices)).toBe(true);
        expect(lesson.choices).toContain(lesson.answer);
        expect(Array.isArray(lesson.sentence)).toBe(true);
        expect(lesson.sentence.length).toBeGreaterThan(1);
      });
    });
  });
});
