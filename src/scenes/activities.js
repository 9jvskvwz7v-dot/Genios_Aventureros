export const activities = [
    {
        id: 'sopa2',
        title: 'Sopa del Bosque Encantado',
        type: 'wordsearch',
        cover: 'Sopa',
        words: ['ARDILLA', 'BUHO', 'CONEJO', 'ERIZO', 'LINTERNA', 'FLORES','LUCIERNAGA']
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
        cover: 'memoria'
    }
];