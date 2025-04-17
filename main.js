import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#000',
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
  scene: [MenuScene, GameScene, GameOverScene]
};

const game = new Phaser.Game(config);
