import { Board } from "/modules/board.js";
import { CONFIG } from "/modules/config.js";

export class Game {
  constructor(
    cellSize,
    initialAliveProbability,
    refreshInterval,
    initialState
  ) {
    this.body = document.querySelector("body");
    this.canvas = document.getElementById("game-canvas");
    this.ctx = this.canvas.getContext("2d");

    this.cellSize = cellSize;
    this.initialAliveProbability = initialAliveProbability;
    this.refreshInterval = refreshInterval;
    this.initialState = initialState;
    this.resizeTrigger = false;
  }

  resizeCanvas() {
    this.canvas.height =
      Math.round(this.body.offsetHeight / this.cellSize) * this.cellSize;
    this.canvas.width =
      Math.round(this.body.offsetWidth / this.cellSize) * this.cellSize;
  }

  initNewGame() {
    this.resizeCanvas();
    let boardHeight = this.canvas.height / this.cellSize;
    let boardwidth = this.canvas.width / this.cellSize;
    this.board = new Board(
      boardHeight,
      boardwidth,
      this.initialState,
      this.initialAliveProbability
    );
  }

  run() {
    this.initNewGame();

    setInterval(() => {
      if (this.resizeTrigger) {
        this.resizeTrigger = false;
        this.initNewGame();
      }

      this.board.updateCells();
      renderBoardOnCanvas(this.board.getCells(), this.ctx);
    }, this.refreshInterval);
  }

  triggerCanvasResize() {
    this.resizeTrigger = true;
  }
}

function renderBoardOnCanvas(cells, ctx) {
  for (let j = 0; j < cells.length; j++) {
    for (let i = 0; i < cells[j].length; i++) {
      let cell = cells[j][i];
      ctx.fillStyle =
        cell.getState() == 0 ? CONFIG.deadColor : CONFIG.aliveColor;
      ctx.fillRect(
        i * CONFIG.cellSize,
        j * CONFIG.cellSize,
        CONFIG.cellSize,
        CONFIG.cellSize
      );
    }
  }
}
