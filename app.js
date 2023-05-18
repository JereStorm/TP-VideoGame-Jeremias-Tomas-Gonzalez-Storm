"use strict";

console.log('cargo');

document.addEventListener('keydown', () => {
    saltar();
});

let personaje = document.querySelector(".pibe");

function saltar() {
    personaje.classList.add("saltar");

    personaje.addEventListener("animationend", () => {
        caer();
    });
}

function caer() {

    personaje.classList.add("caer");
    personaje.addEventListener("animationend", () => {
        personaje.classList.remove("saltar");
        personaje.classList.remove("caer");
    });
}