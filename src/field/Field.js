const { Vector, MathHelper }  = require('../math');
const POS_MASS_COLOUR = '#02a8f3';
const NEG_MASS_COLOUR = '#f34235';

class Field {
    constructor(position, mass, oscilate = false) {
        this.position = position || new Vector(0, 0);
        this.mass = mass || 100;
        this.radius = 5;
        this.age = 0;
        if (oscilate) {
            this.oscilateMass = true;
            this.minMass = oscilate.minMass;
            this.maxMass = oscilate.maxMass;
            this.oscilateFrequency = oscilate.oscilateFrequency;
        } else {
            this.oscilateMass = false;
            this.minMass = -500;
            this.maxMass = 20;
            this.oscilateFrequency = 0.01;
        }
    }

    update(dt) {
        this.age += dt;
        if (this.oscilateMass) {
            this.mass = MathHelper.oscilateSine(this.minMass, this.maxMass, this.oscilateFrequency, this.age)
        }
    }

    render(ctx) {
        ctx.fillStyle = this.mass > 0 ? POS_MASS_COLOUR : NEG_MASS_COLOUR;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}

module.exports = Field;
