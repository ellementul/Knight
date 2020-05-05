const { v1: uuid } = require('uuid');

const BlockSystem = require("./block_system.js");
const PhysicLoop  = require("./lib/physic_loop.js");



const Keyboard  = require("./keyboard.js");
let loop = new PhysicLoop();

class GamerController {
	constructor(sendSignal){
		let actionKeys = {
			68 : "right",
			//83 : "",
			65 : "left",
			//87 : "",
			//32 : "hit",
		};

		setInterval(() => { 
			sendSignal("stop");
			return true;
		}, 0);

		Keyboard(sendSignal, actionKeys);
	}
}



class Person {
	constructor(level, actorId, ClassController){
		this.level   = level;
		this.actorId = actorId;

		let controller = new ClassController(getSignal.bind(this));

		function getSignal(signal) {
			if(typeof this[signal] == "function")
				this[signal]();
		}
	}

	left(){
		this.level.setSpeed(this.actorId, -1);
	}

	right(){
		this.level.setSpeed(this.actorId, 1);
	}

	stop(){
		this.level.setSpeed(this.actorId, 0);
	}
}




class Level {
	constructor(display, { mapSizes }) {

		this.display = display;
		display.drawLevel();

		this.blocks = new BlockSystem(this, { mapSizes });
		this.display.newTiles = this.blocks.getAll();

		this.actors = new Map();

		this.speedScale = 0.002;
		this.gravity    = {x: 0, y: 1};

		let actorId = this.addActor({
			texId: 1,
			speed:  { x: 0, y: 0 },
			coords: { x: 3, y: 3 },
		});

		new Person(this, actorId, GamerController);

		loop.addCall(this.stepMove.bind(this));
	}

	stepMove(delta){
		this.actors.forEach(actor => this.move(actor, delta));

		return !!this.actors.size;
	}

	move(actor, delta){
		delta *= this.speedScale;

		let speed = {
			x: actor.speed.x + this.gravity.x,
			y: actor.speed.y + this.gravity.y,
		};

		let x = actor.coords.x + speed.x * delta;
		let y = actor.coords.y + speed.y * delta;
		let is_changed = false;

		if( this.blocks.isEmpty({x, y: actor.coords.y}) ){
			actor.coords.x = x;
			is_changed = true;
		}

		if( this.blocks.isEmpty({x: actor.coords.x, y}) ){
			actor.coords.y = y;
			is_changed = true;
		}

		if(is_changed)
			this.display.updateActor(actor);
	}

	addActor(actor) {
		actor.id = uuid();
		this.actors.set(actor.id, actor);
		this.display.drawActor(actor);

		return actor.id;
	}

	setSpeed(actorId, x, y) {
		let actor = this.actors.get(actorId);

		if(x || x === 0)
			actor.speed.x = x;

		if(y || y === 0)
			actor.speed.y = y;
	}

	addedBlock(block) {
		this.display.newTiles.push(block);
	}
}

module.exports = Level;