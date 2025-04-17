export default class GameScene extends Phaser.Scene {
    constructor() {
      super({ key: 'GameScene' });
    }
  
    init(data) {
      this.mode = data.mode;
      this.fuel = 100;
      this.timeLeft = 180;
    }
  
    preload() {
      this.load.image('car1', 'assets/cars/car1.png');
      this.load.image('car2', 'assets/cars/car2.png');
      this.load.image('road', 'assets/tiles/road.png');
      this.load.image('fuel', 'assets/pickups/fuel.png');
      this.load.image('red_car', 'assets/obstacles/red_car.png');
      this.load.image('blue_biker', 'assets/obstacles/blue_biker.png');
    }
  
    create() {
      this.paused = false;
      this.lastFuelDrain = 0;
  
      this.background1 = this.add.tileSprite(0, 0, 800, 600, 'road').setOrigin(0);
      this.background2 = this.add.tileSprite(0, 0, 800, 600, 'road').setOrigin(0);
  
      this.player1 = this.physics.add.sprite(400, 500, 'car1');
      this.player2 = this.mode === 'two' ? this.physics.add.sprite(400, 500, 'car2') : null;
  
      this.cameras.main.setViewport(0, 0, 800, this.mode === 'two' ? 300 : 600);
      this.cameras.main.startFollow(this.player1);
  
      if (this.mode === 'two') {
        this.cam2 = this.cameras.add(0, 300, 800, 300);
        this.cam2.startFollow(this.player2);
      }
  
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keys = this.input.keyboard.addKeys('W,A,S,D,P');
  
      this.input.keyboard.on('keydown-P', () => {
        this.paused = !this.paused;
        this.physics.world.isPaused = this.paused;
      });
  
      this.fuelText = this.add.text(10, 10, 'Fuel: 100%', { fontSize: '16px', fill: '#fff' }).setScrollFactor(0);
      this.timerText = this.add.text(680, 10, 'Time: 3:00', { fontSize: '16px', fill: '#fff' }).setScrollFactor(0);
  
      this.fuelGroup = this.physics.add.group();
      this.time.addEvent({ delay: 10000, callback: this.spawnFuel, callbackScope: this, loop: true });
  
      this.obstacles = this.physics.add.group();
      this.time.addEvent({ delay: 3000, callback: this.spawnObstacle, callbackScope: this, loop: true });
  
      this.physics.add.overlap(this.player1, this.fuelGroup, this.collectFuel, null, this);
      this.physics.add.collider(this.player1, this.obstacles, () => this.scene.start('GameOverScene', { result: 'You Crashed!' }), null, this);
  
      if (this.mode === 'two') {
        this.physics.add.overlap(this.player2, this.fuelGroup, this.collectFuel, null, this);
        this.physics.add.collider(this.player2, this.obstacles, () => this.scene.start('GameOverScene', { result: 'Player 2 Crashed!' }), null, this);
      }
    }
  
    spawnFuel() {
      const x = Phaser.Math.Between(100, 700);
      const y = this.player1.y - 400;
      this.fuelGroup.create(x, y, 'fuel');
    }
  
    spawnObstacle() {
      const x = Phaser.Math.Between(100, 700);
      const y = this.player1.y - 500;
      const type = Phaser.Math.Between(0, 1) === 0 ? 'red_car' : 'blue_biker';
      const obs = this.obstacles.create(x, y, type);
      obs.setVelocityY(100);
    }
  
    collectFuel(player, fuel) {
      fuel.destroy();
      this.fuel = 100;
    }
  
    update(time, delta) {
      if (this.paused) return;
  
      if (this.mode === 'single') {
        this.timeLeft -= delta / 1000;
        if (this.timeLeft <= 0) return this.scene.start('GameOverScene', { result: 'Time Up!' });
      }
  
      this.lastFuelDrain += delta;
      if (this.lastFuelDrain >= 450) {
        this.fuel--;
        this.lastFuelDrain = 0;
      }
      if (this.fuel <= 0) return this.scene.start('GameOverScene', { result: 'Out of Fuel!' });
  
      if (this.keys.W.isDown) this.player1.y -= 4;
      if (this.keys.S.isDown) this.player1.y += 4;
      if (this.keys.A.isDown) this.player1.x -= 4;
      if (this.keys.D.isDown) this.player1.x += 4;
  
      if (this.mode === 'two') {
        if (this.cursors.up.isDown) this.player2.y -= 4;
        if (this.cursors.down.isDown) this.player2.y += 4;
        if (this.cursors.left.isDown) this.player2.x -= 4;
        if (this.cursors.right.isDown) this.player2.x += 4;
  
        if (this.player1.y < -200) return this.scene.start('GameOverScene', { result: 'Player 1 Wins!' });
        if (this.player2.y < -200) return this.scene.start('GameOverScene', { result: 'Player 2 Wins!' });
      }
  
      if (this.mode === 'single' && this.player1.y < -200) {
        return this.scene.start('GameOverScene', { result: 'You Win!' });
      }
  
      this.background1.tilePositionY -= 2;
      if (this.mode === 'two') this.background2.tilePositionY -= 2;
  
      const minutes = Math.floor(this.timeLeft / 60);
      const seconds = Math.floor(this.timeLeft % 60).toString().padStart(2, '0');
      this.timerText.setText(`Time: ${minutes}:${seconds}`);
      this.fuelText.setText(`Fuel: ${this.fuel}%`);
    }
  }
  