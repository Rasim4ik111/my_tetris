const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const COLS = 10;
const ROWS = 20;
const SIZE = 30;

const SHAPES = [
  [[1, 1, 1, 1]], // I
  [
    [1, 1],
    [1, 1],
  ], // O
  [
    [0, 1, 0],
    [1, 1, 1],
  ], // T
  [
    [1, 0, 0],
    [1, 1, 1],
  ], // J
  [
    [0, 0, 1],
    [1, 1, 1],
  ], // L
  [
    [0, 1, 1],
    [1, 1, 0],
  ], // S
  [
    [1, 1, 0],
    [0, 1, 1],
  ], // Z
];

const COLORS = ["#00f", "#ff0", "#f0f", "#0ff", "#f60", "#0f0", "#f00"];

canvas.width = COLS * SIZE;
canvas.height = ROWS * SIZE;

// ❌ Исправлено: создаём по ROWS
const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(-1));

let score = 0;
let piece = randomPiece();

let lastTime = 0;
let dropCounter = 0;
const dropInterval = 500;

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    movePieceDown();
    dropCounter = 0;
  }

  draw();
  requestAnimationFrame(update);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawPiece(piece);

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);
}

function drawGrid() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      ctx.fillStyle = grid[row][col] === -1 ? "#111" : grid[row][col];
      ctx.fillRect(col * SIZE, row * SIZE, SIZE, SIZE);
      ctx.strokeStyle = "#222";
      ctx.strokeRect(col * SIZE, row * SIZE, SIZE, SIZE);
    }
  }
}

function drawPiece(p) {
  const { shape, x, y, color } = p;
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] === 1) {
        ctx.fillStyle = color;
        ctx.fillRect((x + col) * SIZE, (y + row) * SIZE, SIZE, SIZE);
        ctx.strokeStyle = "#222";
        ctx.strokeRect((x + col) * SIZE, (y + row) * SIZE, SIZE, SIZE);
      }
    }
  }
}

function canMoveDown(p) {
  const { shape, x, y } = p;
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] === 1) {
        if (y + row + 1 >= ROWS) return false;
        if (grid[y + row + 1][x + col] !== -1) return false;
      }
    }
  }
  return true;
}

function movePieceDown() {
  if (canMoveDown(piece)) {
    piece.y++;
  } else {
    fixPiece();
    piece = randomPiece();
  }
}

function fixPiece() {
  const { shape, x, y, color } = piece;
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] === 1) grid[y + row][x + col] = color;
    }
  }
  const cleared = clearLines();
  if (cleared === 1) score += 100;
  if (cleared === 2) score += 300;
  if (cleared === 3) score += 500;
  if (cleared === 4) score += 800;
}

function clearLines() {
  let cleared = 0;
  for (let row = ROWS - 1; row >= 0; row--) {
    if (grid[row].every((cell) => cell !== -1)) {
      grid.splice(row, 1);
      grid.unshift(Array(COLS).fill(-1));
      cleared++;
      row++; // проверяем новую строку на этом же индексе
    }
  }
  return cleared;
}

function randomPiece() {
  const index = Math.floor(Math.random() * SHAPES.length);
  return {
    shape: SHAPES[index].map((row) => [...row]),
    x: 3,
    y: 0,
    color: COLORS[index],
  };
}

// обработка клавиш
document.body.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" && canMove(piece, "left")) piece.x--;
  if (event.key === "ArrowRight" && canMove(piece, "right")) piece.x++;
  if (event.key === "ArrowDown") movePieceDown();
  if (event.key === "ArrowUp") {
    const newShape = rotatePiece(piece);
    if (canRotate(piece, newShape)) piece.shape = newShape;
  }
});

function canMove(p, dir) {
  const { shape, x, y } = p;
  let offsetX = dir === "left" ? -1 : dir === "right" ? 1 : 0;
  for (let row = 0; row < shape.length; row++)
    for (let col = 0; col < shape[row].length; col++)
      if (shape[row][col] === 1) {
        const newX = x + col + offsetX;
        if (newX < 0 || newX >= COLS) return false;
        if (grid[y + row][newX] !== -1) return false;
      }
  return true;
}

function rotatePiece(p) {
  const newShape = [];
  const H = p.shape.length;
  for (let r = 0; r < H; r++)
    for (let c = 0; c < p.shape[r].length; c++) {
      if (!newShape[c]) newShape[c] = [];
      newShape[c][H - 1 - r] = p.shape[r][c];
    }
  return newShape;
}

function canRotate(p, newShape) {
  const { x, y } = p;
  for (let row = 0; row < newShape.length; row++)
    for (let col = 0; col < newShape[row].length; col++)
      if (newShape[row][col] === 1) {
        const newX = x + col;
        const newY = y + row;
        if (newX < 0 || newX >= COLS || newY >= ROWS) return false;
        if (grid[newY][newX] !== -1) return false;
      }
  return true;
}

update();
