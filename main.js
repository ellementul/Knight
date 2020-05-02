require('./lib/mof.js');

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

		this.tileTextures = [ null, PIXI.Texture.from('favicon.ico') ];

		let background = new PIXI.Sprite.from('background.jpg');
		background.zIndex = -100;
		this.stage.addChild(background);

		// create a new Sprite from an image path
		// // Listen for animate update
		// app.ticker.add((delta) => {
		//     // just for fun, let's rotate mr rabbit a little
		//     // delta is 1 if running at 100% performance
		//     // creates frame-independent transformation
		//     bunny.rotation += 0.1 * delta;
		// });
	}

	drawLevel(){
		let level = new PIXI.Container();
		this.stage.addChild(level);

		this.currentLevel = level;
	}

	drawTiles(tiles){
		tiles.forEach(tile => {
			let drawTile = new PIXI.Sprite(this.tileTextures[tile.texId]);

			drawTile.x = tile.coords.x * this.tileSize;
			drawTile.y = tile.coords.y * this.tileSize;

			this.currentLevel.addChild(drawTile);
		});
	}
}

class Level {
	constructor(display, { mapSizes }){
		this.blocks = new BlockSystem({ mapSizes });
		display.drawLevel();

		let blocks = this.blocks.getAll().map(block => {
			block.texId = block.typeBlock; 
			return block;
		});

		display.drawTiles(blocks);
	}
}

class BlockSystem {
	constructor({ mapSizes }){
		let genLine  = Array.create.bind(null, 1, mapSizes.x, true);
		this.data  = Array.create(genLine, mapSizes.y);
	}

	getAll(){
		let blocks = [];
		this.data.forEach((line, y) =>{
			line.forEach((block, x) =>{
				blocks.push({
					typeBlock: block,
					coords: {x, y}
				});
			});
		});

		return blocks;
	}
}

console.log( new Level(new Display(), {
		mapSizes: {x: 20, y: 10}
	}
));