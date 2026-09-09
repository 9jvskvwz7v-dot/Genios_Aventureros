import { activities } from './activities.js';

export class UnePalabraImagen extends Phaser.Scene {

    constructor() {
        super('UnePalabraImagen');
    }

    init(data) {
        this.activityId = data.activityId;
        this.score = 0;
        this.matchedCount = 0;
        this.selectedChip = null;

        this.activity = activities.find(a => a.id === this.activityId);

        const allPairs = this.activity.pairs;
        const roundSize = this.activity.pairsPerRound || allPairs.length;
        this.pairs = Phaser.Utils.Array.Shuffle([...allPairs]).slice(0, roundSize);
    }

    preload() {
        this.load.image('background', 'assets/fondo1.png');
        this.load.image('control', 'assets/control.png');
        this.load.image('avion', 'assets/btn_avion.png');
        this.load.image('bosque', 'assets/btn_bosque.png');
        this.load.image('balon', 'assets/btn_balon.png');
        this.load.image('casa', 'assets/btn_casa.png');
        this.load.image('carro', 'assets/btn_carro.png');
        this.load.image('computadora', 'assets/btn_computadora.png');
        this.load.image('estrella', 'assets/btn_estrella.png');
        this.load.image('flor', 'assets/btn_flor.png');
        this.load.image('gato', 'assets/btn_gato.png');
        this.load.image('helado', 'assets/btn_helado.png');
        this.load.image('joystick', 'assets/btn_joystick.png');
        this.load.image('luna', 'assets/btn_luna.png');
        this.load.image('mochila', 'assets/btn_mochila.png');
        this.load.image('nave', 'assets/btn_nave.png');
        this.load.image('pajaro', 'assets/btn_pajaro.png');
        this.load.image('perro', 'assets/btn_perro.png');
        this.load.image('sol', 'assets/btn_sol.png');
    
        this.pairs.forEach(pair => {
            this.load.image(pair.key, pair.image);
        });
    }

