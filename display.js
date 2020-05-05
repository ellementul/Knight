const PIXI = require("pixi.js");

class Display {

	constructor(){
		const app = new PIXI.Application({ 
			backgroundColor: 0x1099bb, 
			width: window.screen.width, 
			height: window.screen.height, 
		});
		document.body.appendChild(app.view);
		this.stage = app.stage;

		this.tileSize = 64;
		this.newTiles = [];

		this.tileTextures = [ 
			PIXI.Texture.from('empty.png'), 
			PIXI.Texture.from('ground.png'),
			PIXI.Texture.from('grass.png'),
		];

		this.actorTextures = [
			PIXI.Texture.from('empty_actor.png'), 
			PIXI.Texture.from('knight.png'),
		];

		this.actors = new Map();

		let background = new PIXI.Sprite.from('background.jpg');
		this.stage.addChild(background);
		
		app.ticker.add(this.drawTiles.bind(this));
	}

	drawActor({ id, coords: { x, y }, texId }){
		let sprite = new PIXI.Sprite(this.actorTextures[texId]);
		let actor  = new PIXI.Container();

		sprite.anchor.set(0, 1);

		actor.addChild(sprite);

		this.actors.set(id, actor);

		actor.x = x * this.tileSize;
		actor.y = y * this.tileSize;

		actor.zIndex = 1;

		this.currentLevel.addChild(actor);
	}

	updateActor({ id, coords: { x, y } }){
		let actor =  this.actors.get(id);

		actor.x = x * this.tileSize;
		actor.y = y * this.tileSize;
	}

	drawLevel(){
		let level = new PIXI.Container();
		level.sortableChildren = true;

		this.stage.addChild(level);

		this.currentLevel = level;
	}

	drawTiles(){
		this.newTiles.forEach(tile => {
			

			let drawTile = new PIXI.Sprite(this.tileTextures[tile.texId]);

			drawTile.x = tile.coords.x * this.tileSize;
			drawTile.y = tile.coords.y * this.tileSize;

			this.currentLevel.addChild(drawTile);
		});

		this.newTiles = [];
	}
}

module.exports = Display;