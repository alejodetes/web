// Obtiene el elemento canvas y su contexto de dibujo
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Variables del juego
let score = 0, // Puntuación actual
    lives = 3, // Vidas restantes
    round = 1, // Ronda actual
    maxRounds = 5, // Número máximo de rondas
    enemySpeed = 2, // Velocidad de los enemigos
    enemyDirection = 1; // Dirección de los enemigos (1: derecha, -1: izquierda)

// Objeto que representa al jugador
const player = {
    x: 285, // Posición horizontal inicial
    y: 360, // Posición vertical inicial
    width: 30, // Ancho del jugador
    height: 10, // Altura del jugador
    speed: 5, // Velocidad de movimiento
    dx: 0 // Cambio en la posición horizontal (para movimiento)
};

// Arrays para almacenar las balas y los enemigos
const bullets = [], enemies = [];

// Función para crear los enemigos según la ronda actual
function createEnemies() {
    enemies.length = 0; // Vacía el array de enemigos
    for (let r = 0; r < round; r++) { // Itera según la ronda actual
        for (let c = 0; c < 6; c++) { // Crea 6 enemigos por fila
            enemies.push({ x: c * 50 + 50, y: r * 30 + 30, width: 30, height: 20 }); // Añade un enemigo
        }
    }
}

// Función para dibujar todos los elementos en el canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas
    ctx.fillStyle = "white"; // Color del jugador
    ctx.fillRect(player.x, player.y, player.width, player.height); // Dibuja al jugador
    ctx.fillStyle = "red"; // Color de los enemigos
    enemies.forEach(e => ctx.fillRect(e.x, e.y, e.width, e.height)); // Dibuja los enemigos
    ctx.fillStyle = "yellow"; // Color de las balas
    bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height)); // Dibuja las balas
}

// Función para actualizar el estado del juego
function update() {
    // Mueve al jugador
    player.x += player.dx;
    if (player.x < 0) player.x = 0; // Limita el movimiento a la izquierda
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width; // Limita el movimiento a la derecha

    // Mueve las balas y verifica colisiones con enemigos
    bullets.forEach(b => b.y -= 5); // Mueve las balas hacia arriba
    bullets.forEach((b, i) => {
        enemies.forEach((e, j) => {
            // Verifica si una bala colisiona con un enemigo
            if (b.x < e.x + e.width && b.x + b.width > e.x && b.y < e.y + e.height && b.y + b.height > e.y) {
                bullets.splice(i, 1); // Elimina la bala
                enemies.splice(j, 1); // Elimina el enemigo
                score += 10; // Aumenta la puntuación
                updateScoreBoard(); // Actualiza el marcador
            }
        });
    });

    // Mueve los enemigos y cambia su dirección si llegan a los bordes
    let changeDirection = false;
    enemies.forEach(e => {
        e.x += enemySpeed * enemyDirection; // Mueve al enemigo
        if (e.x <= 0 || e.x + e.width >= canvas.width) changeDirection = true; // Cambia de dirección si toca un borde
    });

    if (changeDirection) {
        enemyDirection *= -1; // Invierte la dirección
        enemies.forEach(e => e.y += 20); // Baja a los enemigos
    }

    // Verifica si un enemigo colisiona con el jugador
    enemies.forEach(e => {
        if (e.y + e.height >= player.y && e.x < player.x + player.width && e.x + e.width > player.x) {
            loseLife(); // Resta una vida
            enemies.splice(enemies.indexOf(e), 1); // Elimina al enemigo
        }
    });

    // Verifica si todos los enemigos fueron eliminados
    if (enemies.length === 0) nextRound(); // Avanza a la siguiente ronda
    // Verifica si un enemigo llegó al final de la pantalla
    if (enemies.some(e => e.y > canvas.height)) loseLife(); // Resta una vida
}

// Función para avanzar a la siguiente ronda
function nextRound() {
    if (round >= maxRounds) return showWin(); // Si se completaron todas las rondas, muestra la pantalla de victoria
    round++; // Incrementa la ronda
    enemySpeed++; // Aumenta la velocidad de los enemigos
    createEnemies(); // Crea nuevos enemigos
    updateScoreBoard(); // Actualiza el marcador
}

// Función para restar una vida al jugador
function loseLife() {
    lives--; // Resta una vida
    updateScoreBoard(); // Actualiza el marcador
    if (lives === 0) return showGameOver(); // Si no quedan vidas, muestra la pantalla de Game Over
    createEnemies(); // Crea nuevos enemigos
}

// Función para actualizar el marcador en la pantalla
function updateScoreBoard() {
    document.getElementById("score").textContent = score; // Actualiza la puntuación
    document.getElementById("lives").textContent = lives; // Actualiza las vidas
    document.getElementById("round").textContent = round; // Actualiza la ronda
}

// Función para mostrar la pantalla de Game Over
function showGameOver() {
    document.getElementById("gameOverScreen").style.display = "block"; // Muestra la pantalla
}

// Función para mostrar la pantalla de victoria
function showWin() {
    document.getElementById("winScreen").style.display = "block"; // Muestra la pantalla
}

// Función para reiniciar el juego
function restartGame() {
    score = 0; lives = 3; round = 1; enemySpeed = 2; // Reinicia las variables
    document.getElementById("gameOverScreen").style.display = "none"; // Oculta la pantalla de Game Over
    document.getElementById("winScreen").style.display = "none"; // Oculta la pantalla de victoria
    createEnemies(); // Crea nuevos enemigos
    updateScoreBoard(); // Actualiza el marcador
}

// Bucle principal del juego
function gameLoop() {
    draw(); // Dibuja los elementos
    update(); // Actualiza el estado del juego
    requestAnimationFrame(gameLoop); // Llama a la función en el siguiente frame
}

// Controles del jugador
document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") player.dx = -player.speed; // Mueve al jugador a la izquierda
    if (e.key === "ArrowRight") player.dx = player.speed; // Mueve al jugador a la derecha
});
document.addEventListener("keyup", () => player.dx = 0); // Detiene al jugador cuando se suelta la tecla
document.addEventListener("click", () => bullets.push({ x: player.x + 12, y: player.y, width: 5, height: 10 })); // Dispara una bala al hacer clic

// Inicializa el juego
createEnemies(); // Crea los enemigos iniciales
updateScoreBoard(); // Actualiza el marcador
gameLoop(); // Inicia el bucle del juego
