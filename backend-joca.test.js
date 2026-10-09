const request = require('supertest');
const app = require('./backend-joca');

describe('API do Sílaba Aventura com o Joca', () => {
  test('health check retorna status ok e timestamp', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(Number.isNaN(Date.parse(response.body.timestamp))).toBe(false);
  });

  test('lista exatamente seis mundos em português', async () => {
    const response = await request(app).get('/api/worlds');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(6);
    expect(response.body.map((world) => world.id)).toEqual([
      'zoo', 'jungle', 'ocean', 'desert', 'arctic', 'forest'
    ]);
    response.body.forEach((world) => {
      expect(world.name).toBeTruthy();
      expect(world.name).not.toMatch(/world/i);
    });
  });

  test.each(['zoo', 'jungle', 'ocean', 'desert', 'arctic', 'forest'])(
    'mundo %s possui palavras com divisão silábica e chefe válido',
    async (worldId) => {
      const worldResponse = await request(app).get('/api/worlds/' + worldId + '/monsters');
      expect(worldResponse.status).toBe(200);
      expect(worldResponse.body.monsters).toHaveLength(3);
      expect(worldResponse.body.bossId).toBeTruthy();

      worldResponse.body.monsters.forEach((monster) => {
        expect(monster.name).toBeTruthy();
        expect(monster.vocab.word).toBeTruthy();
        expect(monster.vocab.syllables).toBeTruthy();
        expect(monster.vocab.syllables.split('-').filter(Boolean).length).toBeGreaterThan(0);
      });

      const bossResponse = await request(app).get('/api/worlds/' + worldId + '/boss');
      expect(bossResponse.status).toBe(200);
      expect(bossResponse.body.boss.id).toBe(worldResponse.body.bossId);
      expect(bossResponse.body.boss.vocab.syllables).toBeTruthy();
    }
  );

  test('endpoint de chaves não expõe o segredo do Google TTS', async () => {
    const originalClientKey = process.env.CLIENT_API_KEY;
    const originalTtsKey = process.env.GOOGLE_TTS_KEY;

    process.env.CLIENT_API_KEY = 'joca-test-client-key';
    process.env.GOOGLE_TTS_KEY = 'joca-private-tts-secret';

    try {
      const response = await request(app)
        .get('/api/keys')
        .set('x-api-key', 'joca-test-client-key');

      expect(response.status).toBe(200);
      expect(response.body.googleTTSAvailable).toBe(true);
      expect(response.body.googleTTS).toBeUndefined();
      expect(JSON.stringify(response.body)).not.toContain('joca-private-tts-secret');
    } finally {
      if (originalClientKey === undefined) delete process.env.CLIENT_API_KEY;
      else process.env.CLIENT_API_KEY = originalClientKey;
      if (originalTtsKey === undefined) delete process.env.GOOGLE_TTS_KEY;
      else process.env.GOOGLE_TTS_KEY = originalTtsKey;
    }
  });

  test('endpoint de chaves exige autenticação válida', async () => {
    const originalClientKey = process.env.CLIENT_API_KEY;
    process.env.CLIENT_API_KEY = 'joca-test-client-key';
    try {
      const response = await request(app).get('/api/keys');
      expect(response.status).toBe(401);
    } finally {
      if (originalClientKey === undefined) delete process.env.CLIENT_API_KEY;
      else process.env.CLIENT_API_KEY = originalClientKey;
    }
  });

  test('mundo inexistente retorna 404', async () => {
    const response = await request(app).get('/api/worlds/mundo-inexistente/monsters');
    expect(response.status).toBe(404);
    expect(response.body.error).toBeTruthy();
  });
});
