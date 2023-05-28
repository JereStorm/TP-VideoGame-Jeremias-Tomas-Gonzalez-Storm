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
            r: b.left + b.width - 80,
            b: b.top + b.height - 80
        };

        //Detecta si se superponen las áreas
        if (a_pos.l <= b_pos.r && a_pos.r >= b_pos.l
            && a_pos.b >= b_pos.t && a_pos.t <= b_pos.b) {
            colision = true;
        }
        return colision
    }
}