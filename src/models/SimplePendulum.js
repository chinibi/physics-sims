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

PhysicsSim.model.SimplePendulum = function (pendulumLength, initialTheta, stepSize) {
	this.pendulumLength = !isNaN(pendulumLength) && isFinite(pendulumLength) ? pendulumLength: 1;
	this.initialTheta = !isNaN(initialTheta) && isFinite(initialTheta) ? initialTheta : Math.PI/4;
	this.initialOmega = 0;
	this.stepSize = stepSize;

	this.time = 0;
	this.theta = initialTheta;
	this.omega = 0;

	this.ode1 = function(time = null, theta = null, omega = null) {
		return omega;
	}

	this.ode2 = function(time = null, theta = null, omega = null) {
		var g = 9.81;
		return -1 * g * Math.sin(theta) / this.pendulumLength;
	}

	this.nextStep = function() {
		var result = SecondOrderODE_RK(this.ode1, this.ode2, this.stepSize, this.time, this.theta, this.omega);
		this.time += this.stepSize;
		this.theta = result.nextY;
		this.omega = result.nextZ;
	}

	this.getState = function() {
		return {t: this.time, theta: this.theta, omega: this.omega};
	}
}
