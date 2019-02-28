/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
    Vector: __webpack_require__(16),
    MathHelper: __webpack_require__(15)
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const { Vector, MathHelper }  = __webpack_require__(0);
const { LifeColourParticle, Particle } = __webpack_require__(3);

class Emitter {
    constructor(position, velocity, spread, rate, max, life, startColour, endColour, size) {
        this.position = position;
        this.velocity = velocity;
        this.spread = spread || 0;
        this.rate = rate || 2;
        this.max = max || 1000;
        this.life = life || 60;
        this.startColour = startColour || [0, 230, 230, 1];
        this.endColour = endColour || [230, 30, 100, 1];
        this.size = size || 3.5;
        this.radius = 3;
        this.particles = [];
        this.edges = [];
        this.rotation = 0;
    }

    maybeEmit() {
        if (this.particles.length < this.max - this.rate) {
            for (let i = 0; i < this.rate; i++) {
                const angle = this.velocity.getAngle() + this.spread - (Math.random() * this.spread * 2);
                const magnitude = this.velocity.getMagnitude();
                const position = this.position.clone();
                const velocity = new Vector().fromAngle(angle, magnitude);
                this.particles.push(this.createParticle(position, velocity));
            }
        }
    }

    createParticle(position, velocity) {
        return new LifeColourParticle(
            position,
            velocity,
            null,
            this.size,
            this.life,
            this.startColour,
            this.endColour
        )
    }

    update(dt, particleSystem) {
        this.updateRotation();
        this.maybeEmit();
        this.particles = this.particles
            .map(p => p.update(dt, particleSystem))
            .filter(p => p.life > 0);

        if (particleSystem.enableEdges) {
            this.updateEdges(dt, particleSystem);
        }
    }

    updateRotation() {
        if (this.rotation > Math.PI * 2) this.rotation -= Math.PI * 2
        this.velocity.rotateAroundSelf(this.rotation)
    }

    updateEdges(dt, particleSystem) {
        this.edges = [];
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                if (MathHelper.near(p.position, p2.position, particleSystem.edgeThreshold)) {
                    this.edges.push({ from: p.position, to: p2.position });
                }
            }
        }
    }

    render(ctx, particleSystem) {
        // Render emitter
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();

        // Render particles & edges.
        this.particles.forEach(p => p.render(ctx))
        if (particleSystem.enableEdges) {
            this.renderEdges(ctx, particleSystem);
        }
    }

    edgeColour(a) {
        // TODO: Currently can't change edge colour.
        return `rgba(0, 187, 211, ${a})`;
    }

    renderEdges(ctx, particleSystem) {
        this.edges.forEach(e => {
            const a = MathHelper.getDistancePercent(e.from, e.to, particleSystem.edgeThreshold);
            ctx.strokeStyle = this.edgeColour(a);
            ctx.beginPath();
            ctx.moveTo(e.from.x, e.from.y);
            ctx.lineTo(e.to.x, e.to.y);
            ctx.stroke();
        });
    }
}

module.exports = Emitter;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const { Vector, MathHelper }  = __webpack_require__(0);

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


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
    Particle: __webpack_require__(2),
    FireParticle: __webpack_require__(17),
    LifeColourParticle: __webpack_require__(18),
    VelocityColourParticle: __webpack_require__(19)
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
    Emitter: __webpack_require__(1),
    FireEmitter: __webpack_require__(11),
    VelocityColourEmitter: __webpack_require__(13),
    RainbowEmitter: __webpack_require__(12)
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
    Field: __webpack_require__(14)
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

class Game {
    constructor(tickCallback, onClickCallback) {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext("2d");

        this.lastTime = 0;
        this.canvas = canvas;
        this.ctx = ctx;
        this.cb = tickCallback;

        this.updateCanvasSize();
    }

    updateCanvasSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    tick(timestamp) {
        const delta = (timestamp - (this.lastTime || 0)) / 1000;
        this.lastTime = timestamp;
        this.cb(delta, this.ctx);
        window.requestAnimationFrame(this.tick.bind(this));
    }

    start() {
        window.requestAnimationFrame(this.tick.bind(this));
    }
}

module.exports = Game;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

class ParticleSystem {
    constructor() {
        this.enableEdges = false;
        this.edgeThreshold = 20;
        this.bgColour = 'rgba(0,0,0,1)';
        this.blendingMode = 'source-over';
        this.clear();
    }

