/**
 * A placeholder model to test canvas drawing
 *
 */

PhysicsSim.model.Ball = function() {
	this.x = 200;
	this.y = 300;
	this.radius = 15;
	this.draw = function() {
		PhysicsSim.ctx.save();
		PhysicsSim.ctx.beginPath();
		PhysicsSim.ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
		PhysicsSim.ctx.closePath();
		PhysicsSim.ctx.fillStyle = 'black';
		PhysicsSim.ctx.fill();
		PhysicsSim.ctx.restore();
	}
}
