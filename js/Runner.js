class Runner extends ItemDinamico {

    constructor() {
        super();
        this.personaje = document.getElementById("pibe");
    }

    status() {
        return this.personaje.getBoundingClientRect();
    }

    correr() {
        this.clean();
        this.personaje.classList.add("correr");
    }

    saltar() {
        if (this.personaje.classList.contains("correr")) {
            this.clean();

            this.personaje.classList.add("saltar");

            setTimeout(() => {
                this.caer();
            }, 605);
        }
    }
    caer() {
        this.clean();
        this.personaje.classList.add("caer");

        setTimeout(() => {
            this.correr();
        }, 505);
    }

    clean() {
        this.personaje.classList.remove("correr");
        this.personaje.classList.remove("saltar");
        this.personaje.classList.remove("caer");
    }
}