require('./lib/mof.js');

const Level   = require("./game_level.js");
const Display = require("./display.js");




console.log( new Level(new Display(), {
		mapSizes: {x: 15, y: 15}
	}
));