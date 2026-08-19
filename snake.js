'use strict';

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const scoreOutput = document.getElementById('score');
const statusOutput = document.getElementById('status');
const restartButton = document.getElementById('restart');
const core = globalThis.SnakeCore;

if (!core) {
  throw new Error('SnakeCore must be loaded before snake.js');
}

const gridSize = 20;
const tileCount = canvas.width / gridSize;
const tickMilliseconds = 100;
const directions = new Map([
  ['ArrowUp', { x: 0, y: -1 }],
  ['w', { x: 0, y: -1 }],
  ['ArrowDown', { x: 0, y: 1 }],
  ['s', { x: 0, y: 1 }],
  ['ArrowLeft', { x: -1, y: 0 }],
  ['a', { x: -1, y: 0 }],
  ['ArrowRight', { x: 1, y: 0 }],
  ['d', { x: 1, y: 0 }]
]);

let game = core.createInitialState({ tileCount });

function statusMessage(status) {
  switch (status) {
    case 'running':
      return 'Game in progress.';
    case 'game-over':
      return 'Game over. Press Enter or use Restart game.';
    case 'won':
      return 'Board cleared. Press Enter or use Restart game.';
    default:
      return 'Press an arrow key or WASD to start.';
  }
}

function draw() {
  context.fillStyle = '#03020a';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = '#39ff88';
  game.snake.forEach((part) => {
    context.fillRect(
      part.x * gridSize,
      part.y * gridSize,
      gridSize - 1,
      gridSize - 1
    );
  });

  if (game.food) {
    context.fillStyle = '#ff3cac';
    context.fillRect(
      game.food.x * gridSize,
      game.food.y * gridSize,
      gridSize - 1,
      gridSize - 1
    );
  }

  scoreOutput.value = game.score;
  statusOutput.textContent = statusMessage(game.status);
}

function restart() {
  game = core.createInitialState({ tileCount });
  draw();
  canvas.focus();
}

function handleKeydown(event) {
  if (event.key === 'Enter' && ['game-over', 'won'].includes(game.status)) {
    event.preventDefault();
    restart();
    return;
  }

  const direction = directions.get(event.key) || directions.get(event.key.toLowerCase());
  if (!direction) {
    return;
  }

  event.preventDefault();
  game = core.queueDirection(game, direction);
  draw();
}

function tick() {
  game = core.advance(game);
  draw();
}

document.addEventListener('keydown', handleKeydown);
restartButton.addEventListener('click', restart);
setInterval(tick, tickMilliseconds);
draw();
