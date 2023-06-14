const Game = require('./Game');
const ParticleSystem = require('./ParticleSystem');
const configureGUI = require('./configureGUI');
const createExamples = require('./examples')

window.startParticlesDemo = function(width, height) {
    // Create main particle system container.
    const particleSystem = new ParticleSystem();

    // Create main game.
    const game = new Game((dt, ctx) => {
        particleSystem.update(dt);
        particleSystem.render(ctx);
    }, width, height);
    game.start();

    window.particlesDemo = {
        width,
        height,
    }

    // Set up gui and demo.
    configureGUI(particleSystem, game.canvas);
    createExamples(particleSystem, width, height).loop();
}