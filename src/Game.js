class Game {
    constructor(tickCallback, onClickCallback) {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext("2d");

        this.lastTime = 0;
        this.canvas = canvas;
        this.ctx = ctx;
        this.cb = tickCallback;

        this.updateCanvasSize();
        this.setupStats();
    }

    updateCanvasSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupStats() {
        if (window.Stats !== undefined) {
            this.stats = new Stats();
            this.stats.showPanel(0);
            const el = document.getElementById('stats');
            if (el) {
                el.appendChild(this.stats.domElement);
            }
        } else {
            this.stats = {};
        }
    }

    tick(timestamp) {
        this.stats.begin();

        const delta = (timestamp - (this.lastTime || 0)) / 1000;
        this.lastTime = timestamp;
        this.cb(delta, this.ctx);
        window.requestAnimationFrame(this.tick.bind(this));

        this.stats.end();
    }

    start() {
        window.requestAnimationFrame(this.tick.bind(this));
    }
}

module.exports = Game;
