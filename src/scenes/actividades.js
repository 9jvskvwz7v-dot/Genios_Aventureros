import { activities } from './activities.js';

export class Actividades extends Phaser.Scene {

    constructor() {
        super('Actividades');
    }

    preload() {
        this.load.image('background', 'assets/fondo1.png');
        this.load.image('casita', 'assets/casita.png');
        this.load.image('Sopa', 'assets/Sopa.png');
    }

    create() {
        this.cameras.main.fadeIn(400, 0, 0, 0);

        this.add.image(640, 360, 'background').setScale(0.16);

        this.add.text(640, 70, 'Actividades', {
            fontFamily: 'Arial',
            fontSize: '56px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.createActivityGrid();
        this.createBackButton();
    }

    createActivityGrid() {
        const cols = 3;
        const cellWidth = 360;
        const cellHeight = 180;
        const gap = 20;

        const rowSpacing = cellHeight + gap;
        const colSpacing = cellWidth + gap;

        const gridWidth = cols * cellWidth + (cols - 1) * gap;
        const startX = 640 - gridWidth / 2 + cellWidth / 2;
        const startY = 260;

        activities.slice(0, 6).forEach((activity, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);

            const x = startX + col * colSpacing;
            const y = startY + row * rowSpacing;

            this.createActivityCard(x, y, cellWidth, cellHeight, activity);
        });
    }

    createActivityCard(x, y, w, h, activity) {
        const container = this.add.container(x, y);

        // Fondo de la tarjeta (siempre visible, aunque tenga imagen encima)
        const panel = this.add.graphics();
        panel.fillStyle(0x2b2b45, 0.9);
        panel.lineStyle(3, 0xffffff, 0.35);
        panel.fillRoundedRect(-w / 2, -h / 2, w, h, 20);
        panel.strokeRoundedRect(-w / 2, -h / 2, w, h, 20);
        container.add(panel);

        if (activity.cover) {
            // Imagen de portada: se escala PROPORCIONALMENTE para que quepa
            // dentro de la celda sin estirarse ni deformarse.
            const img = this.add.image(0, 0, activity.cover);
            const padding = 14;
            const maxW = w - padding * 2;
            const maxH = h - padding * 2;
            const scale = Math.min(maxW / img.width, maxH / img.height);
            img.setScale(scale);
            container.add(img);
        } else {
            const title = this.add.text(0, 0, activity.title, {
                fontFamily: 'Arial',
                fontSize: '24px',
                color: '#ffffff',
                fontStyle: 'bold',
                align: 'center',
                wordWrap: { width: w - 40 }
            }).setOrigin(0.5);
            container.add(title);
        }

        const zone = this.add.zone(0, 0, w, h).setInteractive({ useHandCursor: true });
        container.add(zone);

        zone.on('pointerover', () => {
            this.tweens.add({ targets: container, scale: 1.05, duration: 120 });
        });

        zone.on('pointerout', () => {
            this.tweens.add({ targets: container, scale: 1, duration: 120 });
        });

        zone.on('pointerdown', () => {
            if (activity.type === 'wordsearch') {
                this.scene.start('SopaDeLetras', { activityId: activity.id });
            } else if (activity.type === 'completeword') {
                this.scene.start('CompletaPalabra', { activityId: activity.id });
            } else if (activity.type === 'matchimage') {
                this.scene.start('UnePalabraImagen', { activityId: activity.id });
            } else if (activity.type === 'sentencepuzzle') {
                this.scene.start('RompecabezasFrases', { activityId: activity.id });
            }
        });
    }

    createBackButton() {
        const backBtn = this.add.image(80, 625, 'casita')
            .setDisplaySize(100, 100)
            .setInteractive({ useHandCursor: true });
        const baseScale = backBtn.scaleX;

        backBtn.on('pointerover', () => {
            this.tweens.add({ targets: backBtn, scale: baseScale * 1.15, duration: 120 });
        });
        backBtn.on('pointerout', () => {
            this.tweens.add({ targets: backBtn, scale: baseScale, duration: 120 });
        });
        backBtn.on('pointerdown', () => this.scene.start('Menu'));
    }
}