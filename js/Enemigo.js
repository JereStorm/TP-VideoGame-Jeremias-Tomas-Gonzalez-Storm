class Enemigo extends Personaje {

    constructor() {
        super();

        this.enemigo = document.createElement("div");
        this.enemigo.classList.add("enemigo");
        document.getElementById("contenedor").appendChild(this.enemigo);
    }

    status() {
        return this.enemigo.getBoundingClientRect();
    }

    getNode() {
        return this.enemigo;
    }

    morir() {
        this.enemigo.classList.add('enemigoMorir');
        this.enemigo.addEventListener("animationend", () => {
            document.getElementById("contenedor").removeChild(this.enemigo);
        })
    }
}