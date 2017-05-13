const Emitter = require('./Emitter');
const { Vector, MathHelper }  = require('../math');
const { FireParticle } = require('../particle');

class FireEmitter extends Emitter {
    constructor(position, angle) {
        const mag = 3;
        const ang = angle || 3 * Math.PI / 2;
        const velocity = new Vector().fromAngle(ang, mag);
        const spread = Math.PI / 7;
        super(position, velocity, spread, 2, 200);
        this.rotation -= Math.PI / 2;
    }

    createParticle(position, velocity) {
        return new FireParticle(
            position,
            velocity,
            null,
            MathHelper.randomBetween(20, 60)
        )
    }
}

module.exports = FireEmitter;
