const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
// Origens permitidas: frontend de produção, versão antiga e desenvolvimento local.
// FRONTEND_URL aceita uma ou várias origens separadas por vírgula.
const defaultAllowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://joca-silaba.vercel.app',
  'https://joca-two.vercel.app'
];
const configuredOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(origin => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);
const allowedOrigins = new Set([...defaultAllowedOrigins, ...configuredOrigins]);

app.use(cors({
  origin: (origin, callback) => {
    // Permite chamadas sem Origin (ex.: health-check por CLI) e as origens conhecidas.
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error('Origem não permitida pelo CORS'));
  },
  credentials: true
}));

// Rate limiting para proteger endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100
});
app.use('/api/', apiLimiter);

// =========================
// DADOS DE SÍLABAS DO JOCA
// =========================

const WORLD_WORDS = {
  'zoo': {
    name: 'Zoo da Sílaba',
    color: '#FF9500',
    monsters: [
      {
        id: 'leao',
        name: 'Leão Silábico',
        health: 30,
        speed: 3,
        damage: 5,
        score: 100,
        sprite: 'leao',
        behavior: 'patrol',
        attacks: ['rugido', 'salto'],
        vocab: { word: 'leão', syllables: 'le-ão', pronunciation: '/leˈɐ̃w/' }
      },
      {
        id: 'macaco',
        name: 'Macaco Trapalhão',
        health: 20,
        speed: 5,
        damage: 3,
        score: 80,
        sprite: 'macaco',
        behavior: 'jump',
        attacks: ['pulo', 'berro'],
        vocab: { word: 'macaco', syllables: 'ma-ca-co', pronunciation: '/maˈkaku/' }
      },
      {
        id: 'zebra',
        name: 'Zebra Zangada',
        health: 25,
        speed: 4,
        damage: 4,
        score: 90,
        sprite: 'zebra',
        behavior: 'charge',
        attacks: ['coice', 'mordida'],
        vocab: { word: 'zebra', syllables: 'ze-bra', pronunciation: '/ˈzɛbra/' }
      }
    ],
    bossId: 'leao'
  },

  'jungle': {
    name: 'Selva das Letras',
    color: '#2ECC71',
    monsters: [
      {
        id: 'cobra',
        name: 'Cobra Corajosa',
        health: 22,
        speed: 2,
        damage: 6,
        score: 110,
        sprite: 'cobra',
        behavior: 'slither',
        attacks: ['bote', 'chicote'],
        vocab: { word: 'cobra', syllables: 'co-bra', pronunciation: '/ˈkɔbra/' }
      },
      {
        id: 'onca',
        name: 'Onça Organizadora',
        health: 35,
        speed: 6,
        damage: 7,
        score: 150,
        sprite: 'onca',
        behavior: 'pounce',
        attacks: ['garra', 'rugido'],
        vocab: { word: 'onça', syllables: 'on-ça', pronunciation: '/ˈõsa/' }
      },
      {
        id: 'papagaio',
        name: 'Papagaio Parlador',
        health: 18,
        speed: 4,
        damage: 2,
        score: 60,
        sprite: 'papagaio',
        behavior: 'fly',
        attacks: ['bico', 'grito'],
        vocab: { word: 'papagaio', syllables: 'pa-pa-ga-io', pronunciation: '/papaˈgaju/' }
      }
    ],
    bossId: 'onca'
  },

  'ocean': {
    name: 'Oceano Silábico',
    color: '#3498DB',
    monsters: [
      {
        id: 'tubarao',
        name: 'Tubarão Totalizador',
        health: 40,
        speed: 7,
        damage: 8,
        score: 180,
        sprite: 'tubarao',
        behavior: 'circle',
        attacks: ['mordida', 'chicote'],
        vocab: { word: 'tubarão', syllables: 'tu-ba-rão', pronunciation: '/tubaˈɾɐ̃w/' }
      },
      {
        id: 'polvo',
        name: 'Polvo Perfeito',
        health: 32,
        speed: 3,
        damage: 5,
        score: 140,
        sprite: 'polvo',
        behavior: 'swing',
        attacks: ['tinta', 'tentáculo'],
        vocab: { word: 'polvo', syllables: 'pol-vo', pronunciation: '/ˈpɔwvu/' }
      },
      {
        id: 'agua_viva',
        name: 'Água Viva Ativa',
        health: 15,
        speed: 2,
        damage: 4,
        score: 70,
        sprite: 'agua_viva',
        behavior: 'float',
        attacks: ['ferrão', 'choque'],
        vocab: { word: 'água-viva', syllables: 'á-gua-vi-va', pronunciation: '/ˈagwa ˈviva/' }
      }
    ],
    bossId: 'tubarao'
  },

  'desert': {
    name: 'Deserto Desafiador',
    color: '#F39C12',
    monsters: [
      {
        id: 'escorpiao',
        name: 'Escorpião Esperto',
        health: 28,
        speed: 4,
        damage: 7,
        score: 130,
        sprite: 'escorpiao',
        behavior: 'scurry',
        attacks: ['ferrão', 'veneno'],
        vocab: { word: 'escorpião', syllables: 'es-cor-pi-ão', pronunciation: '/eʃkorpiˈɐ̃w/' }
      },
      {
        id: 'camelo',
        name: 'Camelo Calmo',
        health: 45,
        speed: 2,
        damage: 6,
        score: 120,
        sprite: 'camelo',
        behavior: 'stomp',
        attacks: ['coice', 'cuspida'],
        vocab: { word: 'camelo', syllables: 'ca-me-lo', pronunciation: '/kaˈmɛlu/' }
      },
      {
        id: 'lagarto',
        name: 'Lagarto Ligeiro',
        health: 20,
        speed: 5,
        damage: 3,
        score: 75,
        sprite: 'lagarto',
        behavior: 'dash',
        attacks: ['mordida', 'cauda'],
        vocab: { word: 'lagarto', syllables: 'la-gar-to', pronunciation: '/laˈgaɾtu/' }
      }
    ],
    bossId: 'camelo'
  },

  'arctic': {
    name: 'Ártico Gelado',
    color: '#ECF0F1',
    monsters: [
      {
        id: 'urso_polar',
        name: 'Urso Polar Poderoso',
        health: 50,
        speed: 4,
        damage: 9,
        score: 200,
        sprite: 'urso_polar',
        behavior: 'charge',
        attacks: ['garra', 'rugido'],
        vocab: { word: 'urso', syllables: 'ur-so', pronunciation: '/ˈuɾsu/' }
      },
      {
        id: 'pinguim',
        name: 'Pinguim Peculiar',
        health: 18,
        speed: 3,
        damage: 2,
        score: 65,
        sprite: 'pinguim',
        behavior: 'waddle',
        attacks: ['bico', 'escorrega'],
        vocab: { word: 'pinguim', syllables: 'pin-guim', pronunciation: '/piŋˈɡwĩ/' }
      },
      {
        id: 'foca',
        name: 'Foca Feliz',
        health: 24,
        speed: 4,
        damage: 4,
        score: 95,
        sprite: 'foca',
        behavior: 'bounce',
        attacks: ['mordida', 'respingo'],
        vocab: { word: 'foca', syllables: 'fo-ca', pronunciation: '/ˈfɔka/' }
      }
    ],
    bossId: 'urso_polar'
  },

  'forest': {
    name: 'Floresta Encantada',
    color: '#27AE60',
    monsters: [
      {
        id: 'lobo',
        name: 'Lobo Linguista',
        health: 32,
        speed: 5,
        damage: 6,
        score: 125,
        sprite: 'lobo',
        behavior: 'hunt',
        attacks: ['mordida', 'uivo'],
        vocab: { word: 'lobo', syllables: 'lo-bo', pronunciation: '/ˈlobu/' }
      },
      {
        id: 'urso',
        name: 'Urso Unido',
        health: 42,
        speed: 3,
        damage: 7,
        score: 160,
        sprite: 'urso',
        behavior: 'stomp',
        attacks: ['garra', 'rugido'],
        vocab: { word: 'urso', syllables: 'ur-so', pronunciation: '/ˈuɾsu/' }
      },
      {
        id: 'raposa',
        name: 'Raposa Radiante',
        health: 22,
        speed: 6,
        damage: 4,
        score: 100,
        sprite: 'raposa',
        behavior: 'weave',
        attacks: ['mordida', 'cauda'],
        vocab: { word: 'raposa', syllables: 'ra-po-sa', pronunciation: '/raˈpɔza/' }
      }
    ],
    bossId: 'urso'
  }
};

