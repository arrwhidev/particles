class ParticleSystem {
    constructor() {
        this.enableEdges = false;
        this.edgeThreshold = 20;
        this.bgColour = 'rgba(0,0,0,1)';
        this.blendingMode = 'source-over';
        this.clear();
    }

    clear() {
        this.fields = [];
        this.emitters = [];
    }

    addField(field) {
        this.fields.push(field)
    }

    addEmitter(emitter) {
        this.emitters.push(emitter)
    }

    update(dt) {
        this.fields.forEach(f => f.update(dt, this))
        this.emitters.forEach(e => e.update(dt, this))
    }

    render(ctx) {
        this.clearScreen(ctx);
        this.fields.forEach(f => f.render(ctx, this))
        this.emitters.forEach(e => e.render(ctx, this))
    }

    clearScreen(ctx) {
        ctx.globalCompositeOperation = this.blendingMode;
        ctx.fillStyle = this.bgColour;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
}

module.exports = ParticleSystem;
