import { activities } from './activities.js';

export class CompletaPalabra extends Phaser.Scene {

    constructor() {
        super('CompletaPalabra');
    }

    init(data) {
        this.activityId = data.activityId;
        this.wordIndex = 0;
        this.score = 0;
    }

    preload() {
        this.load.image('background', 'assets/fondo1.png');
        this.load.image('control', 'assets/control.png');
    }

    create() {
        this.activity = activities.find(a => a.id === this.activityId);
        this.words = Phaser.Utils.Array.Shuffle([...this.activity.words.map(w => w.toUpperCase())]);

        this.cameras.main.fadeIn(400, 0, 0, 0);
        this.add.image(640, 360, 'background').setScale(0.16);

        this.add.text(640, 45, this.activity.title, {
            fontFamily: 'Arial',
            fontSize: '38px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.roundText = this.add.text(1160, 50, '', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#aaaaaa'
        }).setOrigin(1, 0.5);

        this.scoreText = this.add.text(1160, 80, '', {
            fontFamily: 'Arial',
            fontSize: '22px',
            color: '#ffdd55',
            fontStyle: 'bold'
        }).setOrigin(1, 0.5);

        this.feedbackText = this.add.text(640, 590, '', {
            fontFamily: 'Arial',
            fontSize: '28px',
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

        this.letterBoxContainer = this.add.container(0, 0);
        this.optionButtonsContainer = this.add.container(0, 0);

        this.createSpeakButton();
        this.createBackButton();

        this.startRound();
    }

    // ---------- Manejo de rondas ----------

    startRound() {
        if (this.wordIndex >= this.words.length) {
            this.showFinalScreen();
            return;
        }

        this.currentWord = this.words[this.wordIndex];
        this.roundText.setText(`Palabra ${this.wordIndex + 1} / ${this.words.length}`);
        this.scoreText.setText(`${this.score}`);
        this.feedbackText.setText('');

        this.blankIndices = this.pickBlankIndices(this.currentWord);
        this.filledLetters = this.currentWord.split('').map((letter, i) =>
            this.blankIndices.includes(i) ? null : letter
        );
        this.nextBlankPointer = 0;

        this.buildLetterBoxes();
        this.buildOptionButtons();

        // Reproducir la palabra automáticamente al empezar la ronda
        this.time.delayedCall(300, () => this.speakWord());
    }

    pickBlankIndices(word) {
        let blankCount = 1;
        if (word.length >= 7) blankCount = 3;
        else if (word.length >= 5) blankCount = 2;

        const indices = Phaser.Utils.Array.NumberArray(0, word.length - 1);
        Phaser.Utils.Array.Shuffle(indices);
        return indices.slice(0, blankCount).sort((a, b) => a - b);
    }

    // ---------- Voz generada por el navegador ----------

    speakWord() {
        if (!('speechSynthesis' in window)) return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(this.currentWord);
        utterance.lang = 'es-ES';
        utterance.rate = 0.8;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
    }

    createSpeakButton() {
        const btn = this.add.graphics();
        btn.fillStyle(0x2b2b45, 0.95);
        btn.lineStyle(3, 0xffdd55, 1);
        btn.fillRoundedRect(540, 155, 200, 60, 18);
        btn.strokeRoundedRect(540, 155, 200, 60, 18);

        const label = this.add.text(640, 185, '🔊 Escuchar', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const zone = this.add.zone(640, 185, 200, 60).setInteractive({ useHandCursor: true });

        zone.on('pointerover', () => label.setColor('#ffdd55'));
        zone.on('pointerout', () => label.setColor('#ffffff'));
        zone.on('pointerdown', () => this.speakWord());
    }

    // ---------- Casillas de la palabra ----------

    buildLetterBoxes() {
        this.letterBoxContainer.removeAll(true);
        this.letterBoxSprites = [];

        const boxSize = 60;
        const gap = 10;
        const word = this.currentWord;
        const totalWidth = word.length * boxSize + (word.length - 1) * gap;
        const startX = 640 - totalWidth / 2 + boxSize / 2;
        const y = 300;

        word.split('').forEach((letter, i) => {
            const x = startX + i * (boxSize + gap);

            const box = this.add.graphics();
            box.fillStyle(0xffffff, 0.95);
            box.lineStyle(3, 0xdddddd, 1);
            box.fillRoundedRect(x - boxSize / 2, y - boxSize / 2, boxSize, boxSize, 12);
            box.strokeRoundedRect(x - boxSize / 2, y - boxSize / 2, boxSize, boxSize, 12);

            const isBlank = this.blankIndices.includes(i);
            const text = this.add.text(x, y, isBlank ? '' : letter, {
                fontFamily: 'Arial',
                fontSize: '34px',
                color: '#000000',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            this.letterBoxContainer.add([box, text]);
            this.letterBoxSprites[i] = { box, text, x, y, isBlank };
        });
    }

    // ---------- Opciones de letras ----------

    buildOptionButtons() {
        this.optionButtonsContainer.removeAll(true);

        const missingLetters = this.blankIndices.map(i => this.currentWord[i]);
        const decoyCount = 2;
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const decoys = [];

        while (decoys.length < decoyCount) {
            const letter = alphabet[Math.floor(Math.random() * alphabet.length)];
            if (!missingLetters.includes(letter) && !decoys.includes(letter)) {
                decoys.push(letter);
            }
        }

        const options = Phaser.Utils.Array.Shuffle([...missingLetters, ...decoys]);

        const boxSize = 66;
        const gap = 16;
        const totalWidth = options.length * boxSize + (options.length - 1) * gap;
        const startX = 640 - totalWidth / 2 + boxSize / 2;
        const y = 460;

        options.forEach((letter, index) => {
            const x = startX + index * (boxSize + gap);
            this.createOptionButton(x, y, boxSize, letter);
        });
    }

    createOptionButton(x, y, size, letter) {
        const box = this.add.graphics();
        box.fillStyle(0x2b2b45, 0.95);
        box.lineStyle(3, 0xffffff, 0.4);
        box.fillRoundedRect(x - size / 2, y - size / 2, size, size, 14);
        box.strokeRoundedRect(x - size / 2, y - size / 2, size, size, 14);

        const text = this.add.text(x, y, letter, {
            fontFamily: 'Arial',
            fontSize: '30px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const zone = this.add.zone(x, y, size, size).setInteractive({ useHandCursor: true });

        this.optionButtonsContainer.add([box, text, zone]);

        zone.on('pointerover', () => { if (zone.input.enabled) box.setAlpha(0.8); });
        zone.on('pointerout', () => { box.setAlpha(1); });

        zone.on('pointerdown', () => {
            this.handleLetterChoice(letter, { box, text, zone });
        });
    }

    // ---------- Lógica de juego ----------

    handleLetterChoice(letter, buttonRefs) {
        const targetIndex = this.blankIndices[this.nextBlankPointer];
        const correctLetter = this.currentWord[targetIndex];

        if (letter === correctLetter) {
            this.placeCorrectLetter(targetIndex, letter);
            buttonRefs.zone.disableInteractive();
            buttonRefs.box.setAlpha(0.25);
            buttonRefs.text.setAlpha(0.25);

            this.nextBlankPointer++;

            if (this.nextBlankPointer >= this.blankIndices.length) {
                this.completeRound();
            }
        } else {
            this.flashWrong(buttonRefs.box);
        }
    }

    placeCorrectLetter(index, letter) {
        const slot = this.letterBoxSprites[index];
        slot.text.setText(letter);
        slot.text.setColor('#2e7d32');

        slot.box.clear();
        slot.box.fillStyle(0xe8f8e8, 1);
        slot.box.lineStyle(3, 0x4caf50, 1);
        slot.box.fillRoundedRect(slot.x - 30, slot.y - 30, 60, 60, 12);
        slot.box.strokeRoundedRect(slot.x - 30, slot.y - 30, 60, 60, 12);
    }

    flashWrong(box) {
        this.tweens.add({
            targets: box,
            alpha: 0.3,
            duration: 90,
            yoyo: true,
            repeat: 1
        });
    }

    completeRound() {
        this.score += 150;
        this.scoreText.setText(`${this.score}`);
        this.feedbackText.setText('¡Muy bien!');

        this.time.delayedCall(1200, () => {
            this.wordIndex++;
            this.startRound();
        });
    }

    showFinalScreen() {
        this.letterBoxContainer.removeAll(true);
        this.optionButtonsContainer.removeAll(true);
        this.roundText.setText('');
        this.feedbackText.setText('');

        this.finalText.setVisible(true);
        this.finalText.setText(`¡Terminaste! 🎉\nPuntos: ${this.score}`);
    }

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
        backBtn.on('pointerdown', () => {
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            this.scene.start('Actividades');
        });
    }
}