// =========================
// ENDPOINTS DE API
// =========================

// GET - Todos os mundos e suas sílabas
app.get('/api/worlds', (req, res) => {
  try {
    const worlds = Object.keys(WORLD_WORDS).map(key => ({
      id: key,
      name: WORLD_WORDS[key].name,
      color: WORLD_WORDS[key].color,
      monsterCount: WORLD_WORDS[key].monsters.length
    }));
    res.json(worlds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Palavras de um mundo específico
app.get('/api/worlds/:worldId/monsters', (req, res) => {
  try {
    const { worldId } = req.params;
    const world = WORLD_WORDS[worldId];

    if (!world) {
      return res.status(404).json({ error: 'Mundo não encontrado' });
    }

    res.json({
      world: worldId,
      name: world.name,
      color: world.color,
      monsters: world.monsters,
      bossId: world.bossId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Palavra específica de um mundo
app.get('/api/worlds/:worldId/monsters/:monsterId', (req, res) => {
  try {
    const { worldId, monsterId } = req.params;
    const world = WORLD_WORDS[worldId];

    if (!world) {
      return res.status(404).json({ error: 'Mundo não encontrado' });
    }

    const monster = world.monsters.find(m => m.id === monsterId);

    if (!monster) {
      return res.status(404).json({ error: 'Palavra não encontrada' });
    }

    res.json(monster);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Chefe de um mundo
app.get('/api/worlds/:worldId/boss', (req, res) => {
  try {
    const { worldId } = req.params;
    const world = WORLD_WORDS[worldId];

    if (!world) {
      return res.status(404).json({ error: 'Mundo não encontrado' });
    }

    const boss = world.monsters.find(m => m.id === world.bossId);

    res.json({
      world: worldId,
      boss: boss,
      isBoss: true,
      difficulty: 'hard'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Chaves de API (protegido por API key no header)
app.get('/api/keys', (req, res) => {
  try {
    const clientKey = req.headers['x-api-key'];

    if (clientKey !== process.env.CLIENT_API_KEY) {
      return res.status(401).json({ error: 'API key inválida' });
    }

    // Nunca devolver chaves secretas ao navegador; informar apenas disponibilidade.
    res.json({
      googleTTSAvailable: Boolean(process.env.GOOGLE_TTS_KEY),
      webSpeech: true, // Web Speech API é nativa
      customEndpoint: process.env.CUSTOM_API_ENDPOINT || null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Start server
const PORT = process.env.PORT || 3001;

// Só inicia o servidor automaticamente quando este arquivo é executado diretamente.
// Isso permite importar o app nos testes automatizados sem abrir uma porta extra.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🎮 Sílaba Aventura com o Joca rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;
