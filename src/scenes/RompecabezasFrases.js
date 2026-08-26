import { activities } from './activities.js';

export class RompecabezasFrases extends Phaser.Scene {

    constructor() {
        super('RompecabezasFrases');
    }

    init(data) {
        this.activityId = data.activityId;
        this.sentenceIndex = 0;
        this.score = 0;
    }

    preload() {
        this.load.image('background', 'assets/fondo1.png');
        this.load.image('control', 'assets/control.png');
    }

    create() {
        this.activity = activities.find(a => a.id === this.activityId);
        this.sentences = Phaser.Utils.Array.Shuffle([...this.activity.sentences]);

        this.cameras.main.fadeIn(400, 0, 0, 0);
        this.add.image(640, 360, 'background').setScale(0.16);

        this.add.text(640, 45, this.activity.title, {
            fontFamily: 'Arial',
            fontSize: '38px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.roundText = this.add.text(80, 130, '', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#000000'
        });

        this.createScorePanel();
        this.createVerifyButton();
        this.createBackButton();
        this.setupDragEvents();

        this.feedbackText = this.add.text(640, 260, '', {
            fontFamily: 'Arial',
            fontSize: '26px',
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

        this.roundContainer = this.add.container(0, 0);

        this.startRound();
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

    // ---------- Manejo de rondas ----------

    startRound() {
        if (this.sentenceIndex >= this.sentences.length) {
            this.showFinalScreen();
            return;
        }

        this.roundContainer.removeAll(true);
        this.feedbackText.setText('');
        this.roundText.setText(`Frase ${this.sentenceIndex + 1} / ${this.sentences.length}`);

        this.correctWords = this.sentences[this.sentenceIndex];
        const shuffled = Phaser.Utils.Array.Shuffle([...this.correctWords]);

        this.slots = new Array(this.correctWords.length).fill(null);
        this.buildSlots();
        this.buildTrayChips(shuffled);
    }

    wordChipWidth(word) {
        return Math.max(90, word.length * 18 + 40);
    }

    // Redibuja un espacio para que se ajuste a la palabra que tiene puesta
    // en ese momento (sin importar si es la correcta o no). Si no tiene
    // ninguna palabra, vuelve a su tamaño vacío original.
    resizeSlot(zone, word) {
        const width = word ? this.wordChipWidth(word) : zone.defaultWidth;
        const height = 64;

        zone.width = width;
        zone.height = height;
        zone.setRectangleDropZone(width, height);

        zone.box.clear();
        zone.box.lineStyle(3, 0xffdd55, 0.5);
        zone.box.fillStyle(0x1b1b2f, 0.88);
        zone.box.fillRoundedRect(zone.baseX - width / 2, zone.baseY - height / 2, width, height, 14);
        zone.box.strokeRoundedRect(zone.baseX - width / 2, zone.baseY - height / 2, width, height, 14);
    }

    buildSlots() {
        const count = this.correctWords.length;
        const slotHeight = 64;
        const gap = 14;

        // Cada espacio mide justo lo que necesita la palabra que le corresponde
        // (no todas del mismo tamaño), así el fondo no queda más grande de lo necesario.
        const widths = this.correctWords.map(w => this.wordChipWidth(w));
        const totalWidth = widths.reduce((a, b) => a + b, 0) + gap * (count - 1);

        let x = 640 - totalWidth / 2;
        const y = 340;

        this.slotZones = [];

        for (let i = 0; i < count; i++) {
            const slotWidth = widths[i];
            const centerX = x + slotWidth / 2;

            const box = this.add.graphics();
            box.lineStyle(3, 0xffdd55, 0.5);
            box.fillStyle(0x1b1b2f, 0.88);
            box.fillRoundedRect(centerX - slotWidth / 2, y - slotHeight / 2, slotWidth, slotHeight, 14);
            box.strokeRoundedRect(centerX - slotWidth / 2, y - slotHeight / 2, slotWidth, slotHeight, 14);

            const zone = this.add.zone(centerX, y, slotWidth, slotHeight).setRectangleDropZone(slotWidth, slotHeight);
            zone.setData('slotIndex', i);
            zone.box = box;
            zone.baseX = centerX;
            zone.baseY = y;
            zone.width = slotWidth;
            zone.height = slotHeight;
            zone.defaultWidth = slotWidth;

            this.roundContainer.add([box, zone]);
            this.slotZones.push(zone);

            x += slotWidth + gap;
        }
    }

    buildTrayChips(words) {
        const chipHeight = 60;
        const gap = 14;
        const y = 480;

        // Calculamos el ancho de cada palabra para que las casillas no queden
        // todas igual de anchas si las palabras varían mucho de tamaño.
        const widths = words.map(w => this.wordChipWidth(w));
        const totalWidth = widths.reduce((a, b) => a + b, 0) + gap * (words.length - 1);
        let x = 640 - totalWidth / 2;

        this.trayChips = [];

        words.forEach((word, i) => {
            const width = widths[i];
            const chipX = x + width / 2;
            this.createWordChip(chipX, y, width, chipHeight, word);
            x += width + gap;
        });
    }

    createWordChip(x, y, width, height, word) {
        const chip = this.add.container(x, y);

        const box = this.add.graphics();
        box.fillStyle(0x2b2b45, 0.95);
        box.lineStyle(3, 0xffffff, 0.4);
        box.fillRoundedRect(-width / 2, -height / 2, width, height, 14);
        box.strokeRoundedRect(-width / 2, -height / 2, width, height, 14);

        const text = this.add.text(0, 0, word, {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        chip.add([box, text]);
        chip.setSize(width, height);
        chip.setData('word', word);
        chip.setData('originalPosition', { x, y });
        chip.setData('slotIndex', null);

        chip.setInteractive({ useHandCursor: true });
        this.input.setDraggable(chip);

        this.roundContainer.add(chip);
        this.trayChips.push(chip);
    }

    // ---------- Eventos de arrastrar y soltar ----------

    setupDragEvents() {
        this.input.on('dragstart', (pointer, gameObject) => {
            if (!this.trayChips || !this.trayChips.includes(gameObject)) return;
            this.children.bringToTop(gameObject);

            // Si la palabra ya estaba puesta en un espacio, la "recogemos":
            // se libera ese espacio y vuelve a su tamaño vacío de inmediato.
            const currentSlot = gameObject.getData('slotIndex');
            if (currentSlot !== null) {
                this.slots[currentSlot] = null;
                gameObject.setData('slotIndex', null);
                this.resizeSlot(this.slotZones[currentSlot], null);
            }
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (!this.trayChips || !this.trayChips.includes(gameObject)) return;
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('drop', (pointer, gameObject, dropZone) => {
            if (!this.trayChips || !this.trayChips.includes(gameObject)) return;
            if (!this.slotZones.includes(dropZone)) return;

            const targetIndex = dropZone.getData('slotIndex');

            // Si el espacio ya tiene otra palabra, se rechaza el soltado
            // (dragend se encargará de regresarla a la bandeja).
            if (this.slots[targetIndex] !== null) return;

            this.slots[targetIndex] = gameObject;
            gameObject.setData('slotIndex', targetIndex);

            // El cuadro se ajusta al tamaño de ESTA palabra, sin importar
            // si es la correcta para ese espacio o no.
            this.resizeSlot(dropZone, gameObject.getData('word'));

            this.tweens.add({
                targets: gameObject,
                x: dropZone.baseX,
                y: dropZone.baseY,
                duration: 150
            });
        });

        this.input.on('dragend', (pointer, gameObject) => {
            if (!this.trayChips || !this.trayChips.includes(gameObject)) return;

            // Siempre reubicamos según el estado real: si quedó asignada a un
            // espacio, va ahí; si no, vuelve a su posición original en la bandeja.
            const currentSlot = gameObject.getData('slotIndex');

            if (currentSlot !== null) {
                const zone = this.slotZones[currentSlot];
                this.tweens.add({ targets: gameObject, x: zone.baseX, y: zone.baseY, duration: 200 });
            } else {
                const pos = gameObject.getData('originalPosition');
                this.tweens.add({ targets: gameObject, x: pos.x, y: pos.y, duration: 200 });
            }
        });
    }

    // ---------- Verificación ----------

    createVerifyButton() {
        const x = 640;
        const y = 590;
        const width = 220;
        const height = 60;

        const box = this.add.graphics();
        box.fillStyle(0x2b2b45, 0.95);
        box.lineStyle(3, 0xffdd55, 1);
        box.fillRoundedRect(x - width / 2, y - height / 2, width, height, 18);
        box.strokeRoundedRect(x - width / 2, y - height / 2, width, height, 18);

        const label = this.add.text(x, y, '✅ Verificar', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const zone = this.add.zone(x, y, width, height).setInteractive({ useHandCursor: true });

        zone.on('pointerover', () => box.setAlpha(0.85));
        zone.on('pointerout', () => box.setAlpha(1));
        zone.on('pointerdown', () => this.verifyAnswer());
    }

    verifyAnswer() {
        if (this.slots.some(s => s === null)) {
            this.feedbackText.setColor('#ffdd55');
            this.feedbackText.setText('Completa todos los espacios primero');
            return;
        }

        const currentOrder = this.slots.map(chip => chip.getData('word'));
        const isCorrect = currentOrder.every((word, i) => word === this.correctWords[i]);

        if (isCorrect) {
            this.addScore(150);
            this.feedbackText.setColor('#7CFC00');
            this.feedbackText.setText('¡Muy bien! 🎉');

            this.time.delayedCall(1200, () => {
                this.sentenceIndex++;
                this.startRound();
            });
        } else {
            this.addScore(-30);
            this.feedbackText.setColor('#ff6b6b');
            this.feedbackText.setText('No es correcto, ¡vamos de nuevo!');
            this.shakeSlots();

            this.time.delayedCall(900, () => {
                this.startRound();
            });
        }
    }

    shakeSlots() {
        this.slotZones.forEach(zone => {
            zone.box.clear();
            zone.box.lineStyle(3, 0xff6b6b, 0.8);
            zone.box.fillStyle(0x1b1b2f, 0.88);
            zone.box.fillRoundedRect(zone.baseX - zone.width / 2, zone.baseY - zone.height / 2, zone.width, zone.height, 14);
            zone.box.strokeRoundedRect(zone.baseX - zone.width / 2, zone.baseY - zone.height / 2, zone.width, zone.height, 14);
        });

        this.time.delayedCall(400, () => {
            this.slotZones.forEach(zone => {
                zone.box.clear();
                zone.box.lineStyle(3, 0xffdd55, 0.5);
                zone.box.fillStyle(0x1b1b2f, 0.88);
                zone.box.fillRoundedRect(zone.baseX - zone.width / 2, zone.baseY - zone.height / 2, zone.width, zone.height, 14);
                zone.box.strokeRoundedRect(zone.baseX - zone.width / 2, zone.baseY - zone.height / 2, zone.width, zone.height, 14);
            });
        });
    }

    showFinalScreen() {
        this.roundContainer.removeAll(true);
        this.roundText.setText('');
        this.feedbackText.setText('');
        this.finalText.setText(`¡Terminaste! 🎉\nPuntos: ${this.score}`);
        this.finalText.setVisible(true);
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