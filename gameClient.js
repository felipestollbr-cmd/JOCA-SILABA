/**
 * GameClient - Integração com Backend de Sílaba Aventura com o Joca
 * 
 * Uso:
 * const client = new GameClient('http://localhost:3001');
 * const words = await client.getWorldMonsters('jungle');
 */

class GameClient {
  constructor(apiUrl, clientApiKey = '') {
    this.apiUrl = apiUrl.replace(/\/$/, ''); // Remove trailing slash
    this.clientApiKey = clientApiKey;
  }

  /**
   * Faz requisição com headers de autenticação
   */
  async request(endpoint, options = {}) {
    const method = (options.method || 'GET').toUpperCase();
    const cacheKey = 'joca-api-cache:' + endpoint;
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (this.clientApiKey) headers['x-api-key'] = this.clientApiKey;

    const readCached = () => {
      if (method !== 'GET') return null;
      try {
        const saved = localStorage.getItem(cacheKey);
        return saved ? JSON.parse(saved) : null;
      } catch (_) { return null; }
    };

    try {
      let response;
      const requestController = new AbortController();
      const requestTimeout = setTimeout(() => requestController.abort(), 3500);
      try {
        response = await fetch(`${this.apiUrl}${endpoint}`, {
          ...options,
          headers,
          signal: requestController.signal
        });
      } catch (networkError) {
        const cached = readCached();
        if (cached !== null) {
          console.info('📦 Joca: usando dados salvos para continuar offline:', endpoint);
          return cached;
        }
        throw networkError;
      } finally {
        clearTimeout(requestTimeout);
      }

      if (!response.ok) {
        let message = `HTTP ${response.status}`;
        try {
          const body = await response.json();
          message = body.error || message;
        } catch (_) {}
        throw new Error(message);
      }

      const data = await response.json();
      if (method === 'GET') {
        try { localStorage.setItem(cacheKey, JSON.stringify(data)); } catch (_) {}
      }
      return data;
    } catch (error) {
      const cached = readCached();
      if (cached !== null && method === 'GET') {
        console.warn('Joca: API indisponível, usando a última resposta salva:', endpoint);
        return cached;
      }
      if (method === 'GET') {
        const localData = this.getLocalData(endpoint);
        if (localData !== null) {
          console.warn('Joca: API indisponível; usando os dados locais do jogo:', endpoint);
          return localData;
        }
      }
      console.error(`Erro na requisição ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Respostas locais para os endpoints essenciais do jogo.
   * A API continua sendo a primeira opção; estes dados são o plano de contingência.
   */
  getLocalData(endpoint) {
    const worlds = window.JOCA_WORLD_DATA;
    if (!worlds) return null;
    if (endpoint === '/api/worlds') {
      return Object.values(worlds).map((world) => ({
        id: world.id,
        name: world.name,
        color: world.color,
        monsterCount: world.monsters.length
      }));
    }

    let match = endpoint.match(/^\\/api\\/worlds\\/([^/]+)\\/monsters(?:\\/([^/]+))?$/);
    if (match) {
      const world = worlds[decodeURIComponent(match[1])];
      if (!world) return null;
      if (match[2]) {
        return world.monsters.find((monster) => monster.id === decodeURIComponent(match[2])) || null;
      }
      return {
        world: world.id,
        name: world.name,
        color: world.color,
        monsters: world.monsters,
        bossId: world.bossId
      };
    }

    match = endpoint.match(/^\\/api\\/worlds\\/([^/]+)\\/boss$/);
    if (match) {
      const world = worlds[decodeURIComponent(match[1])];
      if (!world) return null;
      const boss = world.monsters.find((monster) => monster.id === world.bossId);
      return boss ? { world: world.id, boss, isBoss: true, difficulty: 'hard' } : null;
    }
    if (endpoint === '/api/health') return { status: 'ok', localFallback: true };
    return null;
  }

  // ==================
  // WORLDS API
  // ==================

  /**
   * Obtém lista de todos os mundos disponíveis
   */
  async getWorlds() {
    return this.request('/api/worlds');
  }

  /**
   * Obtém todos os monstros de um mundo específico
   * @param {string} worldId - ID do mundo (ex: 'jungle', 'ocean', 'arctic')
   */
  async getWorldMonsters(worldId) {
    return this.request(`/api/worlds/${worldId}/monsters`);
  }

  /**
   * Obtém dados de um monstro específico
   * @param {string} worldId - ID do mundo
   * @param {string} monsterId - ID do monstro
   */
  async getMonster(worldId, monsterId) {
    return this.request(`/api/worlds/${worldId}/monsters/${monsterId}`);
  }

  /**
   * Obtém o boss (chefe) de um mundo
   * @param {string} worldId - ID do mundo
   */
  async getWorldBoss(worldId) {
    return this.request(`/api/worlds/${worldId}/boss`);
  }

  // ==================
  // KEYS API
  // ==================

  /**
   * Obtém chaves de API (requer autenticação)
   */
  async getApiKeys() {
    return this.request('/api/keys');
  }

  // ==================
  // HEALTH CHECK
  // ==================

  /**
   * Verifica se o servidor está disponível
   */
  async healthCheck() {
    return this.request('/api/health');
  }
}

// ==================
// EXEMPLO DE USO
// ==================

/**
 * Exemplo prático de como usar o GameClient com Joca
 */
async function exampleUsage() {
  // Inicializar o cliente
  const client = new GameClient('http://localhost:3001', 'seu_cliente_api_key');

  try {
    // Verificar saúde do servidor
    console.log('✓ Verificando servidor...');
    await client.healthCheck();
    console.log('✓ Servidor está online!');

    // Obter todos os mundos
    console.log('\n📍 Obtendo mundos...');
    const worlds = await client.getWorlds();
    console.log('Mundos disponíveis:', worlds);

    // Obter palavras de um mundo específico
    console.log('\n📚 Obtendo palavras da Selva...');
    const jungleData = await client.getWorldMonsters('jungle');
    console.log(`Mundo: ${jungleData.name}`);
    console.log(`Palavras: ${jungleData.monsters.map(m => m.vocab.word).join(', ')}`);

    // Obter uma palavra específica
    console.log('\n📚 Obtendo dados de Onça...');
    const onca = await client.getMonster('jungle', 'onca');
    console.log(`Nome: ${onca.name}`);
    console.log(`Vida: ${onca.health}`);
    console.log(`Velocidade: ${onca.speed}`);
    console.log(`Dano: ${onca.damage}`);
    console.log(`Comportamento: ${onca.behavior}`);
    console.log(`Ataques: ${onca.attacks.join(', ')}`);
    console.log(`Palavra: ${onca.vocab.word}`);
    console.log(`Sílabas: ${onca.vocab.syllables}`);
    console.log(`Pronúncia: ${onca.vocab.pronunciation}`);

    // Obter o boss de um mundo
    console.log('\n👑 Obtendo boss do mundo Oceano...');
    const bossData = await client.getWorldBoss('ocean');
    console.log(`Boss: ${bossData.boss.name}`);
    console.log(`Dificuldade: ${bossData.difficulty}`);

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

// Para testar no navegador, descomente:
// exampleUsage();

// ==================
// INTEGRAÇÃO NO JOCO
// ==================

/**
 * Exemplo de como integrar com seu game engine (Phaser, etc)
 * Para Sílaba Aventura com o Joca
 */

class GameManager {
  constructor() {
    this.client = new GameClient(
      process.env.REACT_APP_API_URL || 'http://localhost:3001',
      process.env.REACT_APP_CLIENT_API_KEY || ''
    );
    this.currentWorld = null;
    this.currentMonsters = [];
    this.currentBoss = null;
  }

  /**
   * Carrega dados de um mundo inteiro
   */
  async loadWorld(worldId) {
    console.log(`🌍 Carregando mundo: ${worldId}`);
    
    const worldData = await this.client.getWorldMonsters(worldId);
    this.currentWorld = worldData;
    this.currentMonsters = worldData.monsters;

    const bossData = await this.client.getWorldBoss(worldId);
    this.currentBoss = bossData.boss;

    console.log(`✓ Mundo ${worldData.name} carregado com ${this.currentMonsters.length} palavras`);
    
    return {
      world: worldData,
      monsters: this.currentMonsters,
      boss: this.currentBoss
    };
  }

  /**
   * Retorna uma palavra aleatória do mundo atual (excluindo o boss)
   */
  getRandomMonster() {
    const nonBossMonsters = this.currentMonsters.filter(
      m => m.id !== this.currentWorld.bossId
    );
    return nonBossMonsters[Math.floor(Math.random() * nonBossMonsters.length)];
  }

  /**
   * Retorna o boss (chefe) do mundo atual
   */
  getBoss() {
    return this.currentBoss;
  }

  /**
   * Cria uma instância de inimigo para o jogo
   */
  createEnemyInstance(monsterId) {
    const monster = this.currentMonsters.find(m => m.id === monsterId);
    if (!monster) return null;

    return {
      id: monster.id,
      name: monster.name,
      health: monster.health,
      maxHealth: monster.health,
      speed: monster.speed,
      damage: monster.damage,
      sprite: monster.sprite,
      behavior: monster.behavior,
      attacks: monster.attacks,
      position: { x: 0, y: 0 },
      isAlive: true,
      score: monster.score,
      vocab: monster.vocab
    };
  }
}

// Exportar para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GameClient, GameManager };
}
