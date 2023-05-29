"use strict";

/*
--------------------------------------
ELEMENTOS DE EXPERIENCIA DE USUARIO
--------------------------------------
*/
let comunicador = document.getElementById("comunicador");
let vida = document.querySelector(".vida");
let puntaje = document.querySelector(".puntaje");
let puntajeAnterior = document.getElementById("puntajeAnterior");
let gameOverContainer = document.querySelector('.gameOver');
let inicioJuegoContainer = document.querySelector('.inicio');
let manualJuegoContainer = document.querySelector('.manual');
let juegoContainer = document.getElementById("contenedor");
let jugarDeNuevoBtn = document.getElementById('jugarDeNuevo');
let manualJuegoBtn = document.getElementById('manualJuego');
let iniciarJuego = document.querySelectorAll('.iniciarJuego');
/*
--------------------------------------
VARIABLES DE CONTROL JUEGO
--------------------------------------
*/
const prendaColisionEnemigo = 400;
const premioVidaLLena = 1000;
const pjPrincipal = document.getElementById('pibe');
let in_game = false;
let in_gameOver = false;

let tiempoGeneracionEnemigo = 5000;
let tiempoVelocidadEnemigo = 10000;
let velocidadEnemigo = 1.9;
let minTiempoEnemigo = 2;
let maxTiempoEnemigo = 8;
let counterEnemigo = 0;
let intervalGeneracionEnemigo;
let intervalVelocidadEnemigo;
let intervalCofre;
let tiempoCofre = 10000;


let vidaValues = 4;
let puntajeActual = 1;
let runner = new Runner();
let cofre = null;
let enemigo = null;
let enemigos = [];
let colisionEnemigo = false;
let colisionCofre = false;
let golpeEnemigo = false;
let banderaEnemigo = false;
let banderaCofre = false;


/*
--------------------------------------
SONIDOS
--------------------------------------
*/
const manejadorAudio = new ManejadorAudio();
/*
--------------------------------------
MANEJANDO EVENTOS DEL USUARIO
--------------------------------------
*/
for (let btnInicio of iniciarJuego) {
    btnInicio.addEventListener('click', () => {
        manejadorAudio.sonarPrincipal();
        inicioJuegoContainer.classList.add("desaparecer");
        if (!manualJuegoContainer.classList.contains('desaparecer')) {
            manualJuegoContainer.classList.add('desaparecer');
        }
        juegoContainer.classList.remove("desaparecer");

        intervalGeneracionEnemigo = setInterval(() => {
            generarEnemigo();
        }, tiempoGeneracionEnemigo);

        intervalCofre = setInterval(() => {
            generarCofre();
        }, tiempoCofre);

        intervalVelocidadEnemigo = setInterval(() => {
            if (velocidadEnemigo < 1.1) {
                clearInterval(intervalVelocidadEnemigo);
                return;
            }
            velocidadEnemigo = velocidadEnemigo - 0.1;
        }, tiempoVelocidadEnemigo);

        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowUp" && in_game) {
                runner.saltar();
            }
        });

        in_game = true;
        gameLoop();
    })
}

manualJuegoBtn.addEventListener('click', () => {
    inicioJuegoContainer.classList.add('desaparecer');
    manualJuegoContainer.classList.remove('desaparecer');
});

jugarDeNuevoBtn.addEventListener('click', () => {
    //removemos el cofre si lo hay
    if (cofre) {
        juegoContainer.removeChild(cofre.getNode());
    }
    cofre = null;
    //removemos el estado del enemigo
    if (enemigo) {
        juegoContainer.removeChild(enemigo.getNode());
    }
    enemigo = null;
    //reseteamos el puntaje
    puntajeActual = 1;
    //reseteamos la vida
    vidaValues = 4;
    vida.style.backgroundPosition = '0px';
    //desaparecemos la pantalla de gameOver
    gameOverContainer.classList.add('desaparecer');
    //reseteamos el comunicador
    comunicador.classList.add('desaparecer');
    comunicador.classList.remove('choqueEnemigo');
    //aparecemos la pantalla del juego
    juegoContainer.classList.remove('desaparecer');
    //activamos la musica
    manejadorAudio.sonarPrincipal();
    //resewteamos el interval
    tiempoGeneracionEnemigo = 5000;
    velocidadEnemigo = 1.9;
    intervalGeneracionEnemigo = setInterval(() => {
        generarEnemigo();
    }, tiempoGeneracionEnemigo);

    intervalCofre = setInterval(() => {
        generarCofre();
    }, tiempoCofre);

    intervalVelocidadEnemigo = setInterval(() => {
        if (velocidadEnemigo < 1.1) {
            clearInterval(intervalVelocidadEnemigo);
            return;
        }
        velocidadEnemigo = velocidadEnemigo - 0.1;
    }, tiempoVelocidadEnemigo);

    //volvemos a jugar
    in_game = true;
    gameLoop();
})

