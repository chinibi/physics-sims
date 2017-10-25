/**
 * A placeholder model to test canvas drawing
 *
 */

PhysicsSim.model.Ball = function(params) {
	this.x = params.x;
	this.y = params.y;
	this.radius = params.r;
	this.dx = params.dx;
	this.dy = params.dy;
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

var $loadButton = document.getElementById('controls-change-model');
$loadButton.addEventListener('click', function() {
	var params = {
		x:  Number(document.getElementById('controls-ball-pos-x').value) || 200,
		y:  Number(document.getElementById('controls-ball-pos-y').value)  || 300,
		r:  Number(document.getElementById('controls-ball-radius').value) || 5,
		dx: Number(document.getElementById('controls-ball-vel-x').value) || 0,
		dy: Number(document.getElementById('controls-ball-vel-y').value) || 0
	};

	PhysicsSim.loadModel('Ball', params);
});
