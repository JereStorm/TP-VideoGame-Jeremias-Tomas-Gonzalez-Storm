class Cofre extends ItemDinamico {
    constructor() {
        super();
        this.util = document.createElement('div');
        this.util.classList.add('cofre');
        document.getElementById('contenedor').appendChild(this.util);
    }

    status() {
        return this.util.getBoundingClientRect();
    }

    getNode() {
        return this.util;
    }
}