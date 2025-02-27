let grid;
let currentPlayer;
let selectedType;
let foodPlayer1;
let foodPlayer2;
let gameOver;
let winner;
let gameState;
let vsAI;

function getPlayerColor(owner) {
  if (owner == 1) return color(255, 0, 0);
  if (owner == 2) return color(0, 0, 255);
  return color(128);
}

function getStemColor(owner) {
  if (owner == 1) return color(128, 0, 0);
  if (owner == 2) return color(0, 0, 128);
  return color(0);
}

function getCapColor(type) {
  if (type == 'harvester') return color(0, 255, 0);
  if (type == 'tower') return color(255, 255, 0);
  return color(255);
}

function setup() {
  createCanvas(350, 450);
  textSize(16);
  gameState = 'menu';
  vsAI = true;
  resetGame();
}

function resetGame() {
  grid = [];
  for (let row = 0; row < 7; row++) {
    grid[row] = [];
    for (let col = 0; col < 7; col++) {
      grid[row][col] = { owner: 0, type: 'none' };
    }
  }
  grid[0][0] = { owner: 1, type: 'harvester' };
  grid[6][6] = { owner: 2, type: 'harvester' };
  currentPlayer = 1;
  selectedType = null;
  foodPlayer1 = 0;
  foodPlayer2 = 0;
  gameOver = false;
  winner = null;
}

function draw() {
  background(255);

  if (gameState === 'menu') {
    drawOpeningScreen();
  } else if (gameState === 'playing') {
    drawGame();
  } else if (gameState === 'end') {
    drawEndScreen();
  }
}

function drawOpeningScreen() {
  fill(0);
  textAlign(CENTER);
  textSize(32);
  text('Mushroom Wars', width / 2, 50);
  textSize(16);
  textAlign(LEFT);

  let xCenter = width / 2;
  let yBase = 200;

  fill(139, 69, 19);
  rect(xCenter - 20, yBase, 40, 80, 5);
  fill(160, 82, 45);
  rect(xCenter - 16, yBase + 4, 32, 72);
  fill(255, 0, 0);
  ellipse(xCenter, yBase - 20, 120, 60);
  fill(255, 69, 0);
  ellipse(xCenter, yBase - 30, 100, 50);
  fill(255, 99, 71);
  ellipse(xCenter, yBase - 40, 80, 40);
  fill(255);
  rect(xCenter - 20, yBase - 40, 8, 8);
  rect(xCenter + 12, yBase - 36, 8, 8);
  rect(xCenter - 32, yBase - 28, 8, 8);
  rect(xCenter + 24, yBase - 24, 8, 8);

  fill(200);
  rect(75, 300, 100, 40);
  rect(175, 300, 100, 40);
  fill(0);
  text('Play vs AI', 90, 325);
  text('Play vs Human', 180, 325);
}

function drawGame() {
  noStroke();
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 7; col++) {
      let x = col * 50;
      let y = row * 50;
      fill(getPlayerColor(grid[row][col].owner));
      rect(x, y, 50, 50);
    }
  }

  stroke(0);
  strokeWeight(2);
  for (let i = 0; i <= 7; i++) {
    let pos = i * 50;
    line(0, pos, 350, pos);
    line(pos, 0, pos, 350);
  }

  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 7; col++) {
      let x = col * 50;
      let y = row * 50;
      if (grid[row][col].type != 'none') {
        let stemColor = getStemColor(grid[row][col].owner);
        let capColor = getCapColor(grid[row][col].type);
        drawMushroom(x, y, grid[row][col].type, stemColor, capColor);
      }
    }
  }

  noStroke();
  fill(200);
  rect(0, 350, 100, 50);
  fill(0);
  text('Harvester', 10, 375);
  fill(200);
  rect(100, 350, 100, 50);
  fill(0);
  text('Tower', 110, 375);
  text('Player: ' + (currentPlayer == 1 ? 'P1' : 'P2 (' + (vsAI ? 'AI' : 'Human') + ')'), 210, 375);
  text('Selected: ' + (selectedType || 'None'), 210, 390);
  text('P1 Food: ' + foodPlayer1, 10, 390);
  text('P2 Food: ' + foodPlayer2, 110, 390);
  if (gameOver) {
    gameState = 'end';
  }

  fill(0);
  text('P1 Tiles: ' + countTiles(1), 10, 420);
  text('P2 Tiles: ' + countTiles(2), 110, 420);
  text('Legend: Harvester +1 food, Tower -4 food per turn', 10, 435);
}

