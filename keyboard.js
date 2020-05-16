const PhysicLoop  = require("./lib/physic_loop.js");
let loop = new PhysicLoop();

function CrKeyboard(sendFunc, actions){
	
	var keys_is_down  = [];
	
	document.addEventListener("keydown", eventKeyDouwn);
	document.addEventListener("keyup" , eventKeyUp);
	
	loop.addCall(updateKeys);
	
	function updateKeys(){
		keys_is_down.forEach(function(isDown, i){
			if(isDown){
				sendKey(i);
			}
		});

		return true;
	}
	
	function eventKeyDouwn(event){
		if(actions[event.keyCode]){
			event.preventDefault();
			var key_code = event.keyCode;
			keys_is_down[key_code] = true;
		}
	}

	function eventKeyUp(event){
		if(actions[event.keyCode]){
			event.preventDefault();
			keys_is_down[event.keyCode] = false;
		}
	}

	function sendKey(key_code){
		sendFunc(actions[key_code]);
	}
	
	function sendPing(){
		sendFunc({action: "Ping"});
	}
};

module.exports = CrKeyboard;
