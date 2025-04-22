export class Cell {
  constructor(coordinates, state) {
    this.coordinates = coordinates;
    this.state = state;
    this.nextState = state;
  }

  getCoordinates() {
    return this.coordinates;
  }

  getState() {
    return this.state;
  }

  setState(state) {
    this.state = state;
  }

  toggleState() {
    if (this.state === 1) {
      this.state = 0;
    } else if (this.state === 0) {
      this.state = 1;
    }
  }

  updateState() {
    this.state = this.nextState;
  }

  calculateNextState(countLiveNeighbours) {
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
    if (this.state == 2) {
      this.nextState = 2;
    } else if (this.state == 1 && countLiveNeighbours == 2) {
      this.nextState = 1;
    } else if (countLiveNeighbours == 3) {
      this.nextState = 1;
    } else {
      this.nextState = 0;
    }
  }
}
