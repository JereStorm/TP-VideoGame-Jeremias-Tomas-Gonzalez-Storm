class Enemigo extends ItemDinamico {

    constructor(velocidad) {
        super();

        this.enemigo = document.createElement("div");
        this.enemigo.classList.add("enemigo");
        this.muerto = false;
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
            this.muerto = true;
        })
    }

    estaMuerto() {
        return this.muerto;
    }

    fueraDePantalla() {
        let statusActual = this.status();
        if (statusActual.left < 0 - statusActual.width) {
            return true;
        }
        return false;
    }

    detectarColision(otro) {
        let a = otro.status();
        let b = this.status();
        let colision = false;

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
        return colision;
    }
}