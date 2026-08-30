import { activities } from './activities.js';

const MEMORY_CONFIG = {
    defaultCharacters: ['caperucita', 'cerditos', 'leon', 'tortuga', 'patito', 'ricitos'],
    cols: 4,
    rows: 3,
    cellWidth: 260,
    cellHeight: 130,
    gap: 18,
    flipDelayMs: 650,
    matchScore: 100,
    mismatchPenalty: 10,
};

export class Memorama extends Phaser.Scene {

    constructor() {
        super('Memorama');
    }

    init(data) {
        this.activityId = data ? data.activityId : null;
        this.score = 0;
        this.attempts = 0;
        this.matchedPairs = 0;
        this.firstCard = null;
        this.secondCard = null;
        this.busy = false;
    }

    preload() {
        this.load.image('background', 'assets/fondo1.png');
        this.load.image('control', 'assets/control.png');
        this.load.image('intentos', 'assets/intentos.png')
        this.load.image('puntos', 'assets/puntos.png')
        MEMORY_CONFIG.defaultCharacters.forEach(key => {
            this.load.image(key, `assets/${key}.png`);
        });
    }

    create() {
        this.activity = activities.find(a => a.id === this.activityId);
        this.characters = (this.activity && this.activity.characters) || MEMORY_CONFIG.defaultCharacters;
        this.totalPairs = this.characters.length;

        this.cameras.main.fadeIn(400, 0, 0, 0);
        this.add.image(640, 360, 'background').setScale(0.16);
        this.add.image(125, 35, 'intentos').setScale(0.3)
        this.add.image(1150, 40, 'puntos').setScale(0.3)

        this.add.text(640, 45, (this.activity && this.activity.title) || 'Memorama de Cuentos', {
            fontFamily: 'Arial',
            fontSize: '38px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.attemptsText = this.add.text(120, 90, '', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.scoreText = this.add.text(1160, 90, '', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(1, 0.5);

        this.feedbackText = this.add.text(640, 130, '', {
            fontFamily: 'Arial',
            fontSize: '22px',
            color: '#7CFC00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.finalText = this.add.text(640, 360, '', {
            fontFamily: 'Arial',
            fontSize: '40px',
            color: '#ffdd55',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5).setVisible(false);

        this.cards = [];
        this.buildBoard();
        this.createBackButton();
        this.updateHUD();
    }

    buildBoard() {
        const deck = Phaser.Utils.Array.Shuffle(
            [...this.characters, ...this.characters]
        );

        const { cols, rows, cellWidth, cellHeight, gap } = MEMORY_CONFIG;
        const gridWidth = cols * cellWidth + (cols - 1) * gap;
        const startX = 640 - gridWidth / 2 + cellWidth / 2;
        const startY = 225;

        deck.forEach((character, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = startX + col * (cellWidth + gap);
            const y = startY + row * (cellHeight + gap);
            this.createCard(x, y, cellWidth, cellHeight, character);
        });
    }

    createCard(x, y, w, h, character) {
        const container = this.add.container(x, y);

        // ---- Cara trasera (oculta el personaje) ----
        const backPanel = this.add.graphics();
        backPanel.fillStyle(0x2b2b45, 0.95);
        backPanel.lineStyle(3, 0xffdd55, 0.5);
        backPanel.fillRoundedRect(-w / 2, -h / 2, w, h, 18);
        backPanel.strokeRoundedRect(-w / 2, -h / 2, w, h, 18);

        const backText = this.add.text(0, 0, '?', {
            fontFamily: 'Arial',
            fontSize: '52px',
            color: '#ffdd55',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // ---- Cara frontal (el personaje, oculta al inicio) ----
        const frontImg = this.add.image(0, 0, character);
        const padding = 10;
        const scale = Math.min((w - padding * 2) / frontImg.width, (h - padding * 2) / frontImg.height);
        frontImg.setScale(scale);
        frontImg.setVisible(false);

        container.add([backPanel, backText, frontImg]);
        container.setSize(w, h);
        container.setInteractive({ useHandCursor: true });

        container.backPanel = backPanel;
        container.backText = backText;
        container.frontImg = frontImg;

        container.setData('character', character);
        container.setData('flipped', false);
        container.setData('matched', false);

        container.on('pointerover', () => {
            if (!container.getData('flipped') && !container.getData('matched')) {
                this.tweens.add({ targets: container, scale: 1.04, duration: 100 });
            }
        });
        container.on('pointerout', () => {
            this.tweens.add({ targets: container, scale: 1, duration: 100 });
        });
        container.on('pointerdown', () => this.handleCardClick(container));

        this.cards.push(container);
        return container;
    }

    handleCardClick(container) {
        if (this.busy) return;
        if (container.getData('flipped') || container.getData('matched')) return;

        this.flipCard(container, true);
        container.setData('flipped', true);

        if (!this.firstCard) {
            this.firstCard = container;
            return;
        }

        this.secondCard = container;
        this.attempts++;
        this.updateHUD();
        this.busy = true;

        this.time.delayedCall(MEMORY_CONFIG.flipDelayMs, () => this.evaluateMatch());
    }

    evaluateMatch() {
        const a = this.firstCard;
        const b = this.secondCard;

        if (a.getData('character') === b.getData('character')) {
            a.setData('matched', true);
            b.setData('matched', true);
            a.disableInteractive();
            b.disableInteractive();

            this.matchedPairs++;
            this.score += MEMORY_CONFIG.matchScore;
            this.flashFeedback('¡Pareja encontrada! 🎉', '#7CFC00');

            this.tweens.add({ targets: [a, b], scale: 1.08, yoyo: true, duration: 150 });

            this.resetSelection();
            this.updateHUD();

            if (this.matchedPairs >= this.totalPairs) {
                this.time.delayedCall(500, () => this.endGame());
            }
        } else {
            this.score = Math.max(0, this.score - MEMORY_CONFIG.mismatchPenalty);
            this.flashFeedback('Intenta de nuevo', '#EF476F');

            this.flipCard(a, false);
            this.flipCard(b, false);
            a.setData('flipped', false);
            b.setData('flipped', false);

            this.resetSelection();
            this.updateHUD();
        }
    }

    resetSelection() {
        this.firstCard = null;
        this.secondCard = null;
        this.busy = false;
    }

    flipCard(container, toFront) {
        this.tweens.add({
            targets: container,
            scaleX: 0,
            duration: 120,
            ease: 'Sine.easeIn',
            onComplete: () => {
                container.backPanel.setVisible(!toFront);
                container.backText.setVisible(!toFront);
                container.frontImg.setVisible(toFront);
                this.tweens.add({ targets: container, scaleX: 1, duration: 120, ease: 'Sine.easeOut' });
            }
        });
    }

    flashFeedback(msg, color) {
        this.feedbackText.setColor(color);
        this.feedbackText.setText(msg);
        this.tweens.killTweensOf(this.feedbackText);
        this.feedbackText.setAlpha(1);
        this.tweens.add({ targets: this.feedbackText, alpha: 0, duration: 700, delay: 500 });
    }

    updateHUD() {
        this.attemptsText.setText(`${this.attempts}`);
        this.scoreText.setText('' + this.score);
    }

    endGame() {
        const stars = this.calculateStars();
        this.finalText.setText(
            `¡Los encontraste todos! 🎉\nPuntos: ${this.score}\n${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}`
        );
        this.finalText.setVisible(true);
        this.finalText.setAlpha(0);
        this.tweens.add({ targets: this.finalText, alpha: 1, duration: 300 });
    }

    calculateStars() {
        if (this.attempts <= this.totalPairs + 2) return 3;
        if (this.attempts <= this.totalPairs + 5) return 2;
        return 1;
    }

    createBackButton() {
        const backBtn = this.add.image(80, 660, 'control')
            .setDisplaySize(90, 90)
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
