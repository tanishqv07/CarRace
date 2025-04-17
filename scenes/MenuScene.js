export default class MenuScene extends Phaser.Scene {
    constructor() {
      super({ key: 'MenuScene' });
    }
  
    create() {
      this.add.text(400, 200, 'INDIAN RACING GAME', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
      this.add.text(400, 300, 'Press 1 for Single Player', { fontSize: '24px', color: '#fff' }).setOrigin(0.5);
      this.add.text(400, 350, 'Press 2 for Two Players', { fontSize: '24px', color: '#fff' }).setOrigin(0.5);
  
      this.input.keyboard.on('keydown-ONE', () => this.scene.start('GameScene', { mode: 'single' }));
      this.input.keyboard.on('keydown-TWO', () => this.scene.start('GameScene', { mode: 'two' }));
    }
  }
  