import { Canvas } from "/modules/canvas.js";
import { Game } from "/modules/game.js";
import { CONFIG } from "/modules/config.js";
import { PATTERNS } from "./modules/patterns.js";

let htmlBody = document.querySelector("body");
let htmlCanvas = document.getElementById("game-canvas");
let runButton = document.getElementById("run-button");
let stopButton = document.getElementById("stop-button");
let clearButton = document.getElementById("clear-button");

let patternDropdown = document.getElementById("pattern-dropdown");
for (const pattern in PATTERNS) {
  patternDropdown.options.add(new Option(pattern, pattern));
}

const canvas = new Canvas(
  htmlBody,
  htmlCanvas,
  CONFIG.cellSize,
  CONFIG.aliveColor,
  CONFIG.deadColor
);

const game = new Game(
  canvas,
  CONFIG.initialAliveProbability,
  CONFIG.refreshInterval,
  CONFIG.initialState
);

window.addEventListener("resize", () => {
  game.triggerCanvasResize();
});

htmlCanvas.addEventListener("click", (event) => {
  game.handleCanvasClick(event);
});

runButton.addEventListener("click", (event) => {
  game.handleStartButtonClick();
});

stopButton.addEventListener("click", (event) => {
  game.pause();
});

clearButton.addEventListener("click", (event) => {
  game.clearBoard();
});

patternDropdown.addEventListener("change", (event) => {
  game.changeSelectedPattern(patternDropdown.value);
});

// var div = document.querySelector("#pattern-button-container"),
//   frag = document.createDocumentFragment(),
//   select = document.createElement("select");

// select.options.add(new Option("Method1", "AU", true, true));
// select.options.add(new Option("Method2", "FI"));

// frag.appendChild(select);
// div.appendChild(frag);

game.run();
