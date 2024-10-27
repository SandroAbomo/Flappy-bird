//board
let board;
let boardWidth = 500; //360
let boardHeight = 640; //640
let context;

//Bird
let birdWidth = 34; //width/height ratio = 408/228 = 17/12
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

//---bird object---

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

// pipes
let pipeArray = [];
let pipeWidth = 64; //width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// Game physics
let velocityX = -2; // pipe speed moving sideways, right to left
let velocityY = -5; // bird jump speed.
let gravity = 0.3; // the bird will come down after jumping.

let gameOver = false;
let score = 0;

//Game function
window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); //used for drawing on the board

  //draw the flappy bird
  // context.fillStyle = "green";
  // context.fillRect(bird.x, bird.y, bird.width, bird.height);//

  // load Images
  birdImg = new Image();
  birdImg.src = "./image/flappybird.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  topPipeImg = new Image();
  topPipeImg.src = "./image/toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./image/bottompipe.png";

  requestAnimationFrame(update);
  setInterval(placePipes, 1500); // 1.5 seconde
  document.addEventListener("keydown", moveBird);
};

function update() {
  requestAnimationFrame(update);

  if (gameOver) return;

  context.clearRect(0, 0, board.width, board.height);

  // birth
  velocityY += gravity;
  // bird.y += velocityY;
  bird.y = Math.max(bird.y + velocityY, 0); //this will either apply the gravity to bird.y and will not cross the top of the canvas
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > board.height) {
    gameOver = true;
  }
  // if (bird.y > board.height || bird.y === 0) {
  //   gameOver = true;
  // }

  // Pipes
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 1 / 2;
      pipe.passed = true;
    }

    if (detectCollision(bird, pipe)) {
      gameOver = true;
    }
  }

  // clear the pipe to avoid memory issue
  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift(); //this removes the first element from the array. Basically everytime a pipe is useless it will be removed from the canvas.
  }

  //score
  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText(score, 5, 45);

  if (gameOver) {
    context.fillStyle = "red";
    context.fillText(`GAME OVER `, 40, 320);
  }
}

function placePipes() {
  if (gameOver) {
    return;
  }

  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  // let openingSpace = board.height / 4;
  let openingSpace = board.height / 4 - Math.min(score * 5, 100); // Pipes get closer as the score increases

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(topPipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(bottomPipe);
}

function moveBird(e) {
  if (e.code == "Space" || e.code == "ArrowUp" || e.code == "keyX") {
    //jump
    velocityY = -6;

    //Reset Game
    if (gameOver) {
      bird.y = birdY;
      pipeArray = [];
      score = 0;
      gameOver = false;
    }
  }
}
function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

