const board = document.querySelector(".board");
const startButton = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const restartButon = document.querySelector(".btn-restart");

//HighScore / Score  / Time
const highScoreElement = document.querySelector("#high-score");
const ScoreElement = document.querySelector("#score");
const TimeElement = document.querySelector("#time");

const block_Size = 50;

let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = `00-00`;
highScoreElement.innerText = highScore;

const cols = Math.floor(board.clientWidth / block_Size);
const rows = Math.floor(board.clientHeight / block_Size);

const blocks = {};

let snake = [{ x: 1, y: 3 }];
let direction = "down";
let intervalId = null;
let food = null;

function createBlock() {
  const fragment = document.createDocumentFragment(); // 👈 fragment

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const block = document.createElement("div");
      block.classList.add("block");
      block.innerText = `${row}-${col}`;
      block.style.border = "2px solid white";

      blocks[`${row}-${col}`] = block;
      fragment.appendChild(block); // 👈 DOM me direct nahi
    }
  }

  board.appendChild(fragment); // 👈 ek hi dafa DOM update
}
createBlock();

function render() {
  let head = null;
  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  } else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  }
  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    clearInterval(intervalId);
    intervalId = null; // 🔑 ye zaroori hai
    // alert("Game Over");
    modal.style.display = "flex";
    startGameModal.style.display = "none";
    gameOverModal.style.display = "flex";
    return;
  }
  // If you click on the food tab (the food is shifted to the next position {function call is made which is line no. 98 below}) // FOOD CONSUMER
  if (head.x == food.x && head.y == food.y) {
    handleFoodEat();
    currentScore();
    updateHighScore();
    //increase the length of snake (after the consumtion of food)
    snake.unshift(head);
  }
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });
  snake.unshift(head);
  snake.pop();

  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.add("fill");
  });
}
// intervalId = setInterval(() => {
//   render();
// }, 300);
// render()
function snakeDirection() {
  addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();

    if (event.key === "ArrowUp" || event.key === "w") {
      direction = "up";
    } else if (event.key === "ArrowDown" || event.key === "s") {
      direction = "down";
    } else if (event.key === "ArrowRight" || event.key === "d") {
      direction = "right";
    } else if (event.key === "ArrowLeft" || event.key === "a") {
      direction = "left";
    } else {
    }
  });
}
snakeDirection();
function generateFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
  } while (
    snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)
  );
  food = newFood;
}
generateFood();
function renderFood() {
  blocks[`${food.x}-${food.y}`].classList.add("food");
  // reRenderfood()
}
renderFood();
function handleFoodEat() {
  // remove old food
  blocks[`${food.x}-${food.y}`].classList.remove("food");
  // generate + render new food
  generateFood();
  renderFood();
}
//Start Button Function
startButton.addEventListener("click", startGame);
function startGame() {
  if (intervalId !== null) return; // 🔒 dobara start se roknay ke liye
  modal.style.display = "none";
  intervalId = setInterval(() => {
    render();
  }, 300);
}
//Restart Game After GameEnd

restartButon.addEventListener("click", restartGame);
function restartGame() {
  modal.style.display = "none";
  // 🧹 clear old snake
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });
  // 🧹 clear old food
  if (food) {
    blocks[`${food.x}-${food.y}`].classList.remove("food");
  } 

  // 🔄 reset values
  snake = [{ x: 1, y: 3 }];
  direction = "down";

  generateFood();
  renderFood();
  startGame();
  score = 0;
  currentScore();
  // score = 0;
  time = `00-00`;
}
//Current Score
function currentScore() {
  score += 1;
  ScoreElement.innerHTML = score;
}

//HighScore
function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore.toString());
  }
}
