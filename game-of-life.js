const CONFIG = {
  cellSize: 5,
  aliveColor: "rgb(0, 0, 0)",
  deadColor: "rgb(253, 246, 237)",
  refreshInterval: 500,
  initialAliveProbability: 0.15,
};

function renderBoardOnCanvas(board, ctx) {
  for (let j = 0; j < board.length; j++) {
    for (let i = 0; i < board[j].length; i++) {
      ctx.fillStyle = board[j][i] == 1 ? CONFIG.aliveColor : CONFIG.deadColor;
      ctx.fillRect(
        i * CONFIG.cellSize,
        j * CONFIG.cellSize,
        CONFIG.cellSize,
        CONFIG.cellSize
      );
    }
  }
}

class Board {
  constructor(boardHeight, boardWidth, aliveProbability) {
    this.boardHeight = boardHeight;
    this.boardWidth = boardWidth;
    this.currentState = new Array(boardHeight);

    for (let j = 0; j < boardHeight; j++) {
      this.currentState[j] = new Array(boardWidth);
    }

    this.nextState = structuredClone(this.currentState);
    this.fillBoardRandomly(aliveProbability);
    this.calculateNextBoardState();
  }

  fillBoardRandomly(aliveProbability) {
    for (let j = 0; j < this.boardHeight; j++) {
      for (let i = 0; i < this.boardWidth; i++) {
        this.currentState[j][i] = Number(Math.random() < aliveProbability);
      }
    }
  }

  calculateNextBoardState() {
    for (let j = 0; j < this.boardHeight; j++) {
      for (let i = 0; i < this.boardWidth; i++) {
        this.nextState[j][i] = this.calculateNextCellState(i, j);
      }
    }

    // Uncommenting this reference switch creates a different behaviour whereby the board converges to an oscillating maze
    // [this.currentState] = [this.nextState];
    this.currentState = structuredClone(this.nextState);
  }

  calculateNextCellState(x, y) {
    let countLiveNeighbours = 0;
    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (i == x && j == y) continue;
        if (i < 0 || i >= this.boardWidth) continue;
        if (j < 0 || j >= this.boardHeight) continue;

        countLiveNeighbours += this.currentState[j][i] == 1;
      }
    }

    let cellIsAlive = this.currentState[y][x] == 1;

    return (cellIsAlive && countLiveNeighbours == 2) || countLiveNeighbours == 3
      ? 1
      : 0;
  }
}

class Game {
  constructor() {
    this.body = document.querySelector("body");
    this.canvas = document.getElementById("game-canvas");
    this.ctx = this.canvas.getContext("2d");
  }

  resizeCanvas() {
    this.canvas.height = Math.round(this.body.offsetHeight / CONFIG.cellSize) * CONFIG.cellSize;
    this.canvas.width = Math.round(this.body.offsetWidth / CONFIG.cellSize) * CONFIG.cellSize;
  }

  initNewGame() {
    this.resizeCanvas();
    let boardHeight = this.canvas.height / CONFIG.cellSize;
    let boardwidth = this.canvas.width / CONFIG.cellSize;
    this.board = new Board(boardHeight, boardwidth, CONFIG.initialAliveProbability);
  }

  run() {
    this.initNewGame();

    setInterval(() => {
      if (resizedWindow) {
        resizedWindow = false;
        this.initNewGame();
      }

      this.board.calculateNextBoardState();
      renderBoardOnCanvas(this.board.currentState, this.ctx);
    }, CONFIG.refreshInterval);
  }
}


let resizedWindow = false;

function restartGame() {
  resizedWindow = true;
}

window.addEventListener("resize", restartGame);

const game = new Game();
game.run();
