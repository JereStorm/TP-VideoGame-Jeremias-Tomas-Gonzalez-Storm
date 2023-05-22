"use strict";

/*
--------------------------------------
ELEMENTOS DE EXPERIENCIA DE USUARIO
--------------------------------------
*/

let comunicador = document.getElementById("comunicador");
let vida = null; //por implementar

/*
--------------------------------------
VARIABLES DE CONTROL JUEGO
--------------------------------------
*/
let in_game = true;
let contendor = document.getElementById("contenedor");
let runner = new Runner();
let enemigo = null;
let colision = false;

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

/*
--------------------------------------
INICIADOR EL JUEGO
--------------------------------------
*/
gameLoop();

setInterval(() => {
    generarEnemigo();
}, 5000);

/*
--------------------------------------
FUNCIONES DEL GAME LOOP
--------------------------------------
*/

function procesar_entrada_usuario() {
    if (enemigo) {
        let statusEnemigo = enemigo.status();
        let statusRunner = runner.status();
        //acoto el calculo de la colision a un punto cerca al runner
        if (statusEnemigo.left > 100 && statusEnemigo.left < statusRunner.left + 100) {
            // console.log("el enemigo esta cerca")
            detectarColision()
        };
    }

}

function actualizar_estado() {
    // actualizar estado
    if (colision) {
        console.log(colision);
        colision = false;
    }
}

function renderizar() {
    // dibujar juego
}

function gameLoop() {
    procesar_entrada_usuario();
    actualizar_estado();
    renderizar();

    if (in_game) {
        requestAnimationFrame(gameLoop);
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
        colision = true;
    }
}

function generarEnemigo() {
    if (enemigo) {
        contendor.removeChild(enemigo.getNode());
    }

    enemigo = new Enemigo();
}