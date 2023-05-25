class ManejadorAudio {
    constructor() {
        this.principal = new Audio();
        this.principal.src = "/music/temaPrincipal.mp3";
        this.perdio = new Audio();
        this.perdio.src = "/music/perdio.mp3";
    }


    sonarPrincipal() {
        this.principal.play();
        this.principal.volume = 0.5;
    }
    pararPrincipal() {
        this.principal.volume = 0;
        this.principal.pause();
        this.principal.currentTime = 0;
    }

    sonarPerdio() {
        this.perdio.play();
    }
}