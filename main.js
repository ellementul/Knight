require('./lib/mof.js');

const Level   = require("./game_level.js");
const Display = require("./display.js");

const display = new Display(onLoad);

function onLoad(display){
	
	console.log( new Level(display, {
			mapSizes: {x: 150, y: 20}
		}
	));
}