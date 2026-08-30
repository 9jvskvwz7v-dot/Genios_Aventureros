// Aquí van todas tus actividades. Cada una es un objeto con:
// - id:     identificador único (sin espacios)
// - title:  título que se muestra en la lista
// - type:   tipo de actividad
//           'wordsearch'     -> sopa de letras (usa 'words'; 'wordsPerRound'
//                                opcional para elegir un subconjunto al azar
//                                en cada partida, en vez de usar todas)
//           'completeword'   -> completa la palabra con voz (usa 'words')
//           'matchimage'     -> une palabra e imagen (usa 'pairs')
//           'sentencepuzzle' -> rompecabezas de frases (usa 'sentences')
//           'letterbubbles'  -> burbujas de letras (usa 'letters', opcional)
//           'memory'         -> memorama de personajes (usa 'characters', opcional)
// - cover:  (opcional) key de una imagen de portada precargada en Actividades.js

export const activities = [
    {
        id: 'sopa2',
        title: 'Sopa del Bosque Encantado',
        type: 'wordsearch',
        cover: 'Sopa',
        words: [
            'ARDILLA', 'BUHO', 'CONEJO', 'ERIZO', 'LINTERNA', 'FLORES', 'LUCIERNAGA',
            'ZORRO', 'CIERVO', 'MARIPOSA', 'CASCADA', 'SENDERO', 'MUSGO', 'ARBOL',
            'RIO', 'SETA', 'NIDO', 'RAMA', 'HOJAS'
        ],
        wordsPerRound: 7
    },
    {
        id: 'completar1',
        title: 'Completa la Palabra',
        type: 'completeword',
        cover: 'completa',
        words: ['LUNA', 'NAVE', 'MAGIA', 'BOSQUE', 'COHETE', 'ESTRELLA']
    },
    {
        id: 'unir1',
        title: 'Une Palabra e Imagen',
        type: 'matchimage',
        cover: 'Une',
        pairs: [
            { word: 'NAVE', emoji: '🚀' },
            { word: 'LUNA', emoji: '🌙' },
            { word: 'ESTRELLA', emoji: '⭐' },
            { word: 'BOSQUE', emoji: '🌲' },
            { word: 'SOL', emoji: '☀️' }
        ]
    },
    {
        id: 'frases1',
        title: 'Rompecabezas de Frases',
        type: 'sentencepuzzle',
        cover: 'Arma',
        sentences: [
            ['LA', 'NAVE', 'VUELA', 'ALTO'],
            ['LA', 'LUNA', 'BRILLA', 'DE', 'NOCHE'],
            ['ANA', 'JUEGA', 'EN', 'EL', 'BOSQUE'],
            ['KIRO', 'ES', 'GENIAL'],
            ['YO', 'SOY', 'UN','AVENTURERO']
        ]
    },
    {
        id: 'burbujas1',
        title: 'Burbujas de Letras',
        type: 'letterbubbles',
        cover: 'abc'
        },
    {
        id: 'memorama1',
        title: 'Memorama de Cuentos',
        type: 'memory',
        cover: 'pareja'

    }
];
