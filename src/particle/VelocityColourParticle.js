const Particle = require('./Particle');

class VelocityColourParticle extends Particle {
    constructor(position, velocity, acceleration, size, life) {
        super(position, velocity, acceleration, size, life);
        this.maxVelocity = 10;
        this.colour = [255, 255, 255, 1];
    }

    update(dt, particleSystem) {
        super.update(dt, particleSystem);

        // Update colour against velocity magnitude.
        // RED = fast, BLUE = slow.
        const percentOfVelocity = this.velocity.getMagnitude() / this.maxVelocity;
        this.colour[0] = Math.round(255 * percentOfVelocity)
        this.colour[1] = 0;
        this.colour[2] = Math.round(255 - (255 * percentOfVelocity))
        this.colour[3] = 1;

        return this;
    }
}

module.exports = VelocityColourParticle;
