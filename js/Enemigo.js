class Enemigo extends ItemDinamico {

    constructor(velocidad) {
        super();

        this.enemigo = document.createElement("div");
        this.enemigo.classList.add("enemigo");
        this.velocidad = velocidad;

        let theRandomNumber = Math.floor(Math.random() * 10) + 1;

        if (theRandomNumber % 2 == 0) {
            this.enemigo.style.animation = `enemigo ${this.velocidad}s forwards ease-in, correrEnemigo .75s steps(17) infinite`;
        } else {
            this.enemigo.style.animation = `enemigo ${this.velocidad}s forwards ease-out, correrEnemigo .75s steps(17) infinite`;
        }

        document.getElementById("contenedor").appendChild(this.enemigo);
    }


    status() {
        return this.enemigo.getBoundingClientRect();
    }

    getNode() {
        return this.enemigo;
    }

    morir() {
        this.enemigo.style.animation = 'enemigoMorir 2s ease-in';
        this.enemigo.addEventListener("animationend", () => {
            document.getElementById("contenedor").removeChild(this.enemigo);
        })
    }
}