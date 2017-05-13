const { Vector }  = require('../math');
const POS_MASS_COLOUR = '#02a8f3';
const NEG_MASS_COLOUR = '#f34235';

class Field {
    constructor(position, mass) {
        this.position = position || new Vector(0, 0);
        this.mass = mass || 100;
        this.radius = 5;
    }

    update(dt) {}

    render(ctx) {
        ctx.fillStyle = this.mass > 0 ? POS_MASS_COLOUR : NEG_MASS_COLOUR;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}

module.exports = Field;
