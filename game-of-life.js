const config = {
  cellSize: 5,
  aliveColor: "rgb(0, 0, 0)",
  deadColor: "rgb(253, 246, 237)",
  refreshInterval: 500,
  initialAliveProbability: 0.1,
};

let resizedWindow = false;

function renderBoardOnCanvas(board, canvas) {
  let ctx = canvas.getContext("2d");

  for (let j = 0; j < board.length; j++) {
    for (let i = 0; i < board[j].length; i++) {
      ctx.fillStyle = board[j][i] == 1 ? config.aliveColor : config.deadColor;
      ctx.fillRect(
        i * config.cellSize,
        j * config.cellSize,
        config.cellSize,
        config.cellSize
      );
    }
  }
}

function restartGame() {
  resizedWindow = true;
}
window.addEventListener("resize", restartGame);

class Board {
  initNewBoard(boardHeight, boardWidth) {
    this.boardHeight = boardHeight;
    this.boardWidth = boardWidth;
    this.currentState = new Array(boardHeight);

    for (let j = 0; j < boardHeight; j++) {
      this.currentState[j] = new Array(boardWidth);
    }

    this.nextState = structuredClone(this.currentState);
  }

  fillBoardRandomly(aliveProbability = 0.5) {
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

function playGame2() {
  const body = document.querySelector("body");
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");

  canvas.height =
    Math.round(body.offsetHeight / config.cellSize) * config.cellSize;
  canvas.width =
    Math.round(body.offsetWidth / config.cellSize) * config.cellSize;

  let board = new Board();

  board.initNewBoard(
    canvas.height / config.cellSize,
    canvas.width / config.cellSize
  );
  board.fillBoardRandomly(config.initialAliveProbability);
  board.calculateNextBoardState();
  renderBoardOnCanvas(board.currentState, canvas);

  setInterval(() => {
    if (resizedWindow) {
      resizedWindow = false;
      canvas.height =
        Math.round(body.offsetHeight / config.cellSize) * config.cellSize;
      canvas.width =
        Math.round(body.offsetWidth / config.cellSize) * config.cellSize;

      board.initNewBoard(
        canvas.height / config.cellSize,
        canvas.width / config.cellSize
      );
      board.fillBoardRandomly(config.initialAliveProbability);
    }

    board.calculateNextBoardState();
    renderBoardOnCanvas(board.currentState, canvas);
  }, config.refreshInterval);
}

playGame2();
