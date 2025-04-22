import { Board } from "/modules/board.js";
import { WELCOME_MSG_STATE_MIN, SINGLE, GLIDER } from "./patterns.js";

export class Game {
  constructor(canvas, initialAliveProbability, refreshInterval, initialState) {
    this.canvas = canvas;
    this.initialAliveProbability = initialAliveProbability;
    this.refreshInterval = refreshInterval;
    this.initialState = initialState;
    this.resizeTrigger = false;
  }

  handleCanvasClick(event) {
    let cell = this.windowCoordinatesToCell(event.x, event.y);
    let [cellX, cellY] = cell.getCoordinates();
    let newPattern = this.board.intArrayToCells(GLIDER);

    if (typeof newPattern === "undefined") {
      cell.toggleState();
    } else {
      this.board.insertArray(newPattern, cellX, cellY);
    }

    this.canvas.renderBoard(this.board.getCells());
  }

  handleStartButtonClick() {
    if (this.loopIntervalID === undefined) {
      this.start();
    }
  }

  windowCoordinatesToCell(x, y) {
    let cells = this.board.getCells();
    let cellSize = this.canvas.getCellSize();
    let boardX = Math.round(x / cellSize);
    let boardY = Math.round(y / cellSize);
    return cells[boardY][boardX];
  }

  initNewGame() {
    this.canvas.resize();
    let [boardHeight, boardwidth] = this.canvas.calculateBoardSize();
    this.board = new Board(
      boardHeight,
      boardwidth,
      this.initialState,
      this.initialAliveProbability
    );
  }

  run() {
    this.initNewGame();
    this.updateAndRenderBoard();
    this.start();
  }

  // TODO: resize existing board layout
  triggerCanvasResize() {
    this.pause();
    this.run();
  }

  updateAndRenderBoard() {
    this.board.updateCells();
    let cells = this.board.getCells();
    this.canvas.renderBoard(cells);
  }

  updateRefreshInterval(newInterval) {
    this.intervalID = newInterval;
    clearInterval(this.loopIntervalID);
  }

  pause() {
    clearInterval(this.loopIntervalID);
    this.loopIntervalID = undefined;
  }

  start() {
    if (this.loopIntervalID === undefined) {
      this.updateAndRenderBoard();

      this.loopIntervalID = setInterval(() => {
        this.updateAndRenderBoard();
      }, this.refreshInterval);
    }
  }

  clearBoard() {
    this.board.clearCells();
    this.updateAndRenderBoard();
  }
}
