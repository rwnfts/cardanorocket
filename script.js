// Game Variables
let canvas, ctx;
let fuel;
let fuelBlock;
let fuelBlockImg;
let fuelIntervalId;
let rocketX, rocketY, obstacles, startTime, isGameOver, isStarted, health;
const rocketWidth = 50, rocketHeight = 75, obstacleWidth = 50, obstacleHeight = 50, obstacleGap = 100, fuelBlockWidth = 25, fuelBlockHeight = 25, fuelBlockGap = 50;
const rocketSpeed = 10;

// Start Button
const startBtn = document.getElementById('start-btn');
startBtn.addEventListener('click', startGame);

// Play Again Button
const playAgainBtn = document.getElementById('play-again-btn');
playAgainBtn.addEventListener('click', startGame);

// Game Over Popup
const gameOverPopup = document.getElementById('game-over-popup');

// Initialize the game
function init() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  rocketX = canvas.width / 2 - rocketWidth / 2;
  rocketY = canvas.height - rocketHeight;
  obstacles = [];
  fuelBlock = [];
  startTime = 0;
  isGameOver = false;
  isStarted = false;
  health = 100;
  fuel = 100;
  setInterval(reduceFuel, 1000);

  // Move rocket left or right on keydown
document.addEventListener('keydown', event => {
  if (!isGameOver && isStarted) {
    switch (event.key) {
      case 'ArrowLeft':
        rocketX = Math.max(0, rocketX - rocketSpeed);
        break;
      case 'ArrowRight':
        rocketX = Math.min(canvas.width - rocketWidth, rocketX + rocketSpeed);
        break;
    }
  }
});

  setInterval(() => {
    const backgroundColor = darkenColor(getComputedStyle(canvas).backgroundColor);
    canvas.style.backgroundColor = backgroundColor;
  }, 5000);

  // Create the fuel block image object
  fuelBlockImg = new Image();
  fuelBlockImg.src = 'fuel.png';


}

// Darken a color by 10%
function darkenColor(color) {
  const colorRgb = color.match(/\d+/g);
  for (let i = 0; i < colorRgb.length; i++) {
    colorRgb[i] = Math.max(0, colorRgb[i] - 25);
  }
  return 'rgb(' + colorRgb.join(', ') + ')';
}

// Draw the game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background
  ctx.fillStyle = getComputedStyle(canvas).backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw rocket
  const rocketImg = new Image();
  rocketImg.src = 'rocket.png';
  ctx.drawImage(rocketImg, rocketX, rocketY, rocketWidth, rocketHeight);

  // Draw obstacles
  obstacles.forEach(obstacle => {
    ctx.fillStyle = 'green';
    ctx.fillRect(obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);
  });

  // Draw fuelBlock
  fuelBlock.forEach(fuelBlock => {
    ctx.drawImage(fuelBlockImg, fuelBlock.x, fuelBlock.y, fuelBlockWidth, fuelBlockHeight);
  });

  // Draw fuel bar
  
  ctx.fillStyle = 'orange';
  ctx.fillRect(canvas.width - 120, 55, fuel, 20);
  ctx.fillText('Fuel: ', canvas.width - 170, 70);

  // Draw health bar
  ctx.fillStyle = 'red';
  ctx.fillRect(canvas.width - 120, 30, health, 20);
  ctx.fillText('Health: ', canvas.width - 180, 45);

  // Draw score
  if (isStarted && !isGameOver) {
    const currentTime = new Date().getTime();
    score = Math.round((currentTime - startTime) / 10);
    health = Math.max(0, health - 20 * obstacles.filter(obstacle => checkCollision(obstacle)).length);
    if (health === 0) {
      gameOver();
    }

    ctx.fillStyle = 'white';
    ctx.font = '18px Arial';
    ctx.fillText('Ada Price: $' + score/10000, canvas.width - 160, 20);
  }
}

// Check for collision between rocket and obstacle
function checkCollision(obstacle) {
  const rocketTop = rocketY;
  const rocketBottom = rocketY + rocketHeight;
  const rocketLeft = rocketX;
  const rocketRight = rocketX + rocketWidth;
  const obstacleTop = obstacle.y;
  const obstacleBottom = obstacle.y + obstacleHeight;
  const obstacleLeft = obstacle.x;
  const obstacleRight = obstacle.x + obstacleWidth;
  
  if (rocketRight >= obstacleLeft && rocketLeft <= obstacleRight && rocketBottom >= obstacleTop && rocketTop <= obstacleBottom) {
    const collidingObstacle = obstacle;
    obstacles = obstacles.filter(obstacle => obstacle !== collidingObstacle);
    return true;
  }
  
  return false;
}

