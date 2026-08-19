# Retro Neon Snake

A compact Snake game built with plain JavaScript and the HTML Canvas API. The project is intentionally dependency-free and focuses on a small, readable game loop wrapped in a 1980s-inspired neon interface.

## What it includes

- Grid-based movement and collision detection
- Food placement that never overlaps the snake
- Live score and game-state feedback
- Keyboard input buffering to prevent accidental instant reversals
- Restart support without reloading the page
- A dependency-free test suite for the game rules

## Controls

| Action | Keys |
| --- | --- |
| Move | Arrow keys or `W`, `A`, `S`, `D` |
| Restart after a game | `Enter` |
| Restart at any time | **Restart game** button |

## Run locally

No build step is required. Serve the directory with any static web server:

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

## Test

The tests use Node.js's built-in test runner, so there are no packages to install. Node.js 20 or newer is recommended.

```bash
node --check game-core.js
node --check snake.js
node --test tests/*.test.js
```

## Architecture

- `game-core.js` contains the deterministic game rules and has no browser dependencies.
- `snake.js` connects keyboard events, the interval loop, score/status updates, and Canvas rendering.
- `index.html` provides the accessible page structure and HUD.
- `style.css` defines the responsive retro-neon presentation.
- `tests/game-core.test.js` exercises food placement, scoring, collisions, input buffering, and reset behavior.

## Current limitations

This is a small browser demo rather than a full game engine. It supports keyboard input only, uses a fixed 20 × 20 board and fixed update speed, and does not persist scores. It also has no audio, touch controls, difficulty settings, or cross-browser end-to-end test suite.
