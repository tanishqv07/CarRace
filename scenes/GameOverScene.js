export default class GameOverScene extends Phaser.Scene {
    constructor() {
      super({ key: 'GameOverScene' });
    }
  
    init(data) {
      this.result = data.result || 'GAME OVER';
    }
  
    create() {
      this.add.text(400, 250, this.result, { fontSize: '48px', color: '#ff0000' }).setOrigin(0.5);
      this.add.text(400, 320, 'Press SPACE to Retry', { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5);
      this.input.keyboard.once('keydown-SPACE', () => {
        this.scene.start('MenuScene');
      });
    }
  }
  