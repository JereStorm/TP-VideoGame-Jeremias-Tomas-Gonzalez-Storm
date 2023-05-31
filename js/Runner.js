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
            console.log("saltando")

            setTimeout(() => {
                console.log("salto")
                this.caer();
            }, 750);
        }
    }
    caer() {
        this.clean();
        this.personaje.classList.add("caer");


        console.log("cayendo")
        setTimeout(() => {
            console.log("cayo");
            this.correr();
        }, 550);
    }

    clean() {
        this.personaje.classList.remove("correr");
        this.personaje.classList.remove("saltar");
        this.personaje.classList.remove("caer");
        this.personaje.removeEventListener("animationend", () => { });
    }
}