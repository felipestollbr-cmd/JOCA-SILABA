# 🎮 Sílaba Aventura com o Joca - Setup Completo

## ✅ Mudanças Realizadas

### HTML (index.html)
- ✅ **Título corrigido**: "Sílaba Aventura com o Joca" (era "João's English Adventure")
- ✅ **Subtítulo em português**: "Derrote monstros dominando as sílabas!"
- ✅ **Nomes de mundos traduzidos**:
  - Zoo Adventure → Zoo da Sílaba
  - Jungle Mystery → Selva das Letras
  - Ocean Depths → Oceano Silábico
  - Desert Mirage → Deserto Desafiador
  - Arctic Realm → Ártico Gelado
  - Enchanted Forest → Floresta Encantada

- ✅ **Interface em português**:
  - "INIMIGOS" → "PALAVRAS DESTE MUNDO"
  - "Vocab" → "Palavra"
  - "Pontos" → "Ganho"
  - Textos de alerta adaptados para contexto de sílabas

---

## 🚀 Como Rodar

### 1️⃣ Instalar dependências do backend

```bash
npm install
```

### 2️⃣ Criar arquivo `.env`

```env
PORT=3001
CLIENT_API_KEY=seu_api_key_aqui
FRONTEND_URL=http://localhost:3000
GOOGLE_TTS_KEY=sua_chave_google_aqui
```

### 3️⃣ Iniciar o backend

```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start
```

O backend estará rodando em: **http://localhost:3001**

### 4️⃣ Abrir o jogo

- Coloque o `index.html` em um servidor web (ou abra localmente se o backend permitir CORS)
- Ou use:
  ```bash
  python -m http.server 3000
  ```

---

## 📡 Arquitetura de Integração

```
┌─────────────────────────────────────────┐
│      index.html (Cliente)                │
│  Sílaba Aventura com o Joca              │
└────────────────┬────────────────────────┘
                 │
                 │ fetch() via gameClient.js
                 │
┌────────────────▼────────────────────────┐
│  backend-joao.js (Express API)           │
│  http://localhost:3001                   │
├──────────────────────────────────────────┤
│ GET /api/worlds                          │
│ GET /api/worlds/:worldId/monsters        │
│ GET /api/worlds/:worldId/boss            │
│ GET /api/worlds/:worldId/monsters/:id    │
│ GET /api/health                          │
└──────────────────────────────────────────┘
```

---

## 🎯 Estrutura de Dados do Backend

### Mundo (World)
```javascript
{
  id: 'jungle',
  name: 'Selva das Letras',
  color: '#2ECC71',
  monsters: [...],
  bossId: 'jaguar'
}
```

### Monstro (Monster)
```javascript
{
  id: 'jaguar',
  name: 'Jasper the Jaguar',
  health: 35,
  speed: 6,
  damage: 7,
  score: 150,
  sprite: 'jaguar',
  behavior: 'pounce',
  attacks: ['slash', 'roar'],
  vocab: { 
    word: 'jaguar', 
    pronunciation: '/ˈdʒæɡuːɑr/' 
  }
}
```

---

## 📚 Mundos Disponíveis

| Mundo | ID | Chefe | Cor |
|-------|----|----|-----|
| 🦁 Zoo da Sílaba | `zoo` | Leo the Lion | #FF9500 |
| 🐅 Selva das Letras | `jungle` | Jasper the Jaguar | #2ECC71 |
| 🦈 Oceano Silábico | `ocean` | Shelly the Shark | #3498DB |
| 🐪 Deserto Desafiador | `desert` | Cassidy the Camel | #F39C12 |
| 🐻‍❄️ Ártico Gelado | `arctic` | Boris the Polar Bear | #ECF0F1 |
| 🐻 Floresta Encantada | `forest` | Benny the Bear | #27AE60 |

---

## 🔧 Endpoints da API

### Listar todos os mundos
```bash
GET http://localhost:3001/api/worlds
```

**Resposta:**
```json
[
  { "id": "zoo", "name": "Zoo da Sílaba", "color": "#FF9500", "monsterCount": 3 },
  { "id": "jungle", "name": "Selva das Letras", "color": "#2ECC71", "monsterCount": 3 }
]
```

### Obter monstros de um mundo
```bash
GET http://localhost:3001/api/worlds/jungle/monsters
```

### Obter boss de um mundo
```bash
GET http://localhost:3001/api/worlds/jungle/boss
```

### Health check
```bash
GET http://localhost:3001/api/health
```

---

## 🛡️ Segurança

- **Rate Limiting**: 100 requisições por 15 minutos
- **CORS**: Configurado para `http://localhost:3000` (ajuste no `.env`)
- **API Key**: Opcional (header `x-api-key`)

---

## 📝 Próximos Passos

- [ ] Integrar sistema de combate real (não apenas alerts)
- [ ] Adicionar sistema de progresso/salvar dados
- [ ] Implementar Web Speech API para pronuncia
- [ ] Adicionar animações de ataque
- [ ] Criar tela de game over e vitória
- [ ] Implementar leaderboard

---

## 🐛 Troubleshooting

### "Erro ao carregar mundos"
- Verifique se o backend está rodando em `http://localhost:3001`
- Verifique CORS no `.env`

### "Pode não funcionar em localhost"
- Se estiver via `file://`, use um servidor HTTP:
  ```bash
  python -m http.server 3000
  ```

### API Key inválida
- Se usar autenticação, verifique o header `x-api-key` no `gameClient.js`

---

**Desenvolvido para o Sistema Positivo de Ensino** 📚✨
