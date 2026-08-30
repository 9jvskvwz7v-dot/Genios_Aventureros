import { activities } from './activities.js';

export class UnePalabraImagen extends Phaser.Scene {

    constructor() {
        super('UnePalabraImagen');
    }

    init(data) {
        this.activityId = data.activityId;
        this.score = 0;
        this.matchedCount = 0;
    }

    preload() {
        this.load.image('background', 'assets/fondo1.png');
        this.load.image('control', 'assets/control.png');
    }

    create() {
        this.activity = activities.find(a => a.id === this.activityId);
        this.pairs = this.activity.pairs;

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
        this.setupDragEvents();
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
        const startY = 150;
        const spacing = 106;
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
        box.fillStyle(0x2b2b45, 0.95);
        box.lineStyle(3, 0xffffff, 0.4);
        box.fillRoundedRect(-width / 2, -height / 2, width, height, 16);
        box.strokeRoundedRect(-width / 2, -height / 2, width, height, 16);

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

        chip.setInteractive({ useHandCursor: true });
        this.input.setDraggable(chip);

        this.chips.push(chip);
    }

    createImageTarget(x, y, pairIndex) {
        const size = 84;

        const box = this.add.graphics();
        box.fillStyle(0x1b1b2f, 0.85);
        box.lineStyle(3, 0xffdd55, 0.5);
        box.fillRoundedRect(x - size / 2, y - size / 2, size, size, 18);
        box.strokeRoundedRect(x - size / 2, y - size / 2, size, size, 18);

        const emojiText = this.add.text(x, y, this.pairs[pairIndex].emoji, {
            fontSize: '42px'
        }).setOrigin(0.5);

        const zone = this.add.zone(x, y, size, size).setRectangleDropZone(size, size);
        zone.setData('pairIndex', pairIndex);
        zone.setData('used', false);
        zone.box = box;
        zone.emojiText = emojiText;

        this.dropZones.push(zone);
    }

    // ---------- Eventos de arrastrar y soltar ----------

    setupDragEvents() {
        this.input.on('dragstart', (pointer, gameObject) => {
            this.children.bringToTop(gameObject);
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('drop', (pointer, gameObject, dropZone) => {
            const chipPair = gameObject.getData('pairIndex');
            const zonePair = dropZone.getData('pairIndex');

            if (chipPair === zonePair && !dropZone.getData('used')) {

                gameObject.setData('locked', true);
                dropZone.setData('used', true);
                gameObject.disableInteractive();

                dropZone.box.destroy();
                dropZone.emojiText.destroy();

                this.tweens.add({
                    targets: gameObject,
                    x: dropZone.x,
                    y: dropZone.y,
                    duration: 150
                });

                const pillWidth = 240;
                const pillHeight = 64;

                gameObject.box.clear();
                gameObject.box.fillStyle(0x4caf50, 0.95);
                gameObject.box.lineStyle(3, 0xffffff, 0.6);
                gameObject.box.fillRoundedRect(-pillWidth / 2, -pillHeight / 2, pillWidth, pillHeight, 16);
                gameObject.box.strokeRoundedRect(-pillWidth / 2, -pillHeight / 2, pillWidth, pillHeight, 16);

                gameObject.wordText.setPosition(30, 0);

                const emoji = this.pairs[chipPair].emoji;
                const emojiText = this.add.text(-85, 0, emoji, { fontSize: '30px' }).setOrigin(0.5);
                gameObject.add(emojiText);

                this.addScore(100);
                this.matchedCount++;
                this.checkWin();
            } else {
                // Incorrecto
                this.addScore(-20);
                this.flashWrong(gameObject);
            }
        });

        this.input.on('dragend', (pointer, gameObject) => {
            if (!gameObject.getData('locked')) {
                const pos = gameObject.getData('originalPosition');
                this.tweens.add({ targets: gameObject, x: pos.x, y: pos.y, duration: 200 });
            }
        });
    }

    flashWrong(chip) {
        this.tweens.add({
            targets: chip,
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