const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0, lives = 3, round = 1, maxRounds = 5, enemySpeed = 2, enemyDirection = 1;
const player = { x: 285, y: 360, width: 30, height: 10, speed: 5, dx: 0 };
const bullets = [], enemies = [];

// Crea los enemigos según la ronda actual
function createEnemies() {
    enemies.length = 0;
    for (let r = 0; r < round; r++) {
        for (let c = 0; c < 6; c++) {
            enemies.push({ x: c * 50 + 50, y: r * 30 + 30, width: 30, height: 20 });
        }
    }
}

// Dibuja los elementos en el canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = "red";
    enemies.forEach(e => ctx.fillRect(e.x, e.y, e.width, e.height));
    ctx.fillStyle = "yellow";
    bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));
}

// Actualiza el juego
function update() {
    player.x += player.dx;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    bullets.forEach(b => b.y -= 5);
    bullets.forEach((b, i) => {
        enemies.forEach((e, j) => {
            if (b.x < e.x + e.width && b.x + b.width > e.x && b.y < e.y + e.height && b.y + b.height > e.y) {
                bullets.splice(i, 1);
                enemies.splice(j, 1);
                score += 10;
                updateScoreBoard();
            }
        });
    });

    let changeDirection = false;
    enemies.forEach(e => {
        e.x += enemySpeed * enemyDirection;
        if (e.x <= 0 || e.x + e.width >= canvas.width) changeDirection = true;
    });

    if (changeDirection) {
        enemyDirection *= -1;
        enemies.forEach(e => e.y += 20);
    }

    enemies.forEach(e => {
        if (e.y + e.height >= player.y && e.x < player.x + player.width && e.x + e.width > player.x) {
            loseLife();
            enemies.splice(enemies.indexOf(e), 1);
        }
    });

    if (enemies.length === 0) nextRound();
    if (enemies.some(e => e.y > canvas.height)) loseLife();
}

// Avanza a la siguiente ronda
function nextRound() {
    if (round >= maxRounds) return showWin();
    round++;
    enemySpeed++;
    createEnemies();
    updateScoreBoard();
}

// Resta una vida al jugador
function loseLife() {
    lives--;
    updateScoreBoard();
    if (lives === 0) return showGameOver();
    createEnemies();
}

// Actualiza el marcador
function updateScoreBoard() {
    document.getElementById("score").textContent = score;
    document.getElementById("lives").textContent = lives;
    document.getElementById("round").textContent = round;
}

// Muestra la pantalla de Game Over
function showGameOver() {
    document.getElementById("gameOverScreen").style.display = "block";
}

// Muestra la pantalla de victoria
function showWin() {
    document.getElementById("winScreen").style.display = "block";
}

// Reinicia el juego
function restartGame() {
    score = 0; lives = 3; round = 1; enemySpeed = 2;
    document.getElementById("gameOverScreen").style.display = "none";
    document.getElementById("winScreen").style.display = "none";
    createEnemies();
    updateScoreBoard();
}

// Bucle principal del juego
function gameLoop() {
    draw();
    update();
    requestAnimationFrame(gameLoop);
}

// Controles del jugador
document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") player.dx = -player.speed;
    if (e.key === "ArrowRight") player.dx = player.speed;
});
document.addEventListener("keyup", () => player.dx = 0);
document.addEventListener("click", () => bullets.push({ x: player.x + 12, y: player.y, width: 5, height: 10 }));

// Inicializa el juego
createEnemies();
updateScoreBoard();
gameLoop();
