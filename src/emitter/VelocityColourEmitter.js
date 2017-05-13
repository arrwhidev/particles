const Emitter = require('./Emitter');
const { VelocityColourParticle } = require('../particle');
const { MathHelper }  = require('../math');

class VelocityColourEmitter extends Emitter {
    constructor(position, velocity, spread, rate, max, life) {
        super(position, velocity, spread, rate, max, life);
    }

    createParticle(position, velocity) {
        return new VelocityColourParticle(
            position,
            velocity,
            null,
            this.size,
            this.life,
            this.colour
        )
    }
}

module.exports = VelocityColourEmitter;
