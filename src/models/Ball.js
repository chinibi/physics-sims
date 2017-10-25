/**
 * A placeholder model to test canvas drawing
 *
 */

PhysicsSim.model.Ball = function() {
	this.x = 300;
	this.y = 200;
	this.radius = 15;
	this.dx = 1;
	this.dy = 0;
	this.draw = function() {
		PhysicsSim.ctx.save();
		PhysicsSim.ctx.beginPath();
		PhysicsSim.ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
		PhysicsSim.ctx.closePath();
		PhysicsSim.ctx.fillStyle = 'black';
		PhysicsSim.ctx.fill();
		PhysicsSim.ctx.restore();
	}
	this.setNextPosition = function() {
		this.x += this.dx;
		this.y += this.dy;
	}
}

document.addEventListener('DOMContentLoaded', function() {
	PhysicsSim.init('sim-canvas');
});

var $loadButton = document.getElementById('controls-change-model');
$loadButton.addEventListener('click', function() {
	PhysicsSim.loadModel('Ball');
});
