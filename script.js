// Variables globales
let puntaje = 0; // Almacena el puntaje actual del jugador
let tiempo = 60; // Tiempo restante en el juego
let intervaloGlobos; // Intervalo para crear globos
let intervaloTiempo; // Intervalo para actualizar el tiempo
let juegoPausado = false; // Indica si el juego está en pausa

// Elementos del DOM
const menuInicio = document.getElementById('menu-inicio'); // Menú de inicio
const juego = document.getElementById('juego'); // Área del juego
const menuPausa = document.getElementById('menu-pausa'); // Menú de pausa
const menuPerdiste = document.getElementById('menu-perdiste'); // Menú de "Perdiste"
const btnIniciar = document.getElementById('btn-iniciar'); // Botón para iniciar el juego
const btnPausa = document.getElementById('btn-pausa'); // Botón para pausar el juego
const btnReanudar = document.getElementById('btn-reanudar'); // Botón para reanudar el juego
const btnReiniciar = document.getElementById('btn-reiniciar'); // Botón para reiniciar el juego
const btnReiniciarPerdiste = document.getElementById('btn-reiniciar-perdiste'); // Botón para reiniciar desde el menú "Perdiste"
const areaJuego = document.getElementById('area-juego'); // Área donde aparecen los globos
const puntajeFinal = document.getElementById('puntaje-final'); // Elemento que muestra el puntaje final

// Sonido de explosión
const sonidoExplosion = new Audio('explosion.mp3'); // Carga el sonido de explosión

// Eventos
btnIniciar.addEventListener('click', iniciarJuego); // Inicia el juego al hacer clic en "Iniciar Juego"
btnPausa.addEventListener('click', pausarJuego); // Pausa el juego al hacer clic en "Pausa"
btnReanudar.addEventListener('click', reanudarJuego); // Reanuda el juego al hacer clic en "Reanudar"
btnReiniciar.addEventListener('click', reiniciarJuego); // Reinicia el juego al hacer clic en "Reiniciar"
btnReiniciarPerdiste.addEventListener('click', reiniciarJuego); // Reinicia el juego al hacer clic en "Reiniciar Juego" desde el menú "Perdiste"

// Función para iniciar el juego
function iniciarJuego() {
    menuInicio.classList.add('oculto'); // Oculta el menú de inicio
    juego.classList.remove('oculto'); // Muestra el área del juego
    puntaje = 0; // Reinicia el puntaje
    tiempo = 60; // Reinicia el tiempo
    actualizarPuntaje(); // Actualiza el puntaje en la pantalla
    actualizarTiempo(); // Actualiza el tiempo en la pantalla
    intervaloGlobos = setInterval(crearGlobo, 1000); // Crea globos cada segundo
    intervaloTiempo = setInterval(actualizarTiempo, 1000); // Actualiza el tiempo cada segundo
}

// Función para crear globos
function crearGlobo() {
    if (juegoPausado) return; // Si el juego está en pausa, no crea globos

    const globo = document.createElement('div'); // Crea un nuevo elemento div para el globo
    globo.classList.add('globo'); // Añade la clase "globo" al elemento
    const esBomba = Math.random() < 0.2; // 20% de probabilidad de que el globo sea una bomba
    if (esBomba) {
        globo.classList.add('bomba'); // Si es bomba, añade la clase "bomba"
    }

    // Posiciona el globo en una ubicación aleatoria en la pantalla
    globo.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
    // Añade un evento para explotar el globo al hacer clic
    globo.addEventListener('click', () => explotarGlobo(globo, esBomba));
    areaJuego.appendChild(globo); // Añade el globo al área de juego

    // Elimina el globo después de 5 segundos si no es explotado
    setTimeout(() => {
        if (globo.parentElement) {
            if (!esBomba) {
                perderJuego(); // Si no es una bomba, el jugador pierde
            }
            globo.remove(); // Elimina el globo
        }
    }, 5000);
}

// Función para explotar globos
function explotarGlobo(globo, esBomba) {
    if (juegoPausado) return; // Si el juego está en pausa, no hace nada

    // Reproducir sonido de explosión
    sonidoExplosion.play();

    // Añadir efecto de explosión
    globo.classList.add('explotar'); // Añade la clase "explotar" para la animación
    setTimeout(() => globo.remove(), 300); // Elimina el globo después de la animación

    if (esBomba) {
        perderJuego(); // Si es una bomba, el jugador pierde
    } else {
        puntaje += 10; // Si no es una bomba, aumenta el puntaje
        actualizarPuntaje(); // Actualiza el puntaje en la pantalla
    }
}

// Función para actualizar el puntaje
function actualizarPuntaje() {
    document.getElementById('puntaje').textContent = `Puntaje: ${puntaje}`; // Actualiza el texto del puntaje
}

// Función para actualizar el tiempo
function actualizarTiempo() {
    tiempo--; // Reduce el tiempo restante
    document.getElementById('tiempo').textContent = `Tiempo: ${tiempo}`; // Actualiza el texto del tiempo
    if (tiempo <= 0) {
        perderJuego(); // Si el tiempo llega a 0, el jugador pierde
    }
}

// Función para pausar el juego
function pausarJuego() {
    juegoPausado = true; // Marca el juego como pausado
    clearInterval(intervaloGlobos); // Detiene la creación de globos
    clearInterval(intervaloTiempo); // Detiene la actualización del tiempo
    juego.classList.add('oculto'); // Oculta el área del juego
    menuPausa.classList.remove('oculto'); // Muestra el menú de pausa
}

// Función para reanudar el juego
function reanudarJuego() {
    juegoPausado = false; // Marca el juego como no pausado
    menuPausa.classList.add('oculto'); // Oculta el menú de pausa
    juego.classList.remove('oculto'); // Muestra el área del juego
    intervaloGlobos = setInterval(crearGlobo, 1000); // Reanuda la creación de globos
    intervaloTiempo = setInterval(actualizarTiempo, 1000); // Reanuda la actualización del tiempo
}

// Función para reiniciar el juego
function reiniciarJuego() {
    juegoPausado = false; // Marca el juego como no pausado
    menuPausa.classList.add('oculto'); // Oculta el menú de pausa
    menuPerdiste.classList.add('oculto'); // Oculta el menú "Perdiste"
    menuInicio.classList.remove('oculto'); // Muestra el menú de inicio
    areaJuego.innerHTML = ''; // Limpia el área de juego
    clearInterval(intervaloGlobos); // Detiene la creación de globos
    clearInterval(intervaloTiempo); // Detiene la actualización del tiempo
}

// Función para perder el juego
function perderJuego() {
    clearInterval(intervaloGlobos); // Detiene la creación de globos
    clearInterval(intervaloTiempo); // Detiene la actualización del tiempo
    juego.classList.add('oculto'); // Oculta el área del juego
    menuPerdiste.classList.remove('oculto'); // Muestra el menú "Perdiste"
    puntajeFinal.textContent = `Puntaje Final: ${puntaje}`; // Muestra el puntaje final
}