    clear() {
        this.fields = [];
        this.emitters = [];
    }

    addField(field) {
        this.fields.push(field)
    }

    addEmitter(emitter) {
        this.emitters.push(emitter)
    }

    update(dt) {
        this.fields.forEach(f => f.update(dt, this))
        this.emitters.forEach(e => e.update(dt, this))
    }

    render(ctx) {
        this.clearScreen(ctx);
        this.fields.forEach(f => f.render(ctx, this))
        this.emitters.forEach(e => e.render(ctx, this))
    }

    clearScreen(ctx) {
        ctx.globalCompositeOperation = this.blendingMode;
        ctx.fillStyle = this.bgColour;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
}

module.exports = ParticleSystem;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const { MathHelper, Vector }  = __webpack_require__(0);
const configureMainGUIControls = __webpack_require__(10);

function openActiveFieldGui(item) {
    if (window.activeItemGui) {
        window.activeItemGui.domElement.remove();
    }

    window.activeItemGui = new dat.GUI();
    window.activeItemGui.add(item.constructor, 'name')
    window.activeItemGui.add(item, 'mass', -10000, 10000);
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
    configureMainGUIControls(particleSystem);
    canvas.addEventListener('mousedown', function(evt) {
        for (let i = 0; i < particleSystem.fields.length; i++) {
            const field = particleSystem.fields[i];
            if (MathHelper.isPointInCircle(evt, field.position, field.radius)) {
                window.activeItem = field;
                openActiveFieldGui(field);
                break;
            }
        }

        for (let i = 0; i < particleSystem.emitters.length; i++) {
            const emitter = particleSystem.emitters[i];
            if (MathHelper.isPointInCircle(evt, emitter.position, emitter.radius)) {
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
        if (window.activeItem !== undefined) {
            window.activeItem.position = new Vector(evt.x, evt.y)
        }
    }, false);
}


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(6);
const ParticleSystem = __webpack_require__(7);
const configureGUI = __webpack_require__(8);
const { Vector }  = __webpack_require__(0);
const { Field } = __webpack_require__(5);
const {
    Emitter,
    FireEmitter,
} = __webpack_require__ (4)

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


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const { Field } = __webpack_require__(5);
const { Emitter, FireEmitter } = __webpack_require__(4);
const { Vector } = __webpack_require__(0);

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


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const Emitter = __webpack_require__(1);
const { Vector, MathHelper }  = __webpack_require__(0);
const { FireParticle } = __webpack_require__(3);

class FireEmitter extends Emitter {
    constructor(position, angle) {
        const mag = 3;
        const ang = angle || 3 * Math.PI / 2;
        const velocity = new Vector().fromAngle(ang, mag);
        const spread = Math.PI / 7;
        super(position, velocity, spread, 2, 200);
        this.rotation -= Math.PI / 2;
    }

    createParticle(position, velocity) {
        return new FireParticle(
            position,
            velocity,
            null,
            MathHelper.randomBetween(20, 60)
        )
    }
}

module.exports = FireEmitter;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const Emitter = __webpack_require__(1);
const { MathHelper }  = __webpack_require__(0);

class RainbowEmitter extends Emitter {
    constructor(position, velocity, spread, rate, max, life) {
        super(position, velocity, spread, rate, max, life);
    }

    maybeEmit() {
        this.colour = [
            MathHelper.randomBetween(0, 255),
            MathHelper.randomBetween(0, 255),
            MathHelper.randomBetween(0, 255),
            1
        ]
        super.maybeEmit();
    }
}

module.exports = RainbowEmitter;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const Emitter = __webpack_require__(1);
const { VelocityColourParticle } = __webpack_require__(3);
const { MathHelper }  = __webpack_require__(0);

class VelocityColourEmitter extends Emitter {
    constructor(position, velocity, spread, rate, max, life) {
        super(position, velocity, spread, rate, max, life);
    }

    createParticle(position, velocity) {
        return new VelocityColourParticle(
            position,
            velocity,
            null,
            this.size,
            this.life,
            this.colour
        )
    }
}

module.exports = VelocityColourEmitter;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

const { Vector }  = __webpack_require__(0);
const POS_MASS_COLOUR = '#02a8f3';
const NEG_MASS_COLOUR = '#f34235';

class Field {
    constructor(position, mass) {
        this.position = position || new Vector(0, 0);
        this.mass = mass || 100;
        this.radius = 5;
    }

    update(dt) {}

    render(ctx) {
        ctx.fillStyle = this.mass > 0 ? POS_MASS_COLOUR : NEG_MASS_COLOUR;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}

module.exports = Field;


/***/ }),
/* 15 */
/***/ (function(module, exports) {

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


/***/ }),
/* 16 */
/***/ (function(module, exports) {

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


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

const Particle = __webpack_require__(2);
const { Texture } = __webpack_require__(21);

/**
 * Fire like particle using a texture.
 */
class FireParticle extends Particle {
    constructor(position, velocity, acceleration, life) {
        super(position, velocity, acceleration, 32, life);
        this.maxVelocity = 10;
        this.colour = [240, 100, 20, 0.8];
        this.scale = 0.8;
    }

    update(dt, particleSystem) {
        super.update(dt, particleSystem);
        this.scale -= 0.005
        return this;
    }

    render(ctx) {
        const canvas2 = document.getElementById('canvas2');
        const ctx2 = canvas2.getContext("2d");

        const renderWidth = this.size * this.scale;
        const renderHeight = this.size * this.scale;
        const renderX = this.position.x - (renderWidth / 2);
        const renderY = this.position.y - (renderHeight / 2);

        ctx2.clearRect(0, 0, this.size, this.size);
        ctx2.globalAlpha = this.colour[3];
        ctx2.drawImage(Texture, 0, 0);

        ctx2.globalCompositeOperation = "source-atop";
        ctx2.fillStyle = `rgba(${this.colour[0]}, ${this.colour[1]}, ${this.colour[2]}, 1)`;
        ctx2.fillRect(0, 0, this.size, this.size);

		// reset the buffer's context for the next time we draw the particle
		ctx2.globalCompositeOperation = "source-over";
		ctx2.globalAlpha = 1;

        // Render real particle now.
        ctx.globalCompositeOperation = 'lighter';
        ctx.drawImage(canvas2, 0, 0, this.size, this.size, renderX, renderY, renderWidth, renderHeight);
    }
}

module.exports = FireParticle;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

const Particle = __webpack_require__(2);

/**
 * Particle that transitions between two colours across it's life.
 */
class LifeColourParticle extends Particle {
    constructor(position, velocity, acceleration, size, life, startColour, endColour) {
        super(position, velocity, acceleration, size, life);
        this.startColour = startColour;
        this.endColour = endColour;
        this.colour = Array.from(this.startColour);

        const shortenedLife = this.life - (this.life / 5);
        this.deltaColour = [
            (this.endColour[0] - this.startColour[0]) / shortenedLife,
        	(this.endColour[1] - this.startColour[1]) / shortenedLife,
        	(this.endColour[2] - this.startColour[2]) / shortenedLife,
            (this.endColour[3] - this.startColour[3]) / shortenedLife
        ];
    }

    update(dt, particleSystem) {
        super.update(dt, particleSystem);
        if (this.startColour && this.endColour) {
            this.colour[0] = Math.round(this.colour[0] + this.deltaColour[0]);
            this.colour[1] = Math.round(this.colour[1] + this.deltaColour[1]);
            this.colour[2] = Math.round(this.colour[2] + this.deltaColour[2]);
            this.colour[3] = this.colour[3] + this.deltaColour[3];
        }

        return this;
    }
}

module.exports = LifeColourParticle;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

const Particle = __webpack_require__(2);

class VelocityColourParticle extends Particle {
    constructor(position, velocity, acceleration, size, life) {
        super(position, velocity, acceleration, size, life);
        this.maxVelocity = 10;
        this.colour = [255, 255, 255, 1];
    }

    update(dt, particleSystem) {
        super.update(dt, particleSystem);

        // Update colour against velocity magnitude.
        // RED = fast, BLUE = slow.
        const percentOfVelocity = this.velocity.getMagnitude() / this.maxVelocity;
        this.colour[0] = Math.round(255 * percentOfVelocity)
        this.colour[1] = 0;
        this.colour[2] = Math.round(255 - (255 * percentOfVelocity))
        this.colour[3] = 1;

        return this;
    }
}

module.exports = VelocityColourParticle;


/***/ }),
/* 20 */
/***/ (function(module, exports) {

const texture = new Image(32, 32);
texture.src = 'particle.png';
module.exports = texture;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
    Texture: __webpack_require__(20)
};


/***/ })
/******/ ]);