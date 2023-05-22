class Runner extends Personaje {

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



            this.personaje.addEventListener("animationend", () => {
                this.caer();
            });
        }
    }
    caer() {
        this.clean();
        this.personaje.classList.add("caer");

        this.personaje.addEventListener("animationend", () => {
            this.correr();
        });
    }

    /**
     * 
     */
    clean() {
        this.personaje.classList.remove("correr");
        this.personaje.classList.remove("saltar");
        this.personaje.classList.remove("caer");
        this.personaje.removeEventListener("animationend", () => { });
    }
}