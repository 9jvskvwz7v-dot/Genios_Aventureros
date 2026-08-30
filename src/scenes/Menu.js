export class Menu extends Phaser.Scene {

    constructor() {
        super('Menu');
    }

    create() {
        
        this.cameras.main.fadeIn(500, 0, 0, 0);

        
        this.add.image(640, 360, 'background').setScale(0.16);

        this.logo = this.add.image(450, 340, 'logo').setScale(0.8);

        this.tweens.add({
            targets: this.logo,
            y: 280,
            duration: 1500,
            ease: 'Sine.inOut',
            yoyo: true,
            loop: -1
        });

        this.createMenuButton(1000, 500, 'btnCuentos', 'Cuentos').setScale(0.1);
        this.createMenuButton(1000, 300, 'btnActividades', 'Actividades').setScale(0.1);
    }

    createMenuButton(x, y, textureKey, targetScene) {
        const button = this.add.image(x, y, textureKey)
            .setScale(0.15)
            .setInteractive({ useHandCursor: true });

        button.on('pointerover', () => {
            this.tweens.add({
                targets: button,
                scale: 0.15,
                duration: 150,
                ease: 'Sine.easeOut'
            });
        });

        button.on('pointerout', () => {
            this.tweens.add({
                targets: button,
                scale: 0.10,
                duration: 150,
                ease: 'Sine.easeOut'
            });
        });

        button.on('pointerdown', () => {
            this.tweens.add({
                targets: button,
                scale: 0.15,
                duration: 80,
                yoyo: true,
                onComplete: () => {
                    this.scene.start(targetScene);
                }
            });
        });

        return button;
    }
}
