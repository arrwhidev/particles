class Game {
    constructor(tickCallback, onClickCallback) {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext("2d");

        this.lastTime = 0;
        this.canvas = canvas;
        this.ctx = ctx;
        this.cb = tickCallback;

        this.updateCanvasSize();
    }

    updateCanvasSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    tick(timestamp) {
        const delta = (timestamp - (this.lastTime || 0)) / 1000;
        this.lastTime = timestamp;
        this.cb(delta, this.ctx);
        window.requestAnimationFrame(this.tick.bind(this));
    }

    start() {
        window.requestAnimationFrame(this.tick.bind(this));
    }
}

module.exports = Game;
