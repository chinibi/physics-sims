/**
 * Simple pendulum
 *
 * The equation of motion is: d²θ/dt² = -(g/l)sin(θ)
 * where θ is the angle from the negative y-axis going counterclockwise,
 * l is the length of the pendulum arm, and g is the acceleration from gravity.
 *
 * We need to use first-order ODEs to numerically calculate the motion
 * First define ω = dθ/dt. It follows that dω/dt = d²θ/dt² = - g*sin(θ) / l
 *
 * Our system to solve is now:
 *     dθ/dt = ω
 *     dω/dt = -(g/l)sin(θ)
 */

PhysicsSim.model.SimplePendulum = function (params) {
	this.pendulumLength = !isNaN(params.pendulumLength) && isFinite(params.pendulumLength) ? pendulumLength: 1;
	this.initialTheta = !isNaN(params.initialTheta) && isFinite(params.initialTheta) ? params.initialTheta : Math.PI/4;
	this.initialOmega = 0;
	this.stepSize = 1 / 60;

	this.time = 0;
	this.theta = params.initialTheta;
	this.omega = 0;

	this.ode1 = function(time = null, theta = null, omega = null) {
		return omega;
	}

	this.ode2 = function(time = null, theta = null, omega = null) {
		var g = 9.81;
		return -1 * g * Math.sin(theta) / this.pendulumLength;
	}

	this.draw = function() {
		PhysicsSim.ctx.save();
		PhysicsSim.ctx.translate(300, 0);
		
	}

	this.setNextPosition = function() {
		var result = PhysicsSim.iterMethod.RungeKutta_2ndOrderODE(this.ode1, this.ode2, this.stepSize, this.time, this.theta, this.omega);
		this.time += this.stepSize;
		this.theta = result.nextY;
		this.omega = result.nextZ;
	}

	this.getState = function() {
		return {t: this.time, theta: this.theta, omega: this.omega};
	}
}

var $loadButton = document.getElementById('controls-change-model');
$loadButton.addEventListener('click', function() {
	// var params = {
	// 	x:  Number(document.getElementById('controls-ball-pos-x').value) || 200,
	// 	y:  Number(document.getElementById('controls-ball-pos-y').value)  || 300,
	// 	r:  Number(document.getElementById('controls-ball-radius').value) || 5,
	// 	dx: Number(document.getElementById('controls-ball-vel-x').value) || 0,
	// 	dy: Number(document.getElementById('controls-ball-vel-y').value) || 0
	// };

	PhysicsSim.loadModel('SimplePendulum', params);
});