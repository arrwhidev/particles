const Emitter = require('./Emitter');
const { MathHelper }  = require('../math');

class RainbowEmitter extends Emitter {
    constructor(position, velocity, spread, rate, max, life) {
        super(position, velocity, spread, rate, max, life);
    }

    maybeEmit() {
        this.colour = [
            MathHelper.randomBetween(0, 255),
            MathHelper.randomBetween(0, 255),
            MathHelper.randomBetween(0, 255),
            1
        ]
        super.maybeEmit();
    }
}

module.exports = RainbowEmitter;
