'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const {
  advance,
  createInitialState,
  queueDirection,
  spawnFood
} = require('../game-core.js');

test('food is selected only from unoccupied tiles', () => {
  const snake = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }];
  assert.deepEqual(spawnFood(2, snake, () => 0), { x: 1, y: 1 });
  assert.equal(spawnFood(1, [{ x: 0, y: 0 }], () => 0), null);
});

test('eating food grows the snake and increments the score', () => {
  const state = {
    tileCount: 4,
    snake: [{ x: 1, y: 1 }],
    direction: { x: 1, y: 0 },
    pendingDirection: null,
    food: { x: 2, y: 1 },
    score: 0,
    status: 'running'
  };

  const next = advance(state, () => 0);
  assert.equal(next.score, 1);
  assert.equal(next.snake.length, 2);
  assert.ok(!next.snake.some((part) => part.x === next.food.x && part.y === next.food.y));
});

test('wall collisions end the game without moving the snake outside the board', () => {
  const state = {
    tileCount: 3,
    snake: [{ x: 2, y: 1 }],
    direction: { x: 1, y: 0 },
    pendingDirection: null,
    food: { x: 0, y: 0 },
    score: 4,
    status: 'running'
  };

  const next = advance(state);
  assert.equal(next.status, 'game-over');
  assert.deepEqual(next.snake, state.snake);
  assert.equal(next.score, 4);
});

test('only one valid direction change is accepted per tick', () => {
  const state = {
    ...createInitialState({ tileCount: 5, random: () => 0 }),
    direction: { x: 1, y: 0 },
    status: 'running'
  };

  const reverse = queueDirection(state, { x: -1, y: 0 });
  assert.strictEqual(reverse, state);

  const turn = queueDirection(state, { x: 0, y: -1 });
  const secondTurn = queueDirection(turn, { x: -1, y: 0 });
  assert.deepEqual(secondTurn.pendingDirection, { x: 0, y: -1 });
});

test('creating a new state resets score and status', () => {
  const state = createInitialState({ tileCount: 6, random: () => 0 });
  assert.equal(state.score, 0);
  assert.equal(state.status, 'ready');
  assert.ok(!state.snake.some((part) => part.x === state.food.x && part.y === state.food.y));
});

test('the page exposes the score, status, canvas, and restart controls', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  for (const id of ['score', 'status', 'game', 'restart']) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
});
