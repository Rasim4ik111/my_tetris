# Tetris Game

A simple browser-based Tetris game built with **HTML**, **CSS**, and **JavaScript**.

## Features

- Classic Tetris gameplay with 7 standard shapes (I, O, T, J, L, S, Z)
- Rotating and moving pieces using keyboard:
  - **Arrow Left**: move piece left
  - **Arrow Right**: move piece right
  - **Arrow Up**: rotate piece
  - **Arrow Down**: speed up piece drop
- Score tracking based on cleared lines:
  - 1 line: 100 points
  - 2 lines: 300 points
  - 3 lines: 500 points
  - 4 lines (Tetris!): 800 points
- Smooth animation using `requestAnimationFrame`

## How to Run

1. Clone or download the repository:

```bash
git clone https://github.com/Rasim4ik111/my_tetris.git
```

2. Open index.html in a web browser.

3. Play using keyboard controls.

## Code Structure

index.html — main HTML file with a <canvas> element.
style.css — optional styling for canvas and layout.
script.js — main game logic, including:

Piece creation and rotation
Collision detection
Line clearing
Score tracking
Rendering to canvas

## How it Works

The game uses a 2D array to represent the board grid.
Pieces are randomly generated from the 7 standard Tetris shapes.
Collision detection ensures pieces do not move outside the grid or overlap fixed blocks.
Lines are cleared when fully filled, and the score is updated accordingly.
The game continuously updates using requestAnimationFrame.

## Future Improvements

Add next piece preview
Add levels and increasing speed
Add sound effects
Mobile-friendly controls

### The Core Team


<span><i>Made at <a href='https://qwasar.io'>Qwasar SV -- Software Engineering School</a></i></span>
<span><img alt='Qwasar SV -- Software Engineering School's Logo' src='https://storage.googleapis.com/qwasar-public/qwasar-logo_50x50.png' width='20px' /></span>
