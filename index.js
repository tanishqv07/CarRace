const menu = document.getElementById('menu');
const gameContainer = document.getElementById('gameContainer');
const player1Canvas = document.getElementById('player1Canvas');
const player2Canvas = document.getElementById('player2Canvas');
const gameOverScreen = document.getElementById('gameOver');
const gameMessage = document.getElementById('gameMessage');
const timerEl = document.getElementById('timer');

let gameMode = 1;
let player1 = { x: 100, y: 400 };
let player2 = { x: 100, y: 400 };
let keys = {};
let finishLine = 50;
let timer = 60;
let gameRunning = false;

function startGame(mode) {
  gameMode = mode;
  menu.classList.add('hidden');
  gameContainer.classList.remove('hidden');

  if (gameMode === 2) {
    player2Canvas.classList.remove('hidden');
  } else {
    timerEl.classList.remove('hidden');
    startCountdown();
  }

  initCanvas();
  gameRunning = true;
  requestAnimationFrame(gameLoop);
}

function initCanvas() {
  player1Canvas.width = window.innerWidth / (gameMode === 2 ? 2 : 1);
  player1Canvas.height = window.innerHeight;

  if (gameMode === 2) {
    player2Canvas.width = window.innerWidth / 2;
    player2Canvas.height = window.innerHeight;
  }
}

function drawPlayer(ctx, player, color) {
  ctx.fillStyle = color;
  ctx.fillRect(player.x, player.y, 40, 60);
}

function drawFinishLine(ctx) {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, finishLine, ctx.canvas.width, 5);
}

function updatePlayers() {
  if (keys['ArrowUp']) player1.y -= 5;
  if (keys['ArrowDown']) player1.y += 5;

  if (gameMode === 2) {
    if (keys['w']) player2.y -= 5;
    if (keys['s']) player2.y += 5;
  }
}

function checkFinish() {
  if (player1.y <= finishLine) endGame("Player 1 Wins!");
  if (gameMode === 2 && player2.y <= finishLine) endGame("Player 2 Wins!");
}

function endGame(message) {
  gameRunning = false;
  gameOverScreen.classList.remove('hidden');
  gameMessage.textContent = message;
}

function gameLoop() {
  if (!gameRunning) return;

  updatePlayers();

  const ctx1 = player1Canvas.getContext('2d');
  ctx1.clearRect(0, 0, player1Canvas.width, player1Canvas.height);
  drawFinishLine(ctx1);
  drawPlayer(ctx1, player1, 'red');

  if (gameMode === 2) {
    const ctx2 = player2Canvas.getContext('2d');
    ctx2.clearRect(0, 0, player2Canvas.width, player2Canvas.height);
    drawFinishLine(ctx2);
    drawPlayer(ctx2, player2, 'blue');
  }

  checkFinish();

  requestAnimationFrame(gameLoop);
}

function startCountdown() {
  const interval = setInterval(() => {
    if (!gameRunning) {
      clearInterval(interval);
      return;
    }
    timer--;
    timerEl.textContent = timer;
    if (timer <= 0) {
      clearInterval(interval);
      if (player1.y > finishLine) endGame("Time's up! You lose!");
    }
  }, 1000);
}

document.addEventListener('keydown', (e) => {
  keys[e.key] = true;

  if (e.key === 'Enter' && !gameRunning) {
    location.reload();
  }
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});
