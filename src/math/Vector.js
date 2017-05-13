class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    fromAngle(angle, magnitude) {
        return new Vector(
            magnitude * Math.cos(angle),
            magnitude * Math.sin(angle)
        );
    }

    clone() {
        return new Vector(this.x, this.y);
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
    }

    getMagnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    getAngle() {
        return Math.atan2(this.y, this.x);
    }

    rotate(radians, point = this) {
        const cosR = Math.cos(radians);
        const sinR = Math.sin(radians);
        const rx = ((this.x - point.x) * cosR) - ((this.y - point.y) * sinR) + point.x;
        const ry = ((this.y - point.y) * cosR) + ((this.x - point.x) * sinR) + point.y;
        this.x = rx;
        this.y = ry;
    }

    rotateAroundSelf(r) {
        const v = this.fromAngle(r, this.getMagnitude());
        this.x = v.x;
        this.y = v.y;
    }
}

module.exports = Vector;
