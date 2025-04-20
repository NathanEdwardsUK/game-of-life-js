import { Game } from "/modules/game.js";
import { CONFIG } from "/modules/config.js";

window.addEventListener("resize", restartGame);

const game = new Game(
  CONFIG.cellSize,
  CONFIG.initialAliveProbability,
  CONFIG.refreshInterval,
  CONFIG.initialState
);
game.run();

function restartGame() {
  game.triggerCanvasResize();
}
