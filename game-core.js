(function exposeSnakeCore(root, factory) {
  const api = factory();

  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }

  if (root) {
    root.SnakeCore = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function createSnakeCore() {
  'use strict';

  function samePosition(left, right) {
    return left.x === right.x && left.y === right.y;
  }

  function spawnFood(tileCount, snake, random = Math.random) {
    const availableTiles = [];

    for (let y = 0; y < tileCount; y += 1) {
      for (let x = 0; x < tileCount; x += 1) {
        if (!snake.some((part) => part.x === x && part.y === y)) {
          availableTiles.push({ x, y });
        }
      }
    }

    if (availableTiles.length === 0) {
      return null;
    }

    const index = Math.min(
      Math.floor(random() * availableTiles.length),
      availableTiles.length - 1
    );
    return availableTiles[index];
  }

  function createInitialState({ tileCount = 20, random = Math.random } = {}) {
    if (!Number.isInteger(tileCount) || tileCount < 2) {
      throw new RangeError('tileCount must be an integer greater than one');
    }

    const snake = [{
      x: Math.floor(tileCount / 2),
      y: Math.floor(tileCount / 2)
    }];

    return {
      tileCount,
      snake,
      direction: { x: 0, y: 0 },
      pendingDirection: null,
      food: spawnFood(tileCount, snake, random),
      score: 0,
      status: 'ready'
    };
  }

  function isValidDirection(direction) {
    return direction
      && Number.isInteger(direction.x)
      && Number.isInteger(direction.y)
      && Math.abs(direction.x) + Math.abs(direction.y) === 1;
  }

  function queueDirection(state, nextDirection) {
    if (!isValidDirection(nextDirection)
      || state.pendingDirection
      || state.status === 'game-over'
      || state.status === 'won') {
      return state;
    }

    const isReverse = state.direction.x + nextDirection.x === 0
      && state.direction.y + nextDirection.y === 0
      && (state.direction.x !== 0 || state.direction.y !== 0);

    if (isReverse) {
      return state;
    }

    return {
      ...state,
      pendingDirection: { ...nextDirection },
      status: state.status === 'ready' ? 'running' : state.status
    };
  }

  function advance(state, random = Math.random) {
    const direction = state.pendingDirection || state.direction;
    const isMoving = direction.x !== 0 || direction.y !== 0;

    if (!isMoving || state.status === 'game-over' || state.status === 'won') {
      return state;
    }

    const head = {
      x: state.snake[0].x + direction.x,
      y: state.snake[0].y + direction.y
    };
    const outsideBoard = head.x < 0
      || head.x >= state.tileCount
      || head.y < 0
      || head.y >= state.tileCount;

    if (outsideBoard) {
      return {
        ...state,
        direction,
        pendingDirection: null,
        status: 'game-over'
      };
    }

    const ateFood = state.food !== null && samePosition(head, state.food);
    const collisionBody = ateFood ? state.snake : state.snake.slice(0, -1);
    const hitSnake = collisionBody.some((part) => samePosition(part, head));

    if (hitSnake) {
      return {
        ...state,
        direction,
        pendingDirection: null,
        status: 'game-over'
      };
    }

    const snake = [head, ...state.snake];
    if (!ateFood) {
      snake.pop();
    }

    const food = ateFood ? spawnFood(state.tileCount, snake, random) : state.food;

    return {
      ...state,
      snake,
      direction,
      pendingDirection: null,
      food,
      score: state.score + (ateFood ? 1 : 0),
      status: food === null ? 'won' : 'running'
    };
  }

  return {
    advance,
    createInitialState,
    queueDirection,
    samePosition,
    spawnFood
  };
});
