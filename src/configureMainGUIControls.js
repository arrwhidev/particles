const { Field } = require('./field');
const { Emitter, FireEmitter } = require('./emitter');
const { Vector } = require('./math');

module.exports = function(particleSystem) {
    const midX = window.innerWidth / 2;
    const midY = window.innerHeight / 2;
    const controller = {
        createField: function() {
            const mass = 100;
            particleSystem.addField(new Field(new Vector(midX, 100), mass))
        },
        createEmitter: function() {
            particleSystem.addEmitter(
                new Emitter(new Vector(midX, 100), new Vector().fromAngle(Math.PI, 2), Math.PI / 4, 4, 1000, 2 * 60)
            )
        },
        fireExample: function() {
            particleSystem.clear();
            particleSystem.addEmitter(new FireEmitter(new Vector(midX, midY)))
            particleSystem.addField(new Field(new Vector(midX - 50, midY - 50), -100))
            particleSystem.addField(new Field(new Vector(midX + 50, midY - 50), -100))
        },
        bigForceExample: function() {
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
        }
    }

    const gui = new dat.GUI();
    gui.addColor(particleSystem, 'bgColour')
    gui.add(particleSystem, 'blendingMode', ['source-over', 'lighten'])
    gui.add(particleSystem, 'enableEdges')
    gui.add(particleSystem, 'edgeThreshold', 0, 100)
    gui.add(particleSystem, 'clear')
    gui.add(controller, 'createField')
    gui.add(controller, 'createEmitter')
    gui.add(controller, 'fireExample')
    gui.add(controller, 'bigForceExample')
}