/*
--------------------------------------
INICIADOR EL JUEGO
--------------------------------------
*/
gameLoop();
/*
--------------------------------------
FUNCIONES DEL GAME LOOP
--------------------------------------
*/
function gameLoop() {
    limpiarEnemigosPasados();
    limpiarCofre();

    actualizar_estado();

    if (puntajeActual <= 0) {
        in_game = false;
        in_gameOver = true;
        puntajeActual = 0;
    }

    if (in_game) {
        requestAnimationFrame(gameLoop);
    } else if (in_gameOver) {
        manejadorAudio.pararPrincipal();
        juegoContainer.classList.add('desaparecer');
        gameOverContainer.classList.remove('desaparecer');
        puntajeAnterior.innerHTML = puntajeActual;
        clearInterval(intervalGeneracionEnemigo);
        clearInterval(intervalCofre);
    }
}

function actualizar_estado() {
    verificarColisiones();

    demostrarNuevoEstado();

    puntaje.textContent = puntajeActual++;
}

function verificarColisiones() {
    if (enemigo && !banderaEnemigo) {
        let statusEnemigo = enemigo.status();
        let statusRunner = runner.status();
        //acoto el calculo de la colision a un punto cerca al runner
        if (statusEnemigo.left > 100 && statusEnemigo.left < statusRunner.left + 100) {
            let colision = enemigo.detectarColision(runner);
            if (colision) {
                if (pjPrincipal.classList.contains("caer")) {
                    golpeEnemigo = true;
                } else {
                    colisionEnemigo = true;
                }
            }
        };
    }

    if (cofre && !banderaCofre) {
        let statusRunner = runner.status();
        let statusCofre = cofre.status();

        if (statusCofre.left > 100 && statusCofre.left < statusRunner.left + 100) {
            colisionCofre = cofre.detectarColision(runner);
        }
    }
}

function demostrarNuevoEstado() {
    if (colisionCofre) {
        if (!banderaCofre) {
            aumentarVida();
            juegoContainer.removeChild(cofre.getNode());
            cofre = null;
        }
        banderaCofre = true;
        colisionCofre = false;
    }

    if (colisionEnemigo) {
        //Cuando colisione por primera ves la bandera = false
        if (!banderaEnemigo) {
            mostrarComunicador();
            disminuirVida();
            comunicador.removeEventListener("animationend", () => { });
        }
        //Luego de actualizar la vida por primera vez hacemos bandera = true
        //para poder controlar una colision por enemigo
        banderaEnemigo = true;
        colisionEnemigo = false;
    } else if (golpeEnemigo) {
        if (!banderaEnemigo) {
            enemigo.morir();
            puntajeActual = puntajeActual + prendaColisionEnemigo;
        }
        banderaEnemigo = true;
        golpeEnemigo = false;
    }
}

/*
--------------------------------------
FUNCIONES DE EXPERIENCIA DE USUARIO
--------------------------------------
*/

function mostrarComunicador() {
    comunicador.classList.remove('desaparecer');
    comunicador.classList.add('choqueEnemigo');
    comunicador.addEventListener("animationend", () => {
        comunicador.classList.add('desaparecer');
        comunicador.classList.remove('choqueEnemigo');
    });
}

function disminuirVida() {

    switch (vidaValues) {
        case 4:
            vida.style.backgroundPosition = "-80px";
            vidaValues = 3;
            puntajeActual -= prendaColisionEnemigo;
            break;
        case 3:
            vida.style.backgroundPosition = "-160px";
            vidaValues = 2;
            puntajeActual -= prendaColisionEnemigo;
            break;
        case 2:
            vida.style.backgroundPosition = "-240px";
            vidaValues = 1;
            puntajeActual -= prendaColisionEnemigo;
            break;
        case 1:
            manejadorAudio.sonarPerdio();
            in_game = false;
            in_gameOver = true;
            break;
        default:
            break;
    }

}

function aumentarVida() {

    switch (vidaValues) {

        case 4:
            puntajeActual += premioVidaLLena;
            break;
        case 3:
            vida.style.backgroundPosition = "0px";
            vidaValues = 4;
            break;
        case 2:
            vida.style.backgroundPosition = "-80px";
            vidaValues = 3;
            break;
        case 1:
            vida.style.backgroundPosition = "-160px";
            vidaValues = 2;
            break;
        default:
            break;
    }

}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function generarEnemigo() {

    clearInterval(intervalGeneracionEnemigo);
    intervalGeneracionEnemigo = setInterval(() => {
        generarEnemigo();
    }, tiempoGeneracionEnemigo);


    tiempoGeneracionEnemigo = getRandomArbitrary(minTiempoEnemigo * 1000, maxTiempoEnemigo * 1000);

    //Cuando apareza un Enemigo habilitaremos una nueva colision
    banderaEnemigo = false;

    enemigo = new Enemigo(velocidadEnemigo);
    enemigos.push(enemigo);

}

function generarCofre() {
    cofre = new Cofre();
    banderaCofre = false;
}

function limpiarCofre() {
    if (cofre) {
        if (cofre.status().left < 0) {
            juegoContainer.removeChild(cofre.getNode());
            cofre = null;
        }
    }
}

function limpiarEnemigosPasados() {
    enemigos.forEach(iteEnemigo => {

        if (iteEnemigo.status().left < 0 - iteEnemigo.status().width) {
            juegoContainer.removeChild(iteEnemigo.getNode());
        }
    });
}