"use strict";

/*
----------------------------------------------------------------------------
-------------------- ELEMENENTOS DEL DOM (EXP DE USUARIO) ------------------
----------------------------------------------------------------------------
*/
const pjPrincipal = document.getElementById('pibe');
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
let botonesDOM = document.querySelectorAll("button");
for (let boton of botonesDOM) {
    boton.addEventListener('mouseover', () => {
        manejadorAudio.sonarBoton();
    })
}
/*
----------------------------------------------------------------------------
----------------------- VARIABLES DE CONTROL JUEGO -------------------------
----------------------------------------------------------------------------
*/
const prendaColisionEnemigo = 400;
const premioVidaLLena = 1000;
let vidaValues = 4;
let puntajeActual = 1;

//----------------------
//  ESTADOS DEL JUEGO
//----------------------
let in_game = false;
let in_gameOver = false;

//----------------------
//  TIEMPOS
//----------------------
let tiempoGeneracionEnemigo = 5000;
let minTiempoGeneracionEnemigo = 2;
let maxTiempoGeneracionEnemigo = 8;
let tiempoVelocidadEnemigo = 10000;
let tiempoCofre = 12000;
let velocidadEnemigo = 1.9;
let limiteVelocidadEnemigo = 1.1;

//----------------------
//  VARIABLES DE INTERVALOS
//----------------------
let intervalGeneracionEnemigo;
let intervalVelocidadEnemigo;
let intervalCofre;

//----------------------
//  ITEMS DINAMICOS
//----------------------
let runner = new Runner();
let cofre = null;
let cofres = [];
let enemigo = null;
let enemigos = [];

//----------------------
//  COLISIONES
//----------------------
let colisionEnemigo = false;
let colisionCofre = false;
let golpeEnemigo = false;

//----------------------
//  BANDERAS DE INTERACCION
//----------------------
let banderaEnemigo = false;
let banderaCofre = false;

/*
----------------------------------------------------------------------------
-------------------------------- SONIDOS -----------------------------------
----------------------------------------------------------------------------
*/
const manejadorAudio = new ManejadorAudio();

/*
----------------------------------------------------------------------------
---------------------------- MANEJANDO EVENTOS -----------------------------
----------------------------------------------------------------------------
*/
for (let btnInicio of iniciarJuego) {
    btnInicio.addEventListener('click', () => {
        //Comienza la cancion del juego
        manejadorAudio.sonarPrincipal();
        //Desaparezco la pantalla del menu del juego
        inicioJuegoContainer.classList.add("desaparecer");
        //Si estaba en el manual desaparezco esa pantalla
        if (!manualJuegoContainer.classList.contains('desaparecer')) {
            manualJuegoContainer.classList.add('desaparecer');
        }
        //Se muestra la pantalla del juego
        juegoContainer.classList.remove("desaparecer");

        //Seteo el intervalo que generara los enemigos
        intervalGeneracionEnemigo = setInterval(() => {
            generarEnemigo();
        }, tiempoGeneracionEnemigo);

        //Seteo el intervalo que generara los cofres
        intervalCofre = setInterval(() => {
            generarCofre();
        }, tiempoCofre);

        //Seteo el intervalo que hara mas rapidos a los enemigos
        intervalVelocidadEnemigo = setInterval(() => {
            //Caso de corte del interval
            if (velocidadEnemigo < limiteVelocidadEnemigo) {
                clearInterval(intervalVelocidadEnemigo);
                return;
            }
            //aumenta la velocidadEnemigo
            velocidadEnemigo = velocidadEnemigo - 0.1;
        }, tiempoVelocidadEnemigo);

        //Se escucha cuando el usuario presiona la tecla arrowUp
        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowUp" && in_game) {
                manejadorAudio.sonarSalto();
                runner.saltar();
            }
        });

        //Comenzamos el juego
        in_game = true;
        gameLoop();
    })
}

