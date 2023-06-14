class Game {
    constructor(tickCallback, width, height) {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext("2d");

        this.lastTime = 0;
        this.canvas = canvas;
        this.ctx = ctx;
        this.cb = tickCallback;
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
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
