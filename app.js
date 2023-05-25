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
let juegoContainer = document.getElementById("contenedor");
let jugarDeNuevo = document.getElementById('jugarDeNuevo');
let iniciarJuego = document.getElementById('iniciarJuego');
/*
--------------------------------------
VARIABLES DE CONTROL JUEGO
--------------------------------------
*/
const prendaColisionEnemigo = 300;
let in_game = false;
let in_gameOver = false;
const pjPrincipal = document.getElementById('pibe');

let tiempoEnemigo = 5000;
let minTiempoEnemigo = 1;
let maxTiempoEnemigo = 8;
let counterEnemigo = 0;
let intervalEnemigo;


let vidaValues = 4;
let puntajeActual = 1;
let runner = new Runner();
let enemigo = null;
let colisionEnemigo = false;
let golpeEnemigo = false;
let bandera = false;


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
iniciarJuego.addEventListener('click', () => {
    manejadorAudio.sonarPrincipal();
    inicioJuegoContainer.classList.add("desaparecer");
    juegoContainer.classList.remove("desaparecer");
    in_game = true;
    gameLoop();

    intervalEnemigo = setInterval(() => {
        generarEnemigo();
    }, tiempoEnemigo);

    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowUp" && in_game) {
            runner.saltar();
        }
    });
})

jugarDeNuevo.addEventListener('click', () => {
    //reseteamos el estado del enemigo
    if (enemigo) {
        juegoContainer.removeChild(enemigo.getNode());
    }
    enemigo = null;
    //reseteamos el puntaje
    puntajeActual = 1;
    //reseteamos la vida
    vidaValues = 4;
    actualizarVida();
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
    tiempoEnemigo = 5000;
    intervalEnemigo = setInterval(() => {
        generarEnemigo();
    }, tiempoEnemigo);

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
actualizarVida();
/*
--------------------------------------
FUNCIONES DEL GAME LOOP
--------------------------------------
*/

function actualizar_estado() {
    if (enemigo && !bandera) {
        let statusEnemigo = enemigo.status();
        let statusRunner = runner.status();
        //acoto el calculo de la colision a un punto cerca al runner
        if (statusEnemigo.left > 100 && statusEnemigo.left < statusRunner.left + 100) {
            // console.log("el enemigo esta cerca")
            detectarColision();
        };
    }

    if (colisionEnemigo) {
        //Cuando colisione por primera ves la bandera = false
        if (!bandera) {
            mostrarComunicador();
            actualizarVida();
            comunicador.removeEventListener("animationend", () => { });
        }
        //Luego de actualizar la vida por primera vez hacemos bandera = true
        //para poder controlar una colision por enemigo
        bandera = true;
        colisionEnemigo = false;
    } else if (golpeEnemigo) {
        if (!bandera) {
            enemigo.morir();
            puntajeActual = puntajeActual + prendaColisionEnemigo;
        }
        bandera = true;
        golpeEnemigo = false;
    }

    puntaje.textContent = puntajeActual++;
}


function gameLoop() {
    if (enemigo) {
        if (enemigo.status().left < 0 - enemigo.status().width) {
            juegoContainer.removeChild(enemigo.getNode());
        }
    }

    actualizar_estado();

    if (puntajeActual <= 0) {
        in_game = false;
        puntajeActual = 0;
    }

    if (in_game) {
        requestAnimationFrame(gameLoop);
    } else if (in_gameOver) {
        manejadorAudio.pararPrincipal();
        juegoContainer.classList.add('desaparecer');
        gameOverContainer.classList.remove('desaparecer');
        puntajeAnterior.innerHTML = puntajeActual;
        clearInterval(intervalEnemigo);
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

function actualizarVida() {

    switch (vidaValues) {
        case 4:
            vida.style.backgroundPosition = "0px";
            vidaValues = 3;
            break;
        case 3:
            vida.style.backgroundPosition = "-80px";
            vidaValues = 2;
            puntajeActual -= prendaColisionEnemigo;
            break;
        case 2:
            vida.style.backgroundPosition = "-160px";
            vidaValues = 1;
            puntajeActual -= prendaColisionEnemigo;
            break;
        case 1:
            vida.style.backgroundPosition = "-240px";
            vidaValues = 0;
            puntajeActual -= prendaColisionEnemigo;
            break;
        case 0:
            manejadorAudio.sonarPerdio();
            in_game = false;
            in_gameOver = true;
            break;
        default:
            break;
    }

}
function detectarColision() {

    let a = runner.status();
    let b = enemigo.status();

    let a_pos = {
        t: a.top,
        l: a.left,
        r: a.left + a.width - 100,
        b: a.top + a.height - 100
    };
    let b_pos = {
        t: b.top,
        l: b.left,
        r: b.left + b.width - 100,
        b: b.top + b.height - 100
    };

    //Detecta si se superponen las áreas
    if (a_pos.l <= b_pos.r && a_pos.r >= b_pos.l
        && a_pos.b >= b_pos.t && a_pos.t <= b_pos.b) {

        if (pjPrincipal.classList.contains("caer")) {
            golpeEnemigo = true
        } else {
            colisionEnemigo = true;
        }
    }
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function generarEnemigo() {

    clearInterval(intervalEnemigo);
    intervalEnemigo = setInterval(() => {
        generarEnemigo();
    }, tiempoEnemigo);


    tiempoEnemigo = getRandomArbitrary(minTiempoEnemigo * 1000, maxTiempoEnemigo * 1000);
    // console.log(tiempoEnemigo, minTiempoEnemigo, maxTiempoEnemigo)






    enemigo = new Enemigo();
    //Cuando apareza un Enemigo habilitaremos una nueva colision
    bandera = false;
}