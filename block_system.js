const PhysicLoop = require("./lib/physic_loop.js");

let Seeds = [
	{
		blockType: 1,
		coordShift: {x: 1, y: 1},
	},
	{
		blockType: 2,
		coordShift: {x: 0, y: 1},
	}
];

const loop = new PhysicLoop();

class Generator {
	constructor(funcSpawn){
		this.funcSpawn = funcSpawn;
		loop.addCall(this.run.bind(this));
		this.seeds = [];
	}

	run(){
		let seeds = this.seeds.map(item => item);
		this.seeds = [];

		seeds.forEach(seed => {
			if(seed) this.funcSpawn(seed)
		});

		return !!this.seeds.length;
	}

	addSeed(coords, seedId){
		let { blockType, coordShift } = Seeds[seedId];
		let x = coords.x + coordShift.x;
		let y = coords.y + coordShift.y;
		this.seeds.push({
			type: blockType,
			coords: {x, y}, 
		});
	}

	addTemplate(coords, template){
		template.forEach(this.addSeed.bind(this, coords));
	}

	
}


let BlockTypes = [
	{ texId: 0 },
	{ 
		texId: 2,
		template: [0, 1],
	},
	{ 
		texId: 1,
		seed: 1,
	},
];

class BlockSystem {
	constructor(level, { mapSizes: { x, y } }){
		
		this.level    = level;
		this.mapSizes = {x, y};

		let genColumn  = Array.create.bind(null, null, this.mapSizes.y, true);
		this.data      = Array.create(genColumn, this.mapSizes.x);

		this.gen = new Generator(this.addBlock.bind(this));

		this.addBlock({ coords: {x: 0, y: 6}, type: 1 });
	}

	isEmpty({ x, y }){
		x = Math.floor(x);
		y = Math.floor(y);
		return !this.isOutMap({ x, y }) && !this.data[x][y];
	}

	isOutMap(coords){
		return coords.x < 0 ||  coords.y < 0
			|| coords.x >= this.mapSizes.x 
			|| coords.y >= this.mapSizes.y;
	}

	addBlock({ coords, type }){
		let { x, y } = coords;

		if( !this.isOutMap(coords) )
			if( !this.data[x][y] ){
				this.data[x][y] = type;

				this.level.addedBlock({
					texId: BlockTypes[type].texId,
					coords: {x, y}
				});

				if( BlockTypes[type].seed !== undefined )
					this.gen.addSeed(coords, BlockTypes[type].seed);

				if( BlockTypes[type].template !== undefined )
					this.gen.addTemplate(coords, BlockTypes[type].template);

				return true;
			}
		return false;
	}

	getAll(){
		let blocks = [];
		this.data.forEach((line, x) =>{
			line.forEach((block, y) =>{
				if(block !== null)
					blocks.push({
						texId: BlockTypes[block].texId,
						coords: {x, y}
					});
			});
		});

		return blocks;
	}
}

module.exports = BlockSystem;