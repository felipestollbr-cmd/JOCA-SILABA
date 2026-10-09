/* Dados locais de reserva: o jogo funciona mesmo sem conexão com a API. */
window.JOCA_WORLD_DATA = {
  "zoo": {
    "id": "zoo",
    "name": "Zoo da Sílaba",
    "color": "#FF9500",
    "monsters": [
      {
        "id": "leao",
        "name": "Leão Silábico",
        "health": 30,
        "speed": 3,
        "damage": 5,
        "score": 100,
        "sprite": "leao",
        "behavior": "patrol",
        "attacks": [
          "rugido",
          "salto"
        ],
        "vocab": {
          "word": "leão",
          "syllables": "le-ão",
          "pronunciation": "/leˈɐ̃w/"
        }
      },
      {
        "id": "macaco",
        "name": "Macaco Trapalhão",
        "health": 20,
        "speed": 5,
        "damage": 3,
        "score": 80,
        "sprite": "macaco",
        "behavior": "jump",
        "attacks": [
          "pulo",
          "berro"
        ],
        "vocab": {
          "word": "macaco",
          "syllables": "ma-ca-co",
          "pronunciation": "/maˈkaku/"
        }
      },
      {
        "id": "zebra",
        "name": "Zebra Zangada",
        "health": 25,
        "speed": 4,
        "damage": 4,
        "score": 90,
        "sprite": "zebra",
        "behavior": "charge",
        "attacks": [
          "coice",
          "mordida"
        ],
        "vocab": {
          "word": "zebra",
          "syllables": "ze-bra",
          "pronunciation": "/ˈzɛbra/"
        }
      }
    ],
    "bossId": "leao"
  },
  "jungle": {
    "id": "jungle",
    "name": "Selva das Letras",
    "color": "#2ECC71",
    "monsters": [
      {
        "id": "cobra",
        "name": "Cobra Corajosa",
        "health": 22,
        "speed": 2,
        "damage": 6,
        "score": 110,
        "sprite": "cobra",
        "behavior": "slither",
        "attacks": [
          "bote",
          "chicote"
        ],
        "vocab": {
          "word": "cobra",
          "syllables": "co-bra",
          "pronunciation": "/ˈkɔbra/"
        }
      },
      {
        "id": "onca",
        "name": "Onça Organizadora",
        "health": 35,
        "speed": 6,
        "damage": 7,
        "score": 150,
        "sprite": "onca",
        "behavior": "pounce",
        "attacks": [
          "garra",
          "rugido"
        ],
        "vocab": {
          "word": "onça",
          "syllables": "on-ça",
          "pronunciation": "/ˈõsa/"
        }
      },
      {
        "id": "papagaio",
        "name": "Papagaio Parlador",
        "health": 18,
        "speed": 4,
        "damage": 2,
        "score": 60,
        "sprite": "papagaio",
        "behavior": "fly",
        "attacks": [
          "bico",
          "grito"
        ],
        "vocab": {
          "word": "papagaio",
          "syllables": "pa-pa-gai-o",
          "pronunciation": "/papaˈgaju/"
        }
      }
    ],
    "bossId": "onca"
  },
  "ocean": {
    "id": "ocean",
    "name": "Oceano Silábico",
    "color": "#3498DB",
    "monsters": [
      {
        "id": "tubarao",
        "name": "Tubarão Totalizador",
        "health": 40,
        "speed": 7,
        "damage": 8,
        "score": 180,
        "sprite": "tubarao",
        "behavior": "circle",
        "attacks": [
          "mordida",
          "chicote"
        ],
        "vocab": {
          "word": "tubarão",
          "syllables": "tu-ba-rão",
          "pronunciation": "/tubaˈɾɐ̃w/"
        }
      },
      {
        "id": "polvo",
        "name": "Polvo Perfeito",
        "health": 32,
        "speed": 3,
        "damage": 5,
        "score": 140,
        "sprite": "polvo",
        "behavior": "swing",
        "attacks": [
          "tinta",
          "tentáculo"
        ],
        "vocab": {
          "word": "polvo",
          "syllables": "pol-vo",
          "pronunciation": "/ˈpɔwvu/"
        }
      },
      {
        "id": "agua_viva",
        "name": "Água Viva Ativa",
        "health": 15,
        "speed": 2,
        "damage": 4,
        "score": 70,
        "sprite": "agua_viva",
        "behavior": "float",
        "attacks": [
          "ferrão",
          "choque"
        ],
        "vocab": {
          "word": "água-viva",
          "syllables": "á-gua-vi-va",
          "pronunciation": "/ˈagwa ˈviva/"
        }
      }
    ],
    "bossId": "tubarao"
  },
  "desert": {
    "id": "desert",
    "name": "Deserto Desafiador",
    "color": "#F39C12",
    "monsters": [
      {
        "id": "escorpiao",
        "name": "Escorpião Esperto",
        "health": 28,
        "speed": 4,
        "damage": 7,
        "score": 130,
        "sprite": "escorpiao",
        "behavior": "scurry",
        "attacks": [
          "ferrão",
          "veneno"
        ],
        "vocab": {
          "word": "escorpião",
          "syllables": "es-cor-pi-ão",
          "pronunciation": "/eʃkorpiˈɐ̃w/"
        }
      },
      {
        "id": "camelo",
        "name": "Camelo Calmo",
        "health": 45,
        "speed": 2,
        "damage": 6,
        "score": 120,
        "sprite": "camelo",
        "behavior": "stomp",
        "attacks": [
          "coice",
          "cuspida"
        ],
        "vocab": {
          "word": "camelo",
          "syllables": "ca-me-lo",
          "pronunciation": "/kaˈmɛlu/"
        }
      },
      {
        "id": "lagarto",
        "name": "Lagarto Ligeiro",
        "health": 20,
        "speed": 5,
        "damage": 3,
        "score": 75,
        "sprite": "lagarto",
        "behavior": "dash",
        "attacks": [
          "mordida",
          "cauda"
        ],
        "vocab": {
          "word": "lagarto",
          "syllables": "la-gar-to",
          "pronunciation": "/laˈgaɾtu/"
        }
      }
    ],
    "bossId": "camelo"
  },
  "arctic": {
    "id": "arctic",
    "name": "Ártico Gelado",
    "color": "#ECF0F1",
    "monsters": [
      {
        "id": "urso_polar",
        "name": "Urso Polar Poderoso",
        "health": 50,
        "speed": 4,
        "damage": 9,
        "score": 200,
        "sprite": "urso_polar",
        "behavior": "charge",
        "attacks": [
          "garra",
          "rugido"
        ],
        "vocab": {
          "word": "urso",
          "syllables": "ur-so",
          "pronunciation": "/ˈuɾsu/"
        }
      },
      {
        "id": "pinguim",
        "name": "Pinguim Peculiar",
        "health": 18,
        "speed": 3,
        "damage": 2,
        "score": 65,
        "sprite": "pinguim",
        "behavior": "waddle",
        "attacks": [
          "bico",
          "escorrega"
        ],
        "vocab": {
          "word": "pinguim",
          "syllables": "pin-guim",
          "pronunciation": "/piŋˈɡwĩ/"
        }
      },
      {
        "id": "foca",
        "name": "Foca Feliz",
        "health": 24,
        "speed": 4,
        "damage": 4,
        "score": 95,
        "sprite": "foca",
        "behavior": "bounce",
        "attacks": [
          "mordida",
          "respingo"
        ],
        "vocab": {
          "word": "foca",
          "syllables": "fo-ca",
          "pronunciation": "/ˈfɔka/"
        }
      }
    ],
    "bossId": "urso_polar"
  },
  "forest": {
    "id": "forest",
    "name": "Floresta Encantada",
    "color": "#27AE60",
    "monsters": [
      {
        "id": "lobo",
        "name": "Lobo Linguista",
        "health": 32,
        "speed": 5,
        "damage": 6,
        "score": 125,
        "sprite": "lobo",
        "behavior": "hunt",
        "attacks": [
          "mordida",
          "uivo"
        ],
        "vocab": {
          "word": "lobo",
          "syllables": "lo-bo",
          "pronunciation": "/ˈlobu/"
        }
      },
      {
        "id": "urso",
        "name": "Urso Unido",
        "health": 42,
        "speed": 3,
        "damage": 7,
        "score": 160,
        "sprite": "urso",
        "behavior": "stomp",
        "attacks": [
          "garra",
          "rugido"
        ],
        "vocab": {
          "word": "urso",
          "syllables": "ur-so",
          "pronunciation": "/ˈuɾsu/"
        }
      },
      {
        "id": "raposa",
        "name": "Raposa Radiante",
        "health": 22,
        "speed": 6,
        "damage": 4,
        "score": 100,
        "sprite": "raposa",
        "behavior": "weave",
        "attacks": [
          "mordida",
          "cauda"
        ],
        "vocab": {
          "word": "raposa",
          "syllables": "ra-po-sa",
          "pronunciation": "/raˈpɔza/"
        }
      }
    ],
    "bossId": "urso"
  }
};
