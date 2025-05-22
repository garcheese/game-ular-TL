// Ambil semua elemen yang dibutuhkan
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const usernameDisplay = document.getElementById("usernameDisplay");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const gameOverMessage = document.getElementById("gameOverMessage");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const homeBtn = document.getElementById("homeBtn");
const levelSelect = document.getElementById("level");

const boxSize = 20; // Ukuran setiap kotak ular dan makanan
let snake = [];
let food = {};
let direction = "RIGHT";
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let speed = 200;
let gameRunning = false;
let gameInterval;

// Update tampilan skor tertinggi
highScoreDisplay.textContent = highScore;

// Fungsi mulai game
function startGame() {
  const usernameInput = document.getElementById("username").value.trim();
  if (usernameInput === "") {
    alert("Nama pengguna tidak boleh kosong!");
    return;
  }

  usernameDisplay.textContent = usernameInput;
  speed = parseInt(levelSelect.value);
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");

  resetGame();
}

// Fungsi reset game
function resetGame() {
  snake = [{ x: 200, y: 200 }];
  direction = "RIGHT";
  score = 0;
  scoreDisplay.textContent = score;
  food = getRandomPosition();
  gameRunning = true;
  gameOverMessage.classList.add("hidden");

  clearInterval(gameInterval);
  gameInterval = setInterval(drawGame, speed);
}

// Fungsi kembali ke menu awal
function returnHome() {
  gameScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
  clearInterval(gameInterval);
}

// Fungsi untuk mengganti arah ular
function changeDirection(event) {
  const key = event.keyCode;
  if (key === 37 && direction !== "RIGHT") direction = "LEFT";
  else if (key === 38 && direction !== "DOWN") direction = "UP";
  else if (key === 39 && direction !== "LEFT") direction = "RIGHT";
  else if (key === 40 && direction !== "UP") direction = "DOWN";
}

// Fungsi untuk mendapatkan posisi makanan secara acak
function getRandomPosition() {
  return {
    x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
    y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize,
  };
}

// Fungsi menggambar game
function drawGame() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Gambar makanan
  ctx.fillStyle = "#f44336";
  ctx.fillRect(food.x, food.y, boxSize, boxSize);

  // Gambar ular
  ctx.fillStyle = "#4caf50";
  ctx.strokeStyle = "#000";
  snake.forEach((segment, index) => {
    ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
    ctx.strokeRect(segment.x, segment.y, boxSize, boxSize);

    // Gambar mata di kepala ular
    if (index === snake.length - 1) {
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(segment.x + 5, segment.y + 5, 3, 0, Math.PI * 2);
      ctx.arc(segment.x + 15, segment.y + 5, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#4caf50"; // Reset warna badan ular
    }
  });

  moveSnake();
  checkCollision();
}

// Fungsi untuk menggerakkan ular
function moveSnake() {
  let head = { ...snake[snake.length - 1] };

  if (direction === "LEFT") head.x -= boxSize;
  else if (direction === "RIGHT") head.x += boxSize;
  else if (direction === "UP") head.y -= boxSize;
  else if (direction === "DOWN") head.y += boxSize;

  // Membuat ular muncul dari sisi berlawanan (teleport)
  if (head.x >= canvas.width) head.x = 0;
  else if (head.x < 0) head.x = canvas.width - boxSize;
  if (head.y >= canvas.height) head.y = 0;
  else if (head.y < 0) head.y = canvas.height - boxSize;

  snake.push(head);

  // Jika makan makanan
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = score;
    food = getRandomPosition();
  } else {
    snake.shift();
  }
}

// Fungsi cek tabrakan
function checkCollision() {
  const head = snake[snake.length - 1];
  for (let i = 0; i < snake.length - 1; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      endGame();
    }
  }
}

// Fungsi game over
function endGame() {
  gameRunning = false;
  clearInterval(gameInterval);

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    highScoreDisplay.textContent = highScore;
  }

  gameOverMessage.classList.remove("hidden");
}

// Event listeners
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", resetGame);
homeBtn.addEventListener("click", returnHome);
document.addEventListener("keydown", changeDirection);

// --- Tambahan tombol sentuh untuk HP ---
document.getElementById("leftBtn").addEventListener("click", () => {
  if (direction !== "RIGHT") direction = "LEFT";
});
document.getElementById("upBtn").addEventListener("click", () => {
  if (direction !== "DOWN") direction = "UP";
});
document.getElementById("downBtn").addEventListener("click", () => {
  if (direction !== "UP") direction = "DOWN";
});
document.getElementById("rightBtn").addEventListener("click", () => {
  if (direction !== "LEFT") direction = "RIGHT";
});
