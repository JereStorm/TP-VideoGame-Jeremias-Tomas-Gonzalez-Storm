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
let gameOver = document.querySelector('.gameOver');
let jugarDeNuevo = document.getElementById('jugarDeNuevo');
/*
--------------------------------------
VARIABLES DE CONTROL JUEGO
--------------------------------------
*/
const prendaColisionEnemigo = 100;
let in_game = true;
let tiempoEnemigo = 5000;
let contendor = document.getElementById("contenedor");
let vidaValues = 4;
let puntajeActual = 1;
let runner = new Runner();
let enemigo = null;
let colisionEnemigo = false;
let bandera = false;

/*
--------------------------------------
MANEJANDO EVENTOS DEL USUARIO
--------------------------------------
*/

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
        runner.saltar();
    }
});

jugarDeNuevo.addEventListener('click', () => {
    //reseteamos el estado del enemigo
    if (enemigo) {
        contendor.removeChild(enemigo.getNode());
    }
    enemigo = null;
    //reseteamos el puntaje
    puntajeActual = 1;
    //reseteamos la vida
    vidaValues = 4;
    actualizarVida();
    //desaparecemos la pantalla de gameOver
    gameOver.classList.add('desaparecer');
    //reseteamos el comunicador
    comunicador.classList.add('desaparecer');
    comunicador.classList.remove('choqueEnemigo');
    //aparecemos la pantalla del juego
    contendor.classList.remove('desaparecer');
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

setInterval(() => {
    generarEnemigo();
}, tiempoEnemigo);

/*
--------------------------------------
FUNCIONES DEL GAME LOOP
--------------------------------------
*/

function procesar_entrada_usuario() {
    if (enemigo && !bandera) {
        let statusEnemigo = enemigo.status();
        let statusRunner = runner.status();
        //acoto el calculo de la colision a un punto cerca al runner
        if (statusEnemigo.left > 100 && statusEnemigo.left < statusRunner.left + 100) {
            // console.log("el enemigo esta cerca")
            detectarColision();
        };
    }
}

function actualizar_estado() {
    if (colisionEnemigo) {
        //Cuando colisione por primera ves la bandera = false
        if (!bandera) {
            mostrarComunicador();
            actualizarVida();
            if (vidaValues > 0) {
                puntajeActual = puntajeActual - prendaColisionEnemigo;
            }
            comunicador.removeEventListener("animationend", () => { });
        }
        //Luego de actualizar la vida por primera vez hacemos bandera = true
        //para poder controlar una colision por enemigo
        bandera = true;
        colisionEnemigo = false;
    }

}

function renderizar() {
    puntaje.textContent = puntajeActual++;
}

function gameLoop() {
    procesar_entrada_usuario();

    actualizar_estado();

    renderizar();

    if (puntajeActual <= 0) {
        in_game = false;
        puntajeActual = 0;
    }

    if (in_game) {
        requestAnimationFrame(gameLoop);
    } else {
        contendor.classList.add('desaparecer');
        gameOver.classList.remove('desaparecer');
        puntajeAnterior.innerHTML = puntajeActual;
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
            break;
        case 2:
            vida.style.backgroundPosition = "-160px";
            vidaValues = 1;
            break;
        case 1:
            vida.style.backgroundPosition = "-240px";
            vidaValues = 0;
            break;
        case 0:
            in_game = false;
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
        colisionEnemigo = true;
    }
}

function generarEnemigo() {
    if (enemigo) {
        contendor.removeChild(enemigo.getNode());
    }

    enemigo = new Enemigo();
    //Cuando apareza un Enemigo habilitaremos una nueva colision
    bandera = false;
}