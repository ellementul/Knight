class PhysicLoop {
	constructor() {
		this.funcs = [];
		this.time  = performance.now();

		this.nextCall = requestAnimationFrame.bind(null) || nextTick;

		this.timer = this.nextCall(this.step.bind(this));
	}

	step(time) {
		let new_time = performance.now();
		let delta    = new_time - this.time;
		this.time    = new_time;

		this.funcs = this.funcs.filter(func => func(delta));

		if(this.funcs.length)
			this.timer = this.nextCall(this.step.bind(this));
		else
			this.timer = null;
	}

	addCall(func) {
		if(this.timer === null)
			this.timer = this.nextCall(this.step.bind(this));

		return this.funcs.push(func);
	}
}
module.exports = PhysicLoop;