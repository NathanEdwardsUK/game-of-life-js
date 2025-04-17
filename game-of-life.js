// const config = {
//   cellSize: 5,
//   aliveColor: "black",
//   refreshInterval: 100,
//   initialAliveProbability: 0.1,
// };

// function fillArrayRandomly(array, aliveProbability = 0.5) {
//   for (let j = 0; j < array.length; j++) {
//     for (let i = 0; i < array[j].length; i++) {
//       array[j][i] = Math.random() < aliveProbability ? 1 : 0;
//     }
//   }

//   return array;
// }

// function renderBoardOnCanvas(board, canvas) {
//   ctx = canvas.getContext();
//   deadColor = canvas.style.backgroundColor;

//   for (let j = 0; j < board.length; j++) {
//     for (let i = 0; i < board[j].length; i++) {
//       ctx.fillStyle = board[j][i] == 1 ? config.aliveColor : deadColor;
//       ctx.fillRect(
//         i * config.cellSize,
//         j * config.cellSize,
//         config.cellSize,
//         config.cellSize
//       );
//     }
//   }
// }

// function calculateNextCellState(board, x, y) {
//   let countLiveNeighbours = 0;
//   for (let i = x - 1; i <= x + 1; i++) {
//     for (let j = y - 1; j <= y + 1; j++) {
//       if (i == x && j == y) continue;
//       if (i < 0 || i >= board[0].length) continue;
//       if (j < 0 || j >= board.length) continue;

//       countLiveNeighbours += board[j][i] == 1;
//     }
//   }

//   let cellIsAlive = board[y][x] == 1;

//   if ((cellIsAlive && countLiveNeighbours == 2) || countLiveNeighbours == 3) {
//     return 1;
//   } else {
//     return 0;
//   }
// }

// function calculateNextBoard(board) {
//   let boardHeight = board.length;
//   let boardWidth = board[0].length;

//   let nextBoard = new Array(boardHeight);
//   for (let j = 0; j < boardHeight; j++) {
//     nextBoard[j] = new Array(boardWidth);

//     for (let i = 0; i < boardWidth; i++) {
//       nextBoard[j][i] = calculateNextCellState(board, i, j);
//     }
//   }

//   return nextBoard;
// }

// function playGame() {
//   const gameContainer = document.getElementById("game-container");
//   const canvas = document.getElementById("game-canvas");
//   const ctx = canvas.getContext("2d");

//   canvas.height =
//     Math.round((gameContainer.offsetHeight * 0.8) / config.cellSize) *
//     config.cellSize;
//   canvas.width =
//     Math.round((gameContainer.offsetWidth * 0.8) / config.cellSize) *
//     config.cellSize;

//   let board = new Array(canvas.height / config.cellSize);

//   for (let j = 0; j < board.length; j++) {
//     board[j] = new Array(canvas.width).fill(0);
//   }

//   board = fillArrayRandomly(board, config.initialAliveProbability);
//   renderBoardOnCanvas(board, ctx);

//   timestamp = Date.now();
//   setInterval(() => {
//     board = calculateNextBoard(board);
//     renderBoardOnCanvas(board, ctx);
//   }, config.refreshInterval);
// }

// playGame();

const config = {
  cellSize: 5,
  aliveColor: "rgb(0, 0, 0)",
  deadColor: "rgb(253, 246, 237)",
  refreshInterval: 500,
  initialAliveProbability: 0.1,
};

let resizedWindow = false;

function fillArrayRandomly(array, aliveProbability = 0.5) {
  for (let j = 0; j < array.length; j++) {
    for (let i = 0; i < array[j].length; i++) {
      array[j][i] = Math.random() < aliveProbability ? 1 : 0;
    }
  }

  return array;
}

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

function calculateNextCellState(board, x, y) {
  let countLiveNeighbours = 0;
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      if (i == x && j == y) continue;
      if (i < 0 || i >= board[0].length) continue;
      if (j < 0 || j >= board.length) continue;

      countLiveNeighbours += board[j][i] == 1;
    }
  }

  let cellIsAlive = board[y][x] == 1;

  if ((cellIsAlive && countLiveNeighbours == 2) || countLiveNeighbours == 3) {
    return 1;
  } else {
    return 0;
  }
}

function calculateNextBoard(board) {
  let boardHeight = board.length;
  let boardWidth = board[0].length;

  let nextBoard = new Array(boardHeight);
  for (let j = 0; j < boardHeight; j++) {
    nextBoard[j] = new Array(boardWidth);

    for (let i = 0; i < boardWidth; i++) {
      nextBoard[j][i] = calculateNextCellState(board, i, j);
    }
  }

  return nextBoard;
}

function playGame() {
  const body = document.querySelector("body");
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");

  canvas.height =
    Math.round(body.offsetHeight / config.cellSize) * config.cellSize;
  canvas.width =
    Math.round(body.offsetWidth / config.cellSize) * config.cellSize;

  let board = new Array(canvas.height / config.cellSize);

  for (let j = 0; j < board.length; j++) {
    board[j] = new Array(canvas.width / config.cellSize).fill(0);
  }

  board = fillArrayRandomly(board, config.initialAliveProbability);
  board = calculateNextBoard(board);
  board = calculateNextBoard(board);
  renderBoardOnCanvas(board, canvas);

  timestamp = Date.now();
  setInterval(() => {
    if (resizedWindow) {
      resizedWindow = false;
      canvas.height =
        Math.round(body.offsetHeight / config.cellSize) * config.cellSize;
      canvas.width =
        Math.round(body.offsetWidth / config.cellSize) * config.cellSize;

      board = new Array(canvas.height / config.cellSize);

      for (let j = 0; j < board.length; j++) {
        board[j] = new Array(canvas.width / config.cellSize).fill(0);
      }

      board = fillArrayRandomly(board, config.initialAliveProbability);
      board = calculateNextBoard(board);
    }

    board = calculateNextBoard(board);
    renderBoardOnCanvas(board, canvas);
  }, config.refreshInterval);
}

function restartGame() {
  resizedWindow = true;
}
window.addEventListener("resize", restartGame);

playGame();
