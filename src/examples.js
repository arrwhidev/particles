const { Field } = require('./field');
const { Emitter, FireEmitter } = require('./emitter');
const { Vector } = require('./math');

module.exports = function(particleSystem, width, height) {
    const midX = width / 2;
    const midY = height / 2;
    const midVector = new Vector(midX, midY)

    function fourCorners() {
        // top left.
        const pos1 = new Vector(width * 0.25, height * 0.25)
        let r = Math.atan2(midX - pos1.x, midY - pos1.y)
        particleSystem.addEmitter(new Emitter(
            pos1,
            new Vector().fromAngle(Math.PI, 2),
            Math.PI / 4,
            4,
            2000,
            350,
            null,
            null,
            2,
            r
        ));

        // bottom right
        const pos2 = new Vector(width * 0.75, height * 0.75);
        r = Math.atan2(midX - pos2.x, midY - pos2.y)
        particleSystem.addEmitter(new Emitter(
            pos2,
            new Vector().fromAngle(Math.PI, 2),
            Math.PI / 4,
            4,
            2000,
            350,
            null,
            null,
            2,
            r
        ));

        // top right
        const pos3 = new Vector(width * 0.25, height * 0.75);
        r = Math.atan2(pos3.x - midX, pos3.y - midY)
        particleSystem.addEmitter(new Emitter(
            pos3,
            new Vector().fromAngle(Math.PI, 2),
            Math.PI / 4,
            4,
            2000,
            350,
            null,
            null,
            2,
            r
        ));

        // top right
        const pos4 = new Vector(width * 0.75, height * 0.25)
        r = Math.atan2(pos4.x - midX, pos4.y - midY)
        particleSystem.addEmitter(new Emitter(
            pos4,
            new Vector().fromAngle(Math.PI, 2),
            Math.PI / 4,
            4,
            2000,
            350,
            null,
            null,
            2,
            r
        ));
    }

    return {
        loop: function() {
            particleSystem.clear();
            particleSystem.addEmitter(
                new Emitter(
                    new Vector(midX, height * 0.25),
                    new Vector().fromAngle(Math.PI , 2),
                    Math.PI / 4,
                    4,
                    2000,
                    350,
                    null,
                    null,
                    2,
                ));
                
            particleSystem.addField(
                new Field(
                    new Vector(midX, height * 0.7), 
                    2300
                ));
        },
        fastPulse: function () {
            particleSystem.clear();
            fourCorners();
            

            particleSystem.addField(new Field(new Vector(midX, midY), -300, {
                minMass: -700,
                maxMass: 40,
                oscilateFrequency: 0.5,
            }))
        },
        slowPulse: function () {
            particleSystem.clear();
            fourCorners();
            
            // top middle
            particleSystem.addEmitter(new Emitter(
                new Vector(width / 2, height * 0.15),
                new Vector().fromAngle(Math.PI, 2),
                Math.PI / 4,
                4,
                2000,
                350,
                null,
                null,
                2,
                Math.PI / 2
            ));

            // bottom middle
            particleSystem.addEmitter(new Emitter(
                new Vector(width / 2, height * 0.85),
                new Vector().fromAngle(Math.PI, 2),
                Math.PI / 4,
                4,
                2000,
                350,
                null,
                null,
                2,
                Math.PI + (Math.PI / 2)
            ));
            particleSystem.addField(new Field(new Vector(midX, midY), -300, {
                minMass: -3000,
                maxMass: -80,
                oscilateFrequency: 0.05,
            }))
        },
        fire: function() {
            particleSystem.clear();
            particleSystem.addEmitter(new FireEmitter(new Vector(midX, midY)))
            particleSystem.addField(new Field(new Vector(midX - 50, midY - 50), -100))
            particleSystem.addField(new Field(new Vector(midX + 50, midY - 50), -100))
        },
        bigCircle: function() {
            particleSystem.clear();
            particleSystem.addEmitter(
                 new Emitter(
                     new Vector(midX, midY),
                     new Vector().fromAngle(Math.PI, 2),
                     Math.PI,
                     2,
                     1000,
                     100 * 60,
                     undefined,
                     undefined,
                     2)
            );
            particleSystem.addField(new Field(new Vector(midX - 150, midY), 6000))
            particleSystem.addField(new Field(new Vector(midX - 50, midY), -1500))
        },
    }
}