function drawEndScreen() {
  fill(0);
  textAlign(CENTER);
  textSize(24);
  text('Game Over!', width / 2, 50);
  text('Player ' + winner + ' Wins!', width / 2, 90);
  textSize(16);

  // Victorious mushroom art
  let xCenter = width / 2;
  let yBase = 220;
  let capColor = (winner == 1) ? color(255, 0, 0) : color(0, 0, 255); // Red or Blue based on winner
  let midColor = (winner == 1) ? color(255, 69, 0) : color(0, 69, 255);
  let topColor = (winner == 1) ? color(255, 99, 71) : color(0, 99, 255);

  // Stem with "crown" effect
  fill(139, 69, 19);
  rect(xCenter - 20, yBase, 40, 80, 5);
  fill(160, 82, 45);
  rect(xCenter - 16, yBase + 4, 32, 72);
  fill(255, 215, 0); // Gold crown
  triangle(xCenter - 20, yBase, xCenter, yBase - 20, xCenter + 20, yBase); // Crown spike middle
  triangle(xCenter - 30, yBase, xCenter - 10, yBase - 10, xCenter - 10, yBase); // Left spike
  triangle(xCenter + 10, yBase, xCenter + 30, yBase - 10, xCenter + 30, yBase); // Right spike

  // Cap with 3D effect
  fill(capColor);
  ellipse(xCenter, yBase - 20, 120, 60);
  fill(midColor);
  ellipse(xCenter, yBase - 30, 100, 50);
  fill(topColor);
  ellipse(xCenter, yBase - 40, 80, 40);

  // Spots
  fill(255);
  rect(xCenter - 20, yBase - 40, 8, 8);
  rect(xCenter + 12, yBase - 36, 8, 8);
  rect(xCenter - 32, yBase - 28, 8, 8);
  rect(xCenter + 24, yBase - 24, 8, 8);

  // Buttons (shifted down to fit art)
  fill(200);
  rect(75, 320, 100, 40);
  rect(175, 320, 100, 40);
  fill(0);
  text('Play Again', 90, 345);
  text('Exit', 190, 345);

  textAlign(LEFT);
}

function drawMushroom(x, y, type, stemColor, capColor) {
  if (type == 'harvester') {
    stroke(stemColor);
    strokeWeight(2);
    noFill();
    beginShape();
    vertex(x + 25, y + 50);
    bezierVertex(x + 15, y + 40, x + 35, y + 30, x + 25, y + 20);
    endShape();
    noStroke();
    fill(capColor);
    beginShape();
    vertex(x + 10, y + 20);
    quadraticVertex(x + 25, y + 5, x + 40, y + 20);
    endShape(CLOSE);
    fill(255, 0, 0);
    ellipse(x + 18, y + 15, 5, 5);
    ellipse(x + 25, y + 10, 5, 5);
    ellipse(x + 32, y + 15, 5, 5);
  } else if (type == 'tower') {
    fill(stemColor);
    rect(x + 15, y + 30, 20, 20);
    fill(capColor);
    rect(x + 20, y + 10, 10, 20);
    fill(0);
    triangle(x + 20, y + 10, x + 25, y + 5, x + 30, y + 10);
    stroke(0);
    strokeWeight(1);
    line(x + 20, y + 30, x + 25, y + 25);
    line(x + 25, y + 25, x + 30, y + 30);
    noStroke();
  }
}

