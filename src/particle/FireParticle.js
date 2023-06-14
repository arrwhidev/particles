const Particle = require('./Particle');
const { Texture } = require('../texture');

/**
 * Fire like particle using a texture.
 */
class FireParticle extends Particle {
    constructor(position, velocity, acceleration, life) {
        super(position, velocity, acceleration, 32, life);
        this.maxVelocity = 10;
        this.colour = [240, 100, 20, 0.8];
        this.scale = 0.8;
    }

    update(dt, particleSystem) {
        super.update(dt, particleSystem);
        this.scale -= 0.005
        return this;
    }

    render(ctx) {
        const canvas2 = document.getElementById('fire_particle');
        const ctx2 = canvas2.getContext("2d");

        const renderWidth = this.size * this.scale;
        const renderHeight = this.size * this.scale;
        const renderX = this.position.x - (renderWidth / 2);
        const renderY = this.position.y - (renderHeight / 2);

        ctx2.clearRect(0, 0, this.size, this.size);
        ctx2.globalAlpha = this.colour[3];
        ctx2.drawImage(Texture, 0, 0);

        ctx2.globalCompositeOperation = "source-atop";
        ctx2.fillStyle = `rgba(${this.colour[0]}, ${this.colour[1]}, ${this.colour[2]}, 1)`;
        ctx2.fillRect(0, 0, this.size, this.size);

		// reset the buffer's context for the next time we draw the particle
		ctx2.globalCompositeOperation = "source-over";
		ctx2.globalAlpha = 1;

        // Render real particle now.
        ctx.globalCompositeOperation = 'lighter';
        ctx.drawImage(canvas2, 0, 0, this.size, this.size, renderX, renderY, renderWidth, renderHeight);
    }
}

module.exports = FireParticle;