//Se muestra la pnatalla del manual de juego
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
    //removemos el enemigo si lo hay
    if (enemigo) {
        juegoContainer.removeChild(enemigo.getNode());
    }
    enemigo = null;
    enemigos = [];
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

    tiempoGeneracionEnemigo = 5000;
    velocidadEnemigo = 1.9;
    //reseteamos los intervalos
    intervalGeneracionEnemigo = setInterval(() => {
        generarEnemigo();
    }, tiempoGeneracionEnemigo);

    intervalCofre = setInterval(() => {
        generarCofre();
    }, tiempoCofre);

    intervalVelocidadEnemigo = setInterval(() => {
        if (velocidadEnemigo < limiteVelocidadEnemigo) {
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
----------------------------------------------------------------------------
------------------------- FUNCIONES DEL GAMELOOP ---------------------------
----------------------------------------------------------------------------
*/
function gameLoop() {
    //barremos los items que ya cumplieron su objetivo
    limpiarEnemigosPasados();
    limpiarCofre();

    //checkeamos el estado del juego y reaccionamos a partir de ahi
    actualizar_estado();

    //Si el jugador se quedo sin puntos terminamos el juego
    if (puntajeActual <= 0) {
        in_game = false;
        in_gameOver = true;
        puntajeActual = 0;
    }

    //chequeamos el estado actual del juego
    if (in_game) {
        requestAnimationFrame(gameLoop);
    } else if (in_gameOver) {
        //paramos la musica
        manejadorAudio.pararPrincipal();
        manejadorAudio.sonarPerdio();
        //desaparecemos la pantalla del juego
        juegoContainer.classList.add('desaparecer');
        //mostramos la pantalla de Game Over
        gameOverContainer.classList.remove('desaparecer');
        //segun la cuasa de que perdio el juego lo demostramos en pantalla
        if (puntajeActual == 0) {
            puntajeAnterior.innerHTML = '¡Te han dejado sin puntos!';

        } else {
            puntajeAnterior.innerHTML = puntajeActual;
        }
        //limpiamos los intervalos
        clearInterval(intervalGeneracionEnemigo);
        clearInterval(intervalCofre);
        clearInterval(intervalVelocidadEnemigo);
    }
}

function actualizar_estado() {
    //verificamos las colisiones
    verificarColisiones();

    //reaccionamos en base a las colisiones
    demostrarNuevoEstado();

    //Aumentamos el puntaje
    puntaje.textContent = puntajeActual++;
}

/**
 * Funcion encargada de verificar las colisiones cuando los distintos ItemDinamicos
 * esten disponibles...
 */
function verificarColisiones() {
    //Si esta el enemigo en pantalla y la bandera sigue en su estado inicial = (false)
    if (enemigo && !banderaEnemigo) {
        //detectamos la colision
        let colision = enemigo.detectarColision(runner);
        //Si colisiono
        if (colision) {
            //chequeamos que el pjPrincipal este cayendo (mecanica de matar al enemigo)
            if (pjPrincipal.classList.contains("caer")) {
                golpeEnemigo = true;
            } else {
                //Si no estaba cayendo, el enemigo daño al pjPrincipal
                colisionEnemigo = true;
            }
        }
    }

    //Si esta el cofre en pantalla y la bandera esta en su estado inicial = (false)
    if (cofre && !banderaCofre) {
        //detectamos la colision
        colisionCofre = cofre.detectarColision(runner);
    }

}

/**
 * Funcion encargada de demostrar el estado de las colsiones (si las hubo);
 */
function demostrarNuevoEstado() {
    if (colisionCofre) {
        //Cuando colisione por primera ves la bandera = false
        if (!banderaCofre) {
            manejadorAudio.sonarBonus();
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
            manejadorAudio.sonarGolpe();
            mostrarComunicador();
            disminuirVida();
            comunicador.removeEventListener("animationend", () => { });
        }
        //Luego de actualizar la vida por primera vez hacemos bandera = true
        //para poder controlar una colision por enemigo
        banderaEnemigo = true;
        colisionEnemigo = false;
    } else if (golpeEnemigo) {
        //Cuando colisione por primera ves la bandera = false
        if (!banderaEnemigo) {
            manejadorAudio.sonarMuereEnemigo();
            enemigo.morir();
            puntajeActual = puntajeActual + prendaColisionEnemigo;
        }
        //Luego de la primer interaccion hacemos bandera = true
        //para deshabilitar otra interaccion.
        banderaEnemigo = true;
        golpeEnemigo = false;
    }
}

/*
----------------------------------------------------------------------------
------------------ FUNCIONES DE EXPERIENCIA DE USUARIO ---------------------
----------------------------------------------------------------------------
*/

/**
 * Funcion encargada de demostrar en pantalla la colison del enemigo con el personaje principal
 */
function mostrarComunicador() {
    comunicador.classList.remove('desaparecer');
    comunicador.classList.add('choqueEnemigo');
    comunicador.addEventListener("animationend", () => {
        comunicador.classList.add('desaparecer');
        comunicador.classList.remove('choqueEnemigo');
    });
}

/**
 * Funcion encarda de disminuir la vida del pjPrincipal y imponer la multa sobre el puntaje
 */
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
            in_game = false;
            in_gameOver = true;
            break;
        default:
            break;
    }

}

/**
 * Funcion encargada de aumentar la vida o en su debido caso aplicar el premio correspondiente
 */
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

/**
 * Funcion encargada de obtener un random entre dos numeros
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Funcion encargada de generar Enemigos reseteando el intervalGeneracionEnemigo con un nuevo tiempo y
 * implicitamente habilitar las interacciones con el usuario (banderaEnemigo = false)
 */
function generarEnemigo() {

    //generamos un nuevo interval para el proximo enemigo
    clearInterval(intervalGeneracionEnemigo);
    intervalGeneracionEnemigo = setInterval(() => {
        generarEnemigo();
    }, tiempoGeneracionEnemigo);

    tiempoGeneracionEnemigo = getRandomArbitrary(minTiempoGeneracionEnemigo * 1000, maxTiempoGeneracionEnemigo * 1000);

    //Cuando apareza un Enemigo habilitaremos una nueva colision
    banderaEnemigo = false;
    enemigo = new Enemigo(velocidadEnemigo);
    enemigos.push(enemigo);

}

/**
 * Funcion encargada de generar cofres y habilitar nuevamente la interaccion de este con el pjPrincipal
 */
function generarCofre() {
    banderaCofre = false;
    cofre = new Cofre();
    cofres.push(cofre);
}

/**
 * Funcion encargada de limpiar los cofres cuando salen de la pantalla
 */
function limpiarCofre() {
    cofres.forEach((iteCofre, indice) => {
        if (iteCofre.status().left < 0) {
            juegoContainer.removeChild(cofre.getNode());
            cofres.splice(indice, 1);
            cofre = null;
        }
    })

}

/**
 * Funcion encargada de limpiar los enemigos ya sea porque se fueron de la pantalla o si murieron
 */
function limpiarEnemigosPasados() {
    enemigos.forEach((iteEnemigo, indice) => {
        if (iteEnemigo.fueraDePantalla() || iteEnemigo.estaMuerto()) {
            juegoContainer.removeChild(iteEnemigo.getNode());
            enemigos.splice(indice, 1);
        }
    });
}