function mouseClicked() {
  if (gameState === 'menu') {
    if (mouseY >= 300 && mouseY < 340) {
      if (mouseX >= 75 && mouseX < 175) {
        vsAI = true;
        gameState = 'playing';
        resetGame();
      } else if (mouseX >= 175 && mouseX < 275) {
        vsAI = false;
        gameState = 'playing';
        resetGame();
      }
    }
  } else if (gameState === 'playing' && !gameOver) {
    if (mouseY >= 350 && mouseY < 400) {
      if (mouseX >= 0 && mouseX < 100) {
        selectedType = 'harvester';
      } else if (mouseX >= 100 && mouseX < 200) {
        selectedType = 'tower';
      }
    } else if (mouseX >= 0 && mouseX < 350 && mouseY >= 0 && mouseY < 350) {
      if (selectedType != null) {
        let row = Math.floor(mouseY / 50);
        let col = Math.floor(mouseX / 50);
        if (isValidPlacement(row, col, currentPlayer)) {
          makeMove(row, col, currentPlayer, selectedType);
          selectedType = null;
          if (!gameOver && vsAI && currentPlayer == 2) {
            setTimeout(computerMove, 500);
          }
        }
      }
    }
  } else if (gameState === 'end') {
    if (mouseY >= 320 && mouseY < 360) { // Adjusted for new button position
      if (mouseX >= 75 && mouseX < 175) {
        gameState = 'menu';
      } else if (mouseX >= 175 && mouseX < 275) {
        noLoop();
      }
    }
  }
}

function computerMove() {
  if (gameOver || currentPlayer != 2) return;
  let validMoves = [];
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 7; col++) {
      if (isValidPlacement(row, col, 2)) {
        validMoves.push([row, col]);
      }
    }
  }
  if (validMoves.length === 0) {
    gameOver = true;
    winner = 1;
    return;
  }

  let [H, T] = calculateHarvestersAndTowers(2);
  let foodBalance = H - 4 * T;
  let tilesP2 = countTiles(2);
  let bestMove = null;
  let bestScore = -Infinity;

  for (let [row, col] of validMoves) {
    let harvesterScore = evaluateMove(row, col, 'harvester', H, T, foodBalance, tilesP2);
    if (harvesterScore > bestScore) {
      bestScore = harvesterScore;
      bestMove = [row, col, 'harvester'];
    }
    if (foodPlayer2 >= 4 || (H + 1 >= 2 * (T + 1))) {
      let towerScore = evaluateMove(row, col, 'tower', H, T, foodBalance, tilesP2);
      if (towerScore > bestScore) {
        bestScore = towerScore;
        bestMove = [row, col, 'tower'];
      }
    }
  }

  let [row, col, type] = bestMove;
  makeMove(row, col, 2, type);
}

function evaluateMove(row, col, type, H, T, foodBalance, tilesP2) {
  let score = 0;
  let enemyHits = type === 'tower' ? countAdjacentEnemies(row, col, 2) : 0;
  let newH = H + (type === 'harvester' ? 1 : 0);
  let newT = T + (type === 'tower' ? 1 : 0);
  let newFoodBalance = newH - 4 * newT;

  score += 10;
  if (newFoodBalance >= 0) score += 20;
  else score -= 50 * Math.abs(newFoodBalance);
  if (newH >= 2 * newT) score += 30;
  score += foodPlayer2;
  score += 40 * enemyHits;
  let distanceToP1Root = Math.abs(row - 0) + Math.abs(col - 0);
  score -= distanceToP1Root;
  if (tilesP2 + 1 + enemyHits >= 25) score += 1000;
  else if (tilesP2 + 1 >= 20) score += 50;

  return score;
}

function makeMove(row, col, player, type) {
  grid[row][col].owner = player;
  grid[row][col].type = type;
  if (type == 'tower') {
    eliminateAdjacentEnemies(row, col, player);
  }
  performConnectivityCheck(1);
  performConnectivityCheck(2);
  let opponent = 3 - player;
  currentPlayer = opponent;
  let [H, T] = calculateHarvestersAndTowers(currentPlayer);
  if (currentPlayer == 1) {
    foodPlayer1 += H - 4 * T;
    if (foodPlayer1 < 0) {
      eliminateRandomMushrooms(1, -foodPlayer1);
      performConnectivityCheck(1);
    }
  } else {
    foodPlayer2 += H - 4 * T;
    if (foodPlayer2 < 0) {
      eliminateRandomMushrooms(2, -foodPlayer2);
      performConnectivityCheck(2);
    }
  }
  let tilesP1 = countTiles(1);
  let tilesP2 = countTiles(2);
  if (tilesP1 >= 25) {
    gameOver = true;
    winner = 1;
  } else if (tilesP2 >= 25) {
    gameOver = true;
    winner = 2;
  } else if (!hasValidMoves(currentPlayer)) {
    gameOver = true;
    winner = 3 - currentPlayer;
  }
}

