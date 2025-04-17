const CONFIG = {
  cellSize: 5,
  aliveColor: "rgb(0, 0, 0)",
  deadColor: "rgb(253, 246, 237)",
  refreshInterval: 500,
  initialAliveProbability: 0.15,
  initialState: [
    [2, -1, -1, -1, 2, -1, -1, -1, -1, -1, -1, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2],
    [2, -1, -1, -1, 2, -1, -1, -1, -1, -1, -1, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2],
    [2, -1, -1, -1, 2, -1, -1, 2, 2, 2, -1, 2, -1, -1, 2, 2, 2, -1, -1, -1, 2, 2, 2, -1, -1, 2, 2, 2, -1, 2, 2, -1, -1, -1, 2, 2, 2, -1, 2],
    [2, -1, -1, -1, 2, -1, 2, -1, -1, 2, -1, 2, -1, 2, -1, -1, -1, 2, -1, 2, -1, -1, -1, 2, -1, 2, -1, -1, 2, -1, -1, 2, -1, 2, -1, -1, 2, -1, 2],
    [2, -1, -1, -1, 2, -1, 2, 2, 2, -1, -1, 2, -1, 2, -1, -1, -1, -1, -1, 2, -1, -1, -1, 2, -1, 2, -1, -1, 2, -1, -1, 2, -1, 2, 2, 2, -1, -1, 2],
    [2, -1, 2, -1, 2, -1, 2, -1, -1, -1, -1, 2, -1, 2, -1, -1, -1, -1, -1, 2, -1, -1, -1, 2, -1, 2, -1, -1, 2, -1, -1, 2, -1, 2, -1, -1, -1, -1, 2],
    [2, 2, -1, 2, 2, -1, 2, -1, -1, 2, -1, 2, -1, 2, -1, -1, -1, 2, -1, 2, -1, -1, -1, 2, -1, 2, -1, -1, 2, -1, -1, 2, -1, 2, -1, -1, 2, -1, -1],
    [2, -1, -1, -1, 2, -1, -1, 2, 2, 2, -1, 2, -1, -1, 2, 2, 2, -1, -1, -1, 2, 2, 2, -1, -1, 2, -1, -1, 2, -1, -1, 2, -1, -1, 2, 2, 2, -1, 2],
  ]
};

function renderBoardOnCanvas(board, ctx) {
  for (let j = 0; j < board.length; j++) {
    for (let i = 0; i < board[j].length; i++) {
      ctx.fillStyle = board[j][i] == 0 ? CONFIG.deadColor : CONFIG.aliveColor;
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
  constructor(
    boardHeight,
    boardWidth,
    initialState = [[]],
    aliveProbability = 0.1
  ) {
    /*
      - boardHeight/Width defines number of cells in the board.
      - initialState is an array that contains the starting state of the board. 
        It does not have to be the same size as defined by board height, the extra 
        cells will be generated around it or removed from it if necessary.
      - aliveProbability is the probability that any cells created to fill in 
        gaps in the initialState are alive
    */
    this.boardHeight = boardHeight;
    this.boardWidth = boardWidth;
    this.initialState = initialState;
    this.currentState = this.resizeArray(initialState, boardHeight, boardWidth);
    this.nextState = structuredClone(this.currentState);
    this.fillBoardRandomly(aliveProbability);
    this.calculateNextBoardState(this.currentState);
  }

  resizeArray(array, newHeight, newWidth) {
    array = structuredClone(array);
    // Resize a starting array by adding or removing columns and rows. Do this
    // symmetrically such that the start array is in the middle of the end array.
    let rowDiff = newHeight - array.length;
    let colDiff = newWidth - (array[0] ?? []).length;

    // How many columns and rows to add to the front and back of the
    // initial array so that it matches our desired size.
    let frontColDiff = Math.round(colDiff / 2);
    let backColDiff = colDiff - frontColDiff;

    let frontRowDiff = Math.round(rowDiff / 2);
    let backRowDiff = rowDiff - frontRowDiff;

    // console.log("front col diff: " + frontColDiff + " back:" + backColDiff);
    // console.log("front row diff: " + frontRowDiff + " back:" + backRowDiff);
    // console.table(array);

    // Adjust number of columns
    if (colDiff > 0) {
      for (let j = 0; j < array.length; j++) {
        array[j] = new Array(frontColDiff)
          .fill(-1)
          .concat(array[j])
          .concat(new Array(backColDiff).fill(-1));
      }
    } else if (colDiff < 0) {
      for (let j = 0; j < array.length; j++) {
        array[j] = array[j].slice(-frontColDiff, array[j].length + backColDiff);
      }
    }

    // Adjust number of rows
    if (rowDiff > 0) {
      for (let j = 0; j < frontRowDiff; j++) {
        array = [new Array(newWidth).fill(-1)].concat(array);
      }
      for (let j = 0; j < backRowDiff; j++) {
        array = array.concat([new Array(newWidth).fill(-1)]);
      }
    } else if (rowDiff < 0) {
      array = array.slice(-frontRowDiff, array.length + backRowDiff);
    }

    return array;
  }

  fillBoardRandomly(aliveProbability) {
    for (let j = 0; j < this.boardHeight; j++) {
      for (let i = 0; i < this.boardWidth; i++) {
        if (this.currentState[j][i] == -1) {
          this.currentState[j][i] = Number(Math.random() < aliveProbability);
        }
      }
    }
  }

  calculateNextBoardState() {
    for (let j = 0; j < this.boardHeight; j++) {
      for (let i = 0; i < this.boardWidth; i++) {
        this.nextState[j][i] = this.calculateNextCellState(i, j);
      }
    }

    // Uncommenting below line creates a different, interesting,
    // behaviour whereby the board converges to an oscillating maze
    // [this.currentState] = [this.nextState];
    this.currentState = structuredClone(this.nextState);
  }

  calculateNextCellState(x, y) {
    /*
    In this small variation of Game of Life I have 3 states
    0 = dead cell
    1 = alive cell
    2 = immortal cell (alive and will never die)

    Rules:
    - No cell can be alive next to an immortal cell
    - If an alive cell has 2 or 3 alive neighbours it stays alive, otherwise death.
    - If a dead cell has exactly 3 alive neighbours it will come to life
    - Immortal cells always live
    */

    if (this.currentState[y][x] == 2) return 2;

    let countLiveNeighbours = 0;
    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (i == x && j == y) continue;
        if (i < 0 || i >= this.boardWidth) continue;
        if (j < 0 || j >= this.boardHeight) continue;

        if (this.currentState[j][i] == 2) return 0;

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
    this.canvas.height =
      Math.round(this.body.offsetHeight / CONFIG.cellSize) * CONFIG.cellSize;
    this.canvas.width =
      Math.round(this.body.offsetWidth / CONFIG.cellSize) * CONFIG.cellSize;
  }

  initNewGame() {
    this.resizeCanvas();
    let boardHeight = this.canvas.height / CONFIG.cellSize;
    let boardwidth = this.canvas.width / CONFIG.cellSize;
    this.board = new Board(
      boardHeight,
      boardwidth,
      CONFIG.initialState,
      // [
      //   [2, 2, 2, 2, 2, 2],
      //   [2, 2, 2, 2, 2, 2],
      //   [2, 2, 2, 2, 2, 2],
      //   [2, 2, 2, 2, 2, 2],
      //   [2, 2, 2, 2, 2, 2],
      //   [2, 2, 2, 2, 2, 2],
      // ],
      CONFIG.initialAliveProbability
    );
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