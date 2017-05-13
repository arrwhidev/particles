const { Vector, MathHelper }  = require('../math');

/**
 * Basic fundamental particle.
 */
class Particle {
    constructor(position, velocity, acceleration, size, life, colour) {
        this.position = position || new Vector(0, 0);
        this.velocity = velocity || new Vector(0, 0);
        this.acceleration = acceleration || new Vector(0, 0);
        this.size = size || 1;
        this.life = life || 0;
        this.colour = colour || [255, 255, 255, 1];
    }

    updatedAccelerationBasedOnFields(dt, particleSystem) {
        const newAcceleration = new Vector(0, 0);
        particleSystem.fields.forEach(field => {
            // Distance between the particle and the field.
            const distanceX = field.position.x - this.position.x;
            const distanceY = field.position.y - this.position.y;

            // Calculate force.
            const force = field.mass / Math.pow(distanceX * distanceX + distanceY * distanceY, 1.5);

            // Increment acceleration based on field force vector.
            newAcceleration.add(new Vector(distanceX * force, distanceY * force));
        });

        // Update particle acceleration.
        this.acceleration = newAcceleration;
    };

    update(dt, particleSystem) {
        this.life--;
        if (this.life > 0) {
            this.updatedAccelerationBasedOnFields(dt, particleSystem);
            this.velocity.add(this.acceleration);
            this.position.add(this.velocity);
            this.checkIfOOB();
        }
        return this;
    }

    checkIfOOB() {
        if (this.position.x > window.innerWidth ||
            this.position.x < 0 ||
            this.position.y > window.innerHeight ||
            this.position < 0) {
            this.life = -1;
        }
    }

    render(ctx) {
        if (this.life > 0) {
            const colour = `rgba(${Math.round(this.colour[0])}, ${Math.round(this.colour[1])}, ${Math.round(this.colour[2])}, ${this.colour[3]})`;
            ctx.fillStyle = colour;
            ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
        }
    }
}

module.exports = Particle;
