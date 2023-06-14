const { Field } = require('./field');
const { Emitter } = require('./emitter');
const { Vector } = require('./math');
const createExamples = require('./examples');

module.exports = function(particleSystem, width, height) {
    const midX = width / 2;
    const midY = height / 2;

    const examples = createExamples(particleSystem, width, height);
    const simpleControls = {
        createField: function() {
            const mass = 100;
            particleSystem.addField(new Field(new Vector(midX, 100), mass))
        },
        createEmitter: function() {
            particleSystem.addEmitter(
                new Emitter(new Vector(midX, 100), new Vector().fromAngle(Math.PI, 2), Math.PI / 4, 4, 1000, 2 * 60)
            )
        },
    }

    const gui = new dat.GUI();

    const configFolder = gui.addFolder('Config');
    configFolder.addColor(particleSystem, 'bgColour')
    configFolder.add(particleSystem, 'enableEdges')
    configFolder.add(particleSystem, 'edgeThreshold', 0, 100)

    const controlsFolder = gui.addFolder('Controls');
    controlsFolder.add(particleSystem, 'clear',)
    controlsFolder.add(simpleControls, 'createField')
    controlsFolder.add(simpleControls, 'createEmitter')
    
    const examplesFolder = gui.addFolder('Examples');
    examplesFolder.add(examples, 'loop')
    examplesFolder.add(examples, 'slowPulse')
    examplesFolder.add(examples, 'fastPulse')
    examplesFolder.add(examples, 'fire')
    examplesFolder.add(examples, 'bigCircle')
    
    // Add to main gui.
    // gui.addFolder(configFolder);
    // gui.addFolder(examplesFolder);
    // gui.addFolder(controlsFolder);
}