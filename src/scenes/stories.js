// Aquí van todos tus cuentos. Cada uno es un objeto con:
// - id:     identificador único (sin espacios), se usa internamente
// - title:  título que se muestra en la lista
// - cover:  (opcional) key de una imagen de portada precargada en Cuentos.js
// - pages:  arreglo de páginas. Cada página tiene:
//             text  -> el texto que se muestra
//             image -> (opcional) key de una imagen precargada en CuentaCuentos.js
//
// Cuando tengas assets para las imágenes, cárgalas en el preload() de
// Cuentos.js (portadas) y CuentaCuentos.js (imágenes de página) usando
// this.load.image('miKey', 'assets/cuentos/miImagen.png'), y luego pon
// ese mismo 'miKey' aquí abajo.

export const stories = [
    {
        id: 'patitofeo',
        title: 'El Patito Feo',
        cover: null,
        pages: [
            { text: 'En una granja nació un patito distinto a sus hermanos, y todos se burlaban de él.', image: null },
            { text: 'Triste, el patito decidió irse a buscar un lugar donde nadie se riera de él.', image: null },
            { text: 'Pasó un otoño frío y un invierno solitario, escondido entre los juncos del río.', image: null },
            { text: 'Cuando llegó la primavera, vio en el agua a unos hermosos cisnes y se acercó con miedo.', image: null },
            { text: 'Al mirar su reflejo en el agua, descubrió que él también se había convertido en un cisne.', image: null },
            { text: 'Los demás cisnes lo recibieron con alegría, y por fin encontró su verdadero hogar.', image: null },
            { text: 'Fin.', image: null }
        ]
    },
    {
        id: 'trescerditos',
        title: 'Los 3 Cerditos',
        cover: null,
        pages: [
            { text: 'Tres cerditos hermanos decidieron construir cada uno su propia casa.', image: null },
            { text: 'El primero la hizo de paja, el segundo de madera, y el tercero de ladrillos.', image: null },
            { text: 'Un lobo hambriento sopló fuerte y derribó la casa de paja, y luego la de madera.', image: null },
            { text: 'Los tres hermanos corrieron a refugiarse juntos en la casa de ladrillos.', image: null },
            { text: 'El lobo sopló y sopló, pero la casa de ladrillos no se movió ni un poquito.', image: null },
            { text: 'Cansado, el lobo se fue, y los tres cerditos aprendieron el valor de trabajar con esmero.', image: null },
            { text: 'Fin.', image: null }
        ]
    },
    {
        id: 'leonyraton',
        title: 'El León y el Ratón',
        cover: null,
        pages: [
            { text: 'Un león dormía en el bosque cuando un pequeño ratón lo despertó por accidente.', image: null },
            { text: 'El león lo atrapó enojado, pero el ratón le prometió: "Algún día te ayudaré".', image: null },
            { text: 'El león se rió de la idea, pero lo dejó ir con curiosidad.', image: null },
            { text: 'Días después, el león quedó atrapado en la red de un cazador.', image: null },
            { text: 'El ratón escuchó sus rugidos y corrió a mordisquear las cuerdas hasta liberarlo.', image: null },
            { text: 'El león entendió que hasta el amigo más pequeño puede ser de gran ayuda.', image: null },
            { text: 'Fin.', image: null }
        ]
    },
    {
        id: 'caperucita',
        title: 'Caperucita Roja',
        cover: null,
        pages: [
            { text: 'Caperucita Roja fue a llevarle una canasta de comida a su abuelita, que vivía en el bosque.', image: null },
            { text: 'En el camino se encontró con un lobo, que corrió a adelantarse a la casa de la abuela.', image: null },
            { text: 'El lobo se disfrazó de abuelita y se escondió en su cama, esperando a Caperucita.', image: null },
            { text: '"Qué ojos y qué dientes tan grandes tienes", dijo Caperucita, algo extrañada.', image: null },
            { text: 'Un cazador que pasaba por ahí escuchó el alboroto y corrió a ayudar.', image: null },
            { text: 'El cazador ahuyentó al lobo, y Caperucita y su abuelita quedaron a salvo.', image: null },
            { text: 'Fin.', image: null }
        ]
    },
    {
        id: 'liebretortuga',
        title: 'La Liebre y la Tortuga',
        cover: null,
        pages: [
            { text: 'La liebre se burlaba siempre de lo lenta que caminaba la tortuga.', image: null },
            { text: 'Cansada de las burlas, la tortuga la retó a una carrera hasta el árbol grande.', image: null },
            { text: 'La liebre salió disparada y, muy confiada, decidió tomar una siesta a mitad de camino.', image: null },
            { text: 'La tortuga, paso a paso, sin detenerse nunca, siguió avanzando con calma.', image: null },
            { text: 'Cuando la liebre despertó, vio a la tortuga cruzando la meta justo delante de ella.', image: null },
            { text: 'Ese día, la liebre aprendió que la calma y la constancia ganan la carrera.', image: null },
            { text: 'Fin.', image: null }
        ]
    },
    {
        id: 'ricitosdeoro',
        title: 'Ricitos de Oro',
        cover: null,
        pages: [
            { text: 'Ricitos de Oro se perdió en el bosque y encontró una casita acogedora.', image: null },
            { text: 'Adentro había tres platos de sopa: probó los tres, y el más pequeño fue el que más le gustó.', image: null },
            { text: 'Luego probó tres sillas, y solo la más pequeña le quedó justo a su medida.', image: null },
            { text: 'Con sueño, subió a probar tres camas, y se quedó dormida en la más pequeña de todas.', image: null },
            { text: 'La familia de osos que vivía ahí volvió a casa y la encontró durmiendo.', image: null },
            { text: 'Ricitos de Oro despertó asustada y salió corriendo directo de vuelta a su casa.', image: null },
            { text: 'Fin.', image: null }
        ]
    }
];