module.exports = {
    randomBetween: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
    distanceBetween: function(n, n2) {
        return Math.sqrt(
            Math.pow((n.x - n2.x), 2) +
            Math.pow((n.y - n2.y), 2)
        )
    },
    near: function(n, n2, threshold) {
        return this.distanceBetween(n, n2) < threshold;
    },
    getDistancePercent: function(n, n2, threshold) {
        const d = this.distanceBetween(n, n2);
        if (d > threshold) {
            return 0;
        } else {
            return 1 - d / threshold;
        }
    },
    isPointInCircle: function(p, c, r) {
        return (Math.pow(p.x - c.x, 2) + Math.pow(p.y - c.y, 2)) < Math.pow(r, 2);
    }
}
