const Game = require('./Game');
const ParticleSystem = require('./ParticleSystem');
const configureGUI = require('./configureGUI');
const { Vector }  = require('./math');
const { Field } = require('./field');
const {
    Emitter,
    FireEmitter,
} = require ('./emitter')

// Create main particle system container.
const particleSystem = new ParticleSystem();

// Create main game.
const game = new Game((dt, ctx) => {
    particleSystem.update(dt);
    particleSystem.render(ctx);
});
window.addEventListener('resize', game.updateCanvasSize, false);
configureGUI(particleSystem, game.canvas);
game.start();

/**
 * These are the emitters & fields that load by Default.
 */

const midX = game.canvas.width / 2;
const midY = game.canvas.height / 2;

particleSystem.addEmitter(
    new Emitter(
        new Vector(midX / 2, midY),
        new Vector(2, 2),
        Math.PI
    )
)
particleSystem.addEmitter(
    new Emitter(
        new Vector(midX + midX / 2, midY),
        new Vector(2, 2),
        Math.PI
    )
)
particleSystem.addEmitter(
    new Emitter(
        new Vector(midX, midY + midY / 2 + 100),
        new Vector(2, 2),
        Math.PI
    )
)
particleSystem.addEmitter(
    new Emitter(
        new Vector(midX, 100),
        new Vector().fromAngle(Math.PI, 2),
        Math.PI / 4,
        4,
        1000,
        2 * 60
    )
)
particleSystem.addField(new Field(new Vector(midX, 325), 4500))
particleSystem.addField(new Field(new Vector(midX, midY + midY / 2), -500))