    create() {
        this.cameras.main.fadeIn(400, 0, 0, 0);
        this.add.image(640, 360, 'background').setScale(0.16);

        this.add.text(640, 45, this.activity.title, {
            fontFamily: 'Arial',
            fontSize: '38px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.createScorePanel();
        this.buildBoard();
        this.createBackButton();

        this.finalText = this.add.text(640, 360, '', {
            fontFamily: 'Arial',
            fontSize: '40px',
            color: '#ffdd55',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5).setVisible(false);
    }

    // ---------- Puntaje ----------

    createScorePanel() {
        const panel = this.add.graphics();
        panel.fillStyle(0x1b1b2f, 0.88);
        panel.lineStyle(3, 0xffffff, 0.25);
        panel.fillRoundedRect(1080, 20, 160, 70, 16);
        panel.strokeRoundedRect(1080, 20, 160, 70, 16);

        this.add.text(1160, 40, '⭐ Puntos', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#aaaaaa'
        }).setOrigin(0.5);

        this.scoreText = this.add.text(1160, 65, '0', {
            fontFamily: 'Arial',
            fontSize: '26px',
            color: '#ffdd55',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }

    addScore(delta) {
        this.score = Math.max(0, this.score + delta);
        this.scoreText.setText(this.score.toString());
    }

    // ---------- Construcción del tablero ----------

    buildBoard() {
        const count = this.pairs.length;
        const leftX = 380;
        const rightX = 900;

        // El espaciado se calcula según cuántos pares hay en esta partida,
        // para que siempre quepan bien repartidos en la misma área vertical.
        const areaTop = 140;
        const areaBottom = 620;
        const spacing = count > 1 ? (areaBottom - areaTop) / (count - 1) : 0;
        const startY = count > 1 ? areaTop : (areaTop + areaBottom) / 2;

        const wordOrder = Phaser.Utils.Array.NumberArray(0, count - 1);
        Phaser.Utils.Array.Shuffle(wordOrder);

        let imageOrder;
        let attempts = 0;
        do {
            imageOrder = Phaser.Utils.Array.NumberArray(0, count - 1);
            Phaser.Utils.Array.Shuffle(imageOrder);
            attempts++;
        } while (
            attempts < 30 &&
            wordOrder.some((pairIndex, slot) => pairIndex === imageOrder[slot])
        );

        this.dropZones = [];
        this.chips = [];

        wordOrder.forEach((pairIndex, slot) => {
            const y = startY + slot * spacing;
            this.createWordChip(leftX, y, pairIndex);
        });

        imageOrder.forEach((pairIndex, slot) => {
            const y = startY + slot * spacing;
            this.createImageTarget(rightX, y, pairIndex);
        });
    }

    createWordChip(x, y, pairIndex) {
        const word = this.pairs[pairIndex].word;
        const width = 180;
        const height = 64;

        const chip = this.add.container(x, y);

        const box = this.add.graphics();

        const text = this.add.text(0, 0, word, {
            fontFamily: 'Arial',
            fontSize: '22px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        chip.add([box, text]);
        chip.setSize(width, height);
        chip.setData('pairIndex', pairIndex);
        chip.setData('originalPosition', { x, y });
        chip.box = box;
        chip.wordText = text;

        this.drawChipBox(chip, false);

        chip.setInteractive({ useHandCursor: true });
        chip.on('pointerdown', () => this.onWordTap(chip));

        this.chips.push(chip);
    }

    // Dibuja el fondo de la palabra. 'selected' resalta el borde en
    // dorado y engrosa la línea para que se note cuál está elegida.
    drawChipBox(chip, selected) {
        const width = 180;
        const height = 64;

        chip.box.clear();
        chip.box.fillStyle(0x2b2b45, 0.95);
        chip.box.lineStyle(selected ? 4 : 3, selected ? 0xffdd55 : 0xffffff, selected ? 1 : 0.4);
        chip.box.fillRoundedRect(-width / 2, -height / 2, width, height, 16);
        chip.box.strokeRoundedRect(-width / 2, -height / 2, width, height, 16);
    }

    createImageTarget(x, y, pairIndex) {
        // Tamaño de la imagen (antes 68px, ahora más grande) y de la
        // zona de toque que la rodea. No se dibuja ningún cuadro de fondo:
        // solo se ve la imagen.
        const imageSize = 92;
        const zoneSize = 100;

        const pairImage = this.add.image(x, y, this.pairs[pairIndex].key)
            .setDisplaySize(imageSize, imageSize);

        const zone = this.add.zone(x, y, zoneSize, zoneSize)
            .setInteractive({ useHandCursor: true });
        zone.setData('pairIndex', pairIndex);
        zone.setData('used', false);
        zone.pairImage = pairImage;

        zone.on('pointerdown', () => this.onImageTap(zone));

        this.dropZones.push(zone);
    }

    // ---------- Selección: primero la palabra, luego la imagen ----------

    onWordTap(chip) {
        if (chip.getData('locked')) return;

        // Tocar la misma palabra otra vez la deselecciona
        if (this.selectedChip === chip) {
            this.setChipSelected(chip, false);
            this.selectedChip = null;
            return;
        }

        if (this.selectedChip) {
            this.setChipSelected(this.selectedChip, false);
        }

        this.selectedChip = chip;
        this.setChipSelected(chip, true);
    }

    setChipSelected(chip, selected) {
        this.drawChipBox(chip, selected);
        this.tweens.add({ targets: chip, scale: selected ? 1.06 : 1, duration: 120 });
    }

    onImageTap(zone) {
        if (zone.getData('used')) return;

        // Si aún no hay palabra elegida, solo damos una pista visual
        if (!this.selectedChip) {
            this.flashWrong(zone.pairImage);
            return;
        }

        const chip = this.selectedChip;
        const chipPair = chip.getData('pairIndex');
        const zonePair = zone.getData('pairIndex');

        if (chipPair === zonePair) {
            this.handleMatch(chip, zone);
        } else {
            this.addScore(-20);
            this.flashWrong(chip);
            this.flashWrong(zone.pairImage);
            this.setChipSelected(chip, false);
        }

        this.selectedChip = null;
    }

    handleMatch(chip, zone) {
        chip.setData('locked', true);
        zone.setData('used', true);
        chip.disableInteractive();
        zone.disableInteractive();

        this.tweens.add({ targets: chip, scale: 1, duration: 120 });

        const pillWidth = 240;
        const pillHeight = 64;

        chip.box.clear();
        chip.box.fillStyle(0x4caf50, 0.95);
        chip.box.lineStyle(3, 0xffffff, 0.6);
        chip.box.fillRoundedRect(-pillWidth / 2, -pillHeight / 2, pillWidth, pillHeight, 16);
        chip.box.strokeRoundedRect(-pillWidth / 2, -pillHeight / 2, pillWidth, pillHeight, 16);

        chip.wordText.setPosition(30, 0);

        const pairKey = this.pairs[chip.getData('pairIndex')].key;
        const pillImage = this.add.image(-85, 0, pairKey).setDisplaySize(40, 40);
        chip.add(pillImage);

        // La imagen de la derecha se desvanece y desaparece al encontrar
        // la pareja, dejando solo la columna de palabras.
        this.tweens.add({
            targets: zone.pairImage,
            alpha: 0,
            scale: 0.7,
            duration: 250,
            onComplete: () => zone.pairImage.destroy()
        });

        this.addScore(100);
        this.matchedCount++;
        this.checkWin();
    }

    flashWrong(target) {
        this.tweens.add({
            targets: target,
            alpha: 0.3,
            duration: 90,
            yoyo: true,
            repeat: 1
        });
    }

    checkWin() {
        if (this.matchedCount === this.pairs.length) {
            // Despejamos el tablero para que el mensaje final no compita
            // por espacio con las pastillas.
            this.tweens.add({
                targets: this.chips,
                alpha: 0,
                duration: 350,
                onComplete: () => {
                    this.finalText.setText(`¡Los uniste todos! 🎉\nPuntos: ${this.score}`);
                    this.finalText.setVisible(true);
                    this.finalText.setAlpha(0);
                    this.tweens.add({ targets: this.finalText, alpha: 1, duration: 300 });
                }
            });
        }
    }

    // ---------- Navegación ----------

    createBackButton() {
        const backBtn = this.add.image(80, 625, 'control')
            .setDisplaySize(100, 100)
            .setInteractive({ useHandCursor: true });
        const baseScale = backBtn.scaleX;

        backBtn.on('pointerover', () => {
            this.tweens.add({ targets: backBtn, scale: baseScale * 1.15, duration: 120 });
        });
        backBtn.on('pointerout', () => {
            this.tweens.add({ targets: backBtn, scale: baseScale, duration: 120 });
        });
        backBtn.on('pointerdown', () => this.scene.start('Actividades'));
    }
}