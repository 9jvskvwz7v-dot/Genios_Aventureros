import { Start } from './scenes/start.js';
import { Menu } from './scenes/Menu.js';
import { Cuentos } from './scenes/cuentos.js';
import { CuentaCuentos } from './scenes/CuentaCuentos.js';
import { Actividades } from './scenes/actividades.js';
import { SopaDeLetras } from './scenes/sopa.js';
import { CompletaPalabra } from './scenes/completa.js';
import { UnePalabraImagen } from './scenes/unePalabra.js';
import { RompecabezasFrases } from './scenes/RompecabezasFrases.js';
import { BurbujasLetras } from './scenes/burbujas.js';
import { Memorama } from './scenes/memorama.js';

const config = {
    type: Phaser.AUTO,
    title: 'Genius',
    description: '',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    pixelArt: false,
    scene: [
        Start,
        Menu,
        Cuentos,
        CuentaCuentos,
        Actividades,
        SopaDeLetras,
        CompletaPalabra,
        UnePalabraImagen,
        RompecabezasFrases,
        BurbujasLetras,
        Memorama,
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);