function getNeighbors(row, col) {
  let neighbors = [];
  if (row > 0) neighbors.push([row - 1, col]);
  if (row < 6) neighbors.push([row + 1, col]);
  if (col > 0) neighbors.push([row, col - 1]);
  if (col < 6) neighbors.push([row, col + 1]);
  return neighbors;
}

function isValidPlacement(row, col, player) {
  if (grid[row][col].owner != 0) return false;
  let neighbors = getNeighbors(row, col);
  let hasOwnNeighbor = false;
  let opponent = 3 - player;
  for (let [nRow, nCol] of neighbors) {
    if (grid[nRow][nCol].owner == player) {
      hasOwnNeighbor = true;
    }
    if (grid[nRow][nCol].owner == opponent && grid[nRow][nCol].type == 'tower') {
      return false;
    }
  }
  return hasOwnNeighbor;
}

function eliminateAdjacentEnemies(row, col, player) {
  let opponent = 3 - player;
  let neighbors = getNeighbors(row, col);
  for (let [nRow, nCol] of neighbors) {
    if (grid[nRow][nCol].owner == opponent) {
      grid[nRow][nCol].owner = 0;
      grid[nRow][nCol].type = 'none';
    }
  }
}

function countAdjacentEnemies(row, col, player) {
  let opponent = 3 - player;
  let neighbors = getNeighbors(row, col);
  let count = 0;
  for (let [nRow, nCol] of neighbors) {
    if (grid[nRow][nCol].owner == opponent) count++;
  }
  return count;
}

function performConnectivityCheck(player) {
  let rootRow = (player == 1) ? 0 : 6;
  let rootCol = (player == 1) ? 0 : 6;
  if (grid[rootRow][rootCol].owner != player) {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (grid[r][c].owner == player) {
          grid[r][c].owner = 0;
          grid[r][c].type = 'none';
        }
      }
    }
    return;
  }
  let visited = Array(7).fill().map(() => Array(7).fill(false));
  let queue = [[rootRow, rootCol]];
  visited[rootRow][rootCol] = true;
  while (queue.length > 0) {
    let [r, c] = queue.shift();
    let neighbors = getNeighbors(r, c);
    for (let [nR, nC] of neighbors) {
      if (grid[nR][nC].owner == player && !visited[nR][nC]) {
        visited[nR][nC] = true;
        queue.push([nR, nC]);
      }
    }
  }
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 7; c++) {
      if (grid[r][c].owner == player && !visited[r][c]) {
        grid[r][c].owner = 0;
        grid[r][c].type = 'none';
      }
    }
  }
}

function calculateHarvestersAndTowers(player) {
  let H = 0, T = 0;
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 7; c++) {
      if (grid[r][c].owner == player) {
        if (grid[r][c].type == 'harvester') H++;
        else if (grid[r][c].type == 'tower') T++;
      }
    }
  }
  return [H, T];
}

function countTiles(player) {
  let count = 0;
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 7; c++) {
      if (grid[r][c].owner == player) count++;
    }
  }
  return count;
}

function eliminateRandomMushrooms(player, num) {
  let mushrooms = [];
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 7; c++) {
      if (grid[r][c].owner == player && grid[r][c].type != 'none') {
        mushrooms.push([r, c]);
      }
    }
  }
  let toEliminate = Math.min(num, mushrooms.length);
  for (let i = 0; i < toEliminate; i++) {
    let index = Math.floor(random(mushrooms.length));
    let [r, c] = mushrooms[index];
    grid[r][c].owner = 0;
    grid[r][c].type = 'none';
    mushrooms.splice(index, 1);
  }
}

function hasValidMoves(player) {
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 7; col++) {
      if (grid[row][col].owner == 0 && isValidPlacement(row, col, player)) {
        return true;
      }
    }
  }
  return false;
}