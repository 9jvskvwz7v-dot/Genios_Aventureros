// Aquí van todas tus actividades. Cada una es un objeto con:
// - id:     identificador único (sin espacios)
// - title:  título que se muestra en la lista
// - type:   tipo de actividad
//           'wordsearch'     -> sopa de letras (usa 'words'; 'wordsPerRound'
//                                opcional para elegir un subconjunto al azar
//                                en cada partida, en vez de usar todas)
//           'completeword'   -> completa la palabra con voz (usa 'words')
//           'matchimage'     -> une palabra e imagen (usa 'pairs'; 'pairsPerRound'
//                                opcional para elegir un subconjunto al azar
//                                en cada partida, en vez de usar todos)
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
        pairsPerRound: 5,
        pairs: [
            { word: 'LUNA', key: 'luna', image: 'assets/btn_luna.png' },
            { word: 'AUTO', key: 'auto', image: 'assets/btn_carro.png' },
            { word: 'ESTRELLA', key: 'estrella', image: 'assets/btn_estrella.png' },
            { word: 'MOCHILA', key: 'mochila', image: 'assets/btn_mochila.png' },
            { word: 'CONTROL', key: 'joystick', image: 'assets/btn_joystick.png' },
            { word: 'LIBRO', key: 'libro', image: 'assets/btn_libro.png' },
            { word: 'BOSQUE', key: 'bosque', image: 'assets/btn_bosque.png' },
            { word: 'AVION', key: 'avion', image: 'assets/btn_avion.png' },
            { word: 'CASA', key: 'casa', image: 'assets/btn_casa.png' },
            { word: 'PERRO', key: 'perro', image: 'assets/btn_perro.png' },
            { word: 'COMPUTADORA', key: 'computadora', image: 'assets/btn_computadora.png' },
            { word: 'GATO', key: 'gato', image: 'assets/btn_gato.png' },
            { word: 'FLOR', key: 'flor', image: 'assets/btn_flor.png' },
            { word: 'NAVE', key: 'nave', image: 'assets/btn_nave.png' },
            { word: 'SOL', key: 'sol', image: 'assets/btn_sol.png' },
            { word: 'BALON', key: 'balon', image: 'assets/btn_balon.png' },
            { word: 'HELADO', key: 'helado', image: 'assets/btn_helado.png' },
            { word: 'PAJARO', key: 'pajaro', image: 'assets/btn_pajaro.png' }
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