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

const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(-1));

let linesCleared = 0;
let score = 0;

let piece = randomPiece();

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid(grid);
  drawPiece(piece);

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);
}

update();

function drawGrid(grid) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] == -1) {
        ctx.fillStyle = "#111";
      } else {
        ctx.fillStyle = grid[i][j];
      }
      ctx.fillRect(j * SIZE, i * SIZE, SIZE, SIZE);
      ctx.strokeStyle = "#222";
      ctx.strokeRect(j * SIZE, i * SIZE, SIZE, SIZE);
    }
  }
}

function drawPiece(piece) {
  const { shape, x, y, color } = piece;

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

function canMove(piece, grid, direction) {
  const { shape, x, y } = piece;

  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] === 1) {
        let newX = x + col;
        if (direction === "left") newX -= 1;
        if (direction === "right") newX += 1;

        // Проверка границ
        if (newX < 0 || newX >= COLS) return false;

        // Проверка на другие фигуры
        if (grid[y + row][newX] !== -1) return false;
      }
    }
  }

  return true; // если нет препятствий, двигаться можно
}

function canMoveDown(piece, grid) {
  const { shape, x, y } = piece;

  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] === 1) {
        if (y + row + 1 >= ROWS) return false;

        if (grid[y + row + 1][x + col] !== -1) return false;
      }
    }
  }

  return true; // Двигаться вниз можно
}

function clearLines(grid) {
  let cleared = 0; // живёт только внутри функции

  for (let row = 0; row < grid.length; row++) {
    if (grid[row].every((cell) => cell !== -1)) {
      grid.splice(row, 1);
      grid.unshift(new Array(COLS).fill(-1));
      cleared++;
      row--;
    }
  }

  return cleared;
}

function randomPiece() {
  const index = Math.floor(Math.random() * SHAPES.length);
  return {
    shape: SHAPES[index],
    x: 3,
    y: 0,
    color: COLORS[index],
  };
}

document.body.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" && canMove(piece, grid, "left")) {
    piece.x--;
  } else if (event.key === "ArrowRight" && canMove(piece, grid, "right")) {
    piece.x++;
  }
});

setInterval(() => {
  update();

  if (canMoveDown(piece, grid)) {
    piece.y++; // фигура падает
  } else {
    // Фиксируем фигуру в сетке
    const { shape, x, y, color } = piece;
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] === 1) {
          grid[y + row][x + col] = color;
        }
      }
    }
    const cleared = clearLines(grid);

    if (cleared === 1) score += 100;
    if (cleared === 2) score += 300;
    if (cleared === 3) score += 500;
    if (cleared === 4) score += 800;

    // Создаём новую фигуру сверху
    const newPiece = randomPiece();
    piece.shape = newPiece.shape;
    piece.x = newPiece.x;
    piece.y = newPiece.y;
    piece.color = newPiece.color;
  }
}, 500);

//
