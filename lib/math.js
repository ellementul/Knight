function mixMath(Point){
	Point.prototype.add = function(point){
		return new Point(this.x + point.x, this.y + point.y);
	}

	Point.prototype.sub = function(point){
		return new Point(this.x - point.x, this.y - point.y);
	}

	Point.prototype.mod = function(){
		return Math.sqrt( Math.pow(this.x, 2) + Math.pow(this.y, 2) );
	}

	Point.prototype.mulNum = function(number){
		return new Point(this.x * number, this.y * number);
	}
}

module.exports = mixMath;