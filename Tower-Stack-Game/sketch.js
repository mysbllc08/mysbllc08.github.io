const trio_colours = [
  [70, 138, 154], [238, 238, 238], [84, 18, 18]
];

let angle = 0;          
let angleSpeed = 0.1;    
let left_right = 140; 
let centerX = 400 / 2; 
let stackedBlocks = [];   
let movingWidth = 120;    
let movingLeft = 0;       
let score = 0;
let gameOver = false;

function setup() {
  createCanvas(400, 600);
  resetGame();
}

function resetGame() {
  stackedBlocks = [{ left: centerX - 60, width: 120 }];
  movingWidth = 120;
  angle = 0;
  score = 0;
  gameOver = false;
}

function draw() {
  background(0, 0, 0); 

  let towerTopY = height - 40 - stackedBlocks.length * 25;
  let cameraShift = max(0, 200 - towerTopY);

  push();
  translate(0, cameraShift);

  for (let i = 0; i < stackedBlocks.length; i++) {
    // Each level sits 25 pixels higher than the one below, starting above the 40 pixel ground
    let blockY = height - 40 - (i + 1) * 25;
    fill(colour(i));
    rect(stackedBlocks[i].left, blockY, stackedBlocks[i].width, 25);
  }

  let movingY = height - 40 - (stackedBlocks.length + 1) * 25;

  // angle grows by angleSpeed every frame, so sin(angle) keeps changing over time
  if (!gameOver) {
    angle += angleSpeed;
  }
  
  // Resting position + how far the block should swing left and right * sin(angle).
  // sin(angle) is between -1 and 1, so the block moves between (resting - left_right) and (resting + left_right).

  movingLeft = (centerX - movingWidth / 2) + left_right * sin(angle);

  if (!gameOver) {
    fill(colour(stackedBlocks.length));
    rect(movingLeft, movingY, movingWidth, 25);
  }
  pop();

  fill(84, 18, 18);
  rect(0, height -  40, width, 40);

  drawText();
}

function placeBlock() {
  let top = stackedBlocks[stackedBlocks.length - 1];

  // Overlap left edge = the larger (more right) of the two left edges
  let overlapLeft = max(top.left, movingLeft);
  // Overlap right edge = the smaller (more left) of the two right edges
  let overlapRight = min(top.left + top.width, movingLeft + movingWidth);
  // Overlap width = right edge - left edge (zero or negative means a miss)
  let overlapWidth = overlapRight - overlapLeft;

  if (overlapWidth <= 0) {
    gameOver = true;
    return;
  }

  stackedBlocks.push({ left: overlapLeft, width: overlapWidth });
  movingWidth = overlapWidth;
  score++;
}

function colour(level) {
  // level % 3 gives 0, 1, 2, 0, 1, 2, ... so the colors repeat every three blocks
  return trio_colours[level % 3];
}

function drawText() {
  fill(238, 238, 238);
  textAlign(LEFT, TOP);
  textSize(14);
  text("Score: " + score, 10, 10);
  textSize(12);
  text("SPACE / CLICK = drop block", 10, 55);
  text("R = restart", 10, 72);

  if (gameOver) {
    textAlign(CENTER, CENTER);
    textSize(28);
    text("GAME OVER", width / 2, height / 2 - 15);
    textSize(14);
    text("Press R to restart", width / 2, height / 2 + 15);
  }
}

function mousePressed() {
  if (!gameOver) placeBlock();
}

function keyPressed() {
  if (key === ' ') {
    if (!gameOver) placeBlock();
  }
  if (key === 'r' || key === 'R') resetGame();
  return false;
}