const { Vector, MathHelper }  = require('../math');
const { LifeColourParticle, Particle } = require('../particle');
const { dataset } = require('../texture/Texture');

class Emitter {
    constructor(position, velocity, spread, rate, max, life, startColour, endColour, size, rotation) {
        this.position = position;
        this.velocity = velocity;
        this.spread = spread || 0;
        this.rate = rate || 2;
        this.max = max || 1000;
        this.life = life || 350;
        this.startColour = startColour || [0, 230, 230, 1];
        this.endColour = endColour || [230, 30, 100, 1];
        this.size = size || 2;
        this.radius = 3;
        this.particles = [];
        this.edges = [];
        this.rotation = rotation || 0;
    }

    maybeEmit() {
        if (this.particles.length < this.max - this.rate) {
            for (let i = 0; i < this.rate; i++) {
                const angle = this.velocity.getAngle() + this.spread - (Math.random() * this.spread * 2);
                const magnitude = this.velocity.getMagnitude();
                const position = this.position.clone();
                const velocity = new Vector().fromAngle(angle, magnitude);
                this.particles.push(this.createParticle(position, velocity));
            }
        }
    }

    createParticle(position, velocity) {
        return new LifeColourParticle(
            position,
            velocity,
            null,
            this.size,
            this.life * (Math.random() * (1.5 - 1.0) + 1.0), // randomize the life of each particle
            this.startColour,
            this.endColour
        )
    }

    update(dt, particleSystem) {
        this.updateRotation(dt);
        this.maybeEmit();
        this.particles = this.particles
            .map(p => p.update(dt, particleSystem))
            .filter(p => p.life > 0);

        if (particleSystem.enableEdges) {
            this.updateEdges(dt, particleSystem);
        }
    }

    updateRotation() {
        if (this.rotation > Math.PI * 2) this.rotation -= Math.PI * 2
        this.velocity.rotateAroundSelf(this.rotation)
    }

    updateEdges(dt, particleSystem) {
        this.edges = [];
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                if (MathHelper.near(p.position, p2.position, particleSystem.edgeThreshold)) {
                    this.edges.push({ from: p.position, to: p2.position });
                }
            }
        }
    }

    render(ctx, particleSystem) {
        // Render emitter
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();

        // Render particles & edges.
        this.particles.forEach(p => p.render(ctx))
        if (particleSystem.enableEdges) {
            this.renderEdges(ctx, particleSystem);
        }
    }

    edgeColour(a) {
        // TODO: Currently can't change edge colour.
        return `rgba(0, 187, 211, ${a})`;
    }

    renderEdges(ctx, particleSystem) {
        this.edges.forEach(e => {
            const a = MathHelper.getDistancePercent(e.from, e.to, particleSystem.edgeThreshold);
            ctx.strokeStyle = this.edgeColour(a);
            ctx.beginPath();
            ctx.moveTo(e.from.x, e.from.y);
            ctx.lineTo(e.to.x, e.to.y);
            ctx.stroke();
        });
    }
}

module.exports = Emitter;
