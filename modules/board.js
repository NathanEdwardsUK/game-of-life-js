import { Cell } from "./cell.js";

export class Board {
  constructor(
    boardHeight,
    boardWidth,
    initialStateArray = [[]], // Array defining starting condition of board
    aliveProbability = 0.1
  ) {
    /*
      - boardHeight/Width defines number of cells in the board.
      - initialStateArray is an array that contains the starting state of the board. 
        It does not have to be the same size as defined by board height, the extra 
        cells will be generated around it or removed from it if necessary.
      - aliveProbability is the probability that any cells created to fill in 
        gaps in the initialStateArray are alive
    */
    this.boardHeight = boardHeight;
    this.boardWidth = boardWidth;
    this.initialStateArray = initialStateArray;
    let resizedInitialStateArray = this.resizeArray(
      initialStateArray,
      boardHeight,
      boardWidth
    );
    this.cells = this.intArrayToCells(
      resizedInitialStateArray,
      aliveProbability
    );
    this.updateCells();
  }

  resizeArray(array, newHeight, newWidth) {
    array = structuredClone(array);
    // First resize array by adding or removing columns and rows. Do this
    // symmetrically such that the start array renders in the middle of the board.
    let rowDiff = newHeight - array.length;
    let colDiff = newWidth - (array[0] ?? []).length;

    // Number of columns and rows to add to the front and back of the
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
          .fill(-1) //
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

  intArrayToCells(array, aliveProbability) {
    // Converts an int array into an array of cells
    let board = new Array(this.boardHeight);

    for (let j = 0; j < this.boardHeight; j++) {
      board[j] = new Array(this.boardWidth);

      for (let i = 0; i < this.boardWidth; i++) {
        let cellState = array[j][i];
        if (cellState == -1) {
          cellState = Number(Math.random() < aliveProbability);
        }
        board[j][i] = new Cell([i, j], cellState);
      }
    }

    return board;
  }

  updateCells() {
    // We must break down in 2 parts; first calculate what the next state
    // will be for each cell
    for (let j = 0; j < this.boardHeight; j++) {
      for (let i = 0; i < this.boardWidth; i++) {
        let cell = this.cells[j][i];
        let countLiveNeighbours = this.countCellLiveNeighbours(i, j);
        cell.calculateNextState(countLiveNeighbours);
      }
    }

    // Then update each cells state
    for (let j = 0; j < this.boardHeight; j++) {
      for (let i = 0; i < this.boardWidth; i++) {
        let cell = this.cells[j][i];
        cell.updateState();
      }
    }
  }

  countCellLiveNeighbours(x, y) {
    let countLiveNeighbours = 0;

    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (i == x && j == y) continue;
        if (i < 0 || i >= this.boardWidth) continue;
        if (j < 0 || j >= this.boardHeight) continue;

        let cell = this.cells[j][i];
        // Enusres neighbours to immortal cells are always dead
        if (cell.getState() == 2) return 0;

        countLiveNeighbours += cell.getState() == 1;
      }
    }

    return countLiveNeighbours;
  }

  getCells() {
    return this.cells;
  }
}
