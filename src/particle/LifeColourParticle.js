const Particle = require('./Particle');

/**
 * Particle that transitions between two colours across it's life.
 */
class LifeColourParticle extends Particle {
    constructor(position, velocity, acceleration, size, life, startColour, endColour) {
        super(position, velocity, acceleration, size, life);
        this.startColour = startColour;
        this.endColour = endColour;
        this.colour = Array.from(this.startColour);

        const shortenedLife = this.life - (this.life / 5);
        this.deltaColour = [
            (this.endColour[0] - this.startColour[0]) / shortenedLife,
        	(this.endColour[1] - this.startColour[1]) / shortenedLife,
        	(this.endColour[2] - this.startColour[2]) / shortenedLife,
            (this.endColour[3] - this.startColour[3]) / shortenedLife
        ];
    }

    update(dt, particleSystem) {
        super.update(dt, particleSystem);
        if (this.startColour && this.endColour) {
            this.colour[0] = Math.round(this.colour[0] + this.deltaColour[0]);
            this.colour[1] = Math.round(this.colour[1] + this.deltaColour[1]);
            this.colour[2] = Math.round(this.colour[2] + this.deltaColour[2]);
            this.colour[3] = this.colour[3] + this.deltaColour[3];
        }

        return this;
    }
}

module.exports = LifeColourParticle;