// Check for collision between rocket and fuelBlocks
function checkCollisionf(fuelBlocks) {
  const rocketTop = rocketY;
  const rocketBottom = rocketY + rocketHeight;
  const rocketLeft = rocketX;
  const rocketRight = rocketX + rocketWidth;
  const fuelBlockTop = fuelBlocks.y;
  const fuelBlockBottom = fuelBlocks.y + fuelBlockHeight;
  const fuelBlockLeft = fuelBlocks.x;
  const fuelBlockRight = fuelBlocks.x + fuelBlockWidth;
  
  if (rocketRight >= fuelBlockLeft && rocketLeft <= fuelBlockRight && rocketBottom >= fuelBlockTop && rocketTop <= fuelBlockBottom) {
    const collidingfuelBlock = fuelBlocks;
    fuelBlock = fuelBlock.filter(fuelBlocks => fuelBlocks !== collidingfuelBlock);
    return true;
  }
  
  return false;
}

// Spawn a new obstacle at a random x position with a random speed
function spawnObstacle() {
  const obstacleX = Math.floor(Math.random() * (canvas.width - obstacleWidth));
  const obstacleY = 0 - obstacleHeight - obstacleGap;
  const obstacleSpeed = 2 + Math.random() * 2;
  obstacles.push({ x: obstacleX, y: obstacleY, speed: obstacleSpeed });
}

// Spawn a new fuelBlock a random x position with a random speed
function spawnFuelBlock() {
  const fuelBlockX = Math.floor(Math.random() * (canvas.width - fuelBlockWidth));
  const fuelBlockY = 0 - fuelBlockHeight - fuelBlockGap;
  const fuelBlockSpeed = 2 + Math.random() * 2;
  fuelBlock.push({ x: fuelBlockX, y: fuelBlockY, speed: fuelBlockSpeed });
}

// Move obstacles down
function moveObstacles() {
  if (!isGameOver && isStarted) {
    // Remove obstacles that have fallen off the screen
    obstacles = obstacles.filter(obstacle => obstacle.y < canvas.height);
    fuelBlock = fuelBlock.filter(fuelBlocks => fuelBlocks.y < canvas.height)
    // Add new obstacles until there are at least 5 on the screen
    while (obstacles.length < 5) {
      spawnObstacle();
    }

    while (fuelBlock.length < 2){
      spawnFuelBlock();
    }

    // Move each obstacle and increase its speed
    obstacles.forEach(obstacle => {
      obstacle.y += obstacle.speed;
      obstacle.speed += 0.00001 * score;

      // Decrement health if obstacle collides with rocket
      if (checkCollision(obstacle)) {
        health -= 20;
      }
    });

    // Move each fuel block
    fuelBlock.forEach(fuelBlocks => {
      fuelBlocks.y += fuelBlocks.speed;
      fuelBlocks.speed == 0.00001;

      // Increase if obstacle collides with rocket
      if (checkCollisionf(fuelBlocks)) {
        if (fuel>=70)
        {
          fuel = 100;
        }
        else
        {
        fuel += 30;
        }
      }
    });
    
      // End game if health reaches 0
   
    if (health <= 0 || fuel <=0) {
      gameOver();
    }
  }

  draw();
}

//reduce fuel
function reduceFuel() {
  fuel = Math.max(0, fuel - 1);
}


// Game over
function gameOver() {
  isGameOver = true;
  clearInterval(gameLoop);
  gameOverPopup.style.display = 'block';
}

// Start the game
function startGame() {
  isGameOver = false;
  isStarted = true;
  startTime = new Date().getTime();
  health = 100;
  fuel = 100;
  score = 0;
  obstacles = [];
  fuelBlock = [];
  gameOverPopup.style.display = 'none';
  gameLoop = setInterval(moveObstacles, 10);
  canvas.style.backgroundColor = "#ADD8E6";
  setInterval(reduceFuel, 1000);
}

init();