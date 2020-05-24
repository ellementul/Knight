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
			32 : "jump",
		};

		setInterval(() => { 
			sendSignal("stop");
			return true;
		}, 0);

		Keyboard(sendSignal, actionKeys);
	}
}



class Person {
	constructor(level, actor, ClassController){
		this.level   = level;
		this.actor = actor;

		let controller = new ClassController(getSignal.bind(this));

		this.actor.state = 'fall';

		function getSignal(signal) {
			this[signal]();
			this.isFall();
		}		
	}

	left(){
		this.actor.speed.x = -1;
		this.actor.state = 'walk';
	}

	right(){
		this.actor.speed.x = 1;
		this.actor.state = 'walk';
	}

	stop(){
		this.actor.speed.x = 0;
		this.actor.state = 'idle';
	}

	jump(){
		if(this.actor.isFalling)
			return;

		let JumpSpeed = -4;

		loop.addCall(() => {
			this.actor.speed.y = JumpSpeed;

			JumpSpeed *= 0.94;

			return JumpSpeed < 0.01;
		})
	}

	isFall(){
		if(this.actor.isFalling)
			this.actor.state = 'fall';
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

		let actor = this.addActor({
			texId:  'knight',
			speed:  { x: 0, y: 0 },
			coords: { x: 3, y: 3 },
		});

		new Person(this, actor, GamerController);

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

		let min_step = 0.01;
		for(delta; delta > 0; delta = delta - min_step){

			let x = actor.coords.x + speed.x * min_step;
			let y = actor.coords.y + speed.y * min_step;
			let changed = {};

			if( this.blocks.isEmpty({x, y: actor.coords.y}) ){
				changed.x = x - actor.coords.x;
				actor.coords.x = x;
			}

			if( this.blocks.isEmpty({x: actor.coords.x, y}) ){
				changed.y = y - actor.coords.y;
				actor.coords.y = y;
			}

			actor.isFalling = !!changed.y;
		}

		this.display.updateActor(actor);
	}

	addActor(actor) {
		actor.id = uuid();
		this.actors.set(actor.id, actor);
		this.display.drawActor(actor);

		return actor;
	}

	addedBlock(block) {
		this.display.newTiles.push(block);
	}
}

module.exports = Level;