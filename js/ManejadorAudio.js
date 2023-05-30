class ManejadorAudio {
    constructor() {
        this.principal = new Audio();
        this.principal.src = "/music/temaPrincipal.mp3";
        this.perdio = new Audio();
        this.perdio.src = "/music/perdio.mp3";
        this.salto = new Audio();
        this.salto.src = "/music/salto.mp3";
        this.golpe = new Audio();
        this.golpe.src = "/music/golpe.mp3";
        this.bonus = new Audio();
        this.bonus.src = "/music/bonus.mp3";
        this.boton = new Audio();
        this.boton.src = "/music/boton.mp3";
        this.muereEnemigo = new Audio();
        this.muereEnemigo.src = "/music/muereEnemigo.mp3";
    }


    sonarPrincipal() {
        this.principal.play();
        this.principal.volume = 0.8;
    }
    pararPrincipal() {
        this.principal.volume = 0;
        this.principal.pause();
        this.principal.currentTime = 0;
    }

    sonarPerdio() {
        this.perdio.currentTime = 0.3;
        this.perdio.play();
    }

    sonarSalto() {
        this.salto.play();
    }
    sonarBonus() {
        this.bonus.play();
    }
    sonarGolpe() {
        this.golpe.currentTime = 0.3;
        this.golpe.play();
    }
    sonarMuereEnemigo() {
        this.muereEnemigo.currentTime = 0.5;
        this.muereEnemigo.play();
    }
    sonarBoton() {
        this.boton.play();
    }
}