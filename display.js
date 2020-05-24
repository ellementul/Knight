const PIXI    = require("pixi.js");
require("./lib/math.js")(PIXI.Point);

const textures    = require('./data/textures.json');
const animations  = require('./data/animations.json');
const actorStates = require('./data/actor_states.json');


class DisplayPerson {
	constructor(actor, states){
		this.actor  = actor;
		this.states = states;

		for (let key in states){
			states[key].anchor.set(0.5, 1);
			states[key].animationSpeed = 0.05;
		}

		this.setState('idle');
	}

	setState(stateKey){
		if(this.state == stateKey)
			return;

		this.actor.removeChildren();

		let state = this.states[stateKey];
		state.play();

		this.state = stateKey;
		this.actor.addChild(state);
	}
}

class Display {

	constructor(onReady){
		const app = new PIXI.Application({ 
			backgroundColor: 0x1099bb, 
			width: window.screen.width, 
			height: window.screen.height, 
		});
		document.body.appendChild(app.view);
		this.stage = app.stage;
		this.screen = app.screen;
		this.ticker = app.ticker;

		this.tileSize = 64;
		this.newTiles = [];

		this.actors  = new Map();
		this.persons = new Map();

		for (let name in textures){
			app.loader.add(name, "./data/" + textures[name]);
		}

		let background = new PIXI.Sprite.from('./data/background.jpg');
			this.stage.addChild(background);

		app.loader.load(onLoaded.bind(this));

		
		function onLoaded(loader, resource){
			this.tileTextures = {};

			for (let name in textures){

				if(!resource[name].error)
					this.tileTextures[name] = PIXI.Texture.from(name);
				else
					this.tileTextures[name] = PIXI.Texture.from('empty');
			}

			this.buildAnims(animations);

			this.actorStates = [];
			for (let actorKey in actorStates){
				this.actorStates[actorKey] = [];

				for (let stateKey in actorStates[actorKey])
					this.actorStates[actorKey][stateKey] = new PIXI.AnimatedSprite(this.animes[ actorStates[actorKey][stateKey] ]);
				
			}
			
			app.ticker.add(this.drawTiles.bind(this));

			onReady(this);
		}


		
	}

	bindCamera(actor){
		this.ticker.add(this.moveCamera.bind(this, actor));
	}

	moveCamera(actor, delta){
		let cameraSens = 0.0000001;

		let center  = new PIXI.Point(this.screen.width / 2, this.screen.height / 2);
		let toPoint = new PIXI.Point().copyFrom( actor.position );

		toPoint = toPoint.mulNum(-1).add(center);
		delta  *= Math.pow( toPoint.sub(this.currentLevel.position).mod(), 2);

		this.moveActor( this.currentLevel, toPoint, delta * cameraSens);
	}

	moveActor(actor, toPoint, partOfDist){
		let beginPoint = new PIXI.Point().copyFrom( actor.position );

		let distVec  = toPoint.sub(beginPoint);
		let deltaVec = distVec.mulNum(partOfDist);

		actor.position.copyFrom( deltaVec.add(beginPoint) );
	}

	buildAnims(anim_array){

		for (let key in anim_array)
			anim_array[key] = anim_array[key].map(frame => PIXI.Texture.from(frame));

		this.animes = anim_array;
	}

	drawActor({ id, coords: { x, y }, texId }){

		let actor  = new PIXI.Container();

		actor.x = x * this.tileSize;
		actor.y = y * this.tileSize;

		actor.zIndex = 1;
		
		let states = this.actorStates[texId];

		let person  = new DisplayPerson(actor, states);

		this.actors.set(id, person.actor);
		this.persons.set(id, person);		

		this.currentLevel.addChild(person.actor);

		if(texId == 'knight')
			this.bindCamera(person.actor);

	}

	updateActor({ id, coords: { x, y }, state }){
		let actor =  this.actors.get(id);

		x *= this.tileSize;
		y *= this.tileSize;

		let sign = Math.sign(x - actor.x) || 1;

		actor.position.set(x, y);

		let person =  this.persons.get(id);
		if(person){
			person.actor.scale.x = sign;
			person.setState(state);
		}

	}

	drawLevel(){
		let level = new PIXI.Container();
		level.sortableChildren = true;

		this.stage.addChild(level);

		this.currentLevel = level;
	}

	drawTiles(){
		this.newTiles.forEach(tile => {
			
			let texture = this.tileTextures.empty;

			if(this.tileTextures[tile.texId].valid)
				texture = this.tileTextures[tile.texId];

			let drawTile = new PIXI.Sprite(texture);

			drawTile.x = tile.coords.x * this.tileSize;
			drawTile.y = tile.coords.y * this.tileSize;

			if(tile.reflect){
				drawTile.scale.x = -1;
				drawTile.anchor.x = 1;
			}

			this.currentLevel.addChild(drawTile);
		});

		this.newTiles = [];
	}
}

module.exports = Display;