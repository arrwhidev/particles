const { MathHelper, Vector }  = require('./math');
const configureMainGUIControls = require('./configureMainGUIControls');

function openActiveFieldGui(item) {
    if (window.activeItemGui) {
        window.activeItemGui.domElement.remove();
    }

    window.activeItemGui = new dat.GUI();
    window.activeItemGui.add(item.constructor, 'name')
    window.activeItemGui.add(item, 'mass', -20000, 10000).listen();
    window.activeItemGui.add(item, 'oscilateMass')
    window.activeItemGui.add(item, 'oscilateFrequency')
    window.activeItemGui.add(item, 'minMass')
    window.activeItemGui.add(item, 'maxMass')
}

function openActiveEmitterGui(item) {
    if (window.activeItemGui) {
        window.activeItemGui.domElement.remove();
    }

    window.activeItemGui = new dat.GUI();
    window.activeItemGui.add(item.constructor, 'name')
    window.activeItemGui.addColor(item, 'startColour');
    window.activeItemGui.addColor(item, 'endColour');
    window.activeItemGui.add(item, 'rate', 1, 10);
    window.activeItemGui.add(item, 'max', 0, 5000);
    window.activeItemGui.add(item, 'spread', 0, Math.PI);
    window.activeItemGui.add(item, 'size', 1, 10);
    window.activeItemGui.add(item, 'life', 60, 60 * 100);
    window.activeItemGui.add(item, 'rotation', 0, Math.PI * 2)
}

module.exports = function(particleSystem, canvas) {
    function getCanvasRelativeCoords(evt) {
        const rect = canvas.getBoundingClientRect();
        const x = evt.x - rect.left;
        const y = evt.y - rect.top;
        return { x, y };
    }

    configureMainGUIControls(particleSystem, canvas.width, canvas.height);
    
    canvas.addEventListener('mousedown', function(evt) {
        const relativeEvt = getCanvasRelativeCoords(evt);

        for (let i = 0; i < particleSystem.fields.length; i++) {
            const field = particleSystem.fields[i];
            if (MathHelper.isPointInCircle(relativeEvt, field.position, field.radius)) {
                window.activeItem = field;
                openActiveFieldGui(field);
                break;
            }
        }

        for (let i = 0; i < particleSystem.emitters.length; i++) {
            const emitter = particleSystem.emitters[i];
            if (MathHelper.isPointInCircle(relativeEvt, emitter.position, emitter.radius)) {
                window.activeItem = emitter;
                openActiveEmitterGui(emitter);
                break;
            }
        }
    }, false);
    canvas.addEventListener('mouseup', function(evt) {
        window.activeItem = undefined;
    }, false);
    canvas.addEventListener('mousemove', function(evt) {
        const relativeEvt = getCanvasRelativeCoords(evt);
        if (window.activeItem !== undefined) {
            window.activeItem.position = new Vector(relativeEvt.x, relativeEvt.y)
        }
    }, false);
}
