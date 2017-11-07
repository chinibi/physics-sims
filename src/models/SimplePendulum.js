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
 *
 * Length units are in centimeters. 1px = 1cm.
 */

PhysicsSim.model.SimplePendulum = function (params) {
	//this.pendulumLength = !isNaN(params.pendulumLength) && isFinite(params.pendulumLength) ? pendulumLength: 200;
	//this.initialTheta = !isNaN(params.initialTheta) && isFinite(params.initialTheta) ? params.initialTheta : Math.PI/4;
	this.pendulumLength = params.length || 80;
	this.initialTheta = params.theta || Math.PI/4;
	this.initialOmega = 0;

	this.time = 0;
	this.theta = this.initialTheta;
	this.omega = 0;

	this.ode1 = (function(time = null, theta = null, omega = null) {
		return omega;
	}).bind(this);

	this.ode2 = (function(time = null, theta = null, omega = null) {
		var g = 9.81 * 100;
		return -1 * g * Math.sin(theta) / this.pendulumLength;
	}).bind(this);

	this.draw = function() {
		// Convert polar to Cartesian
		var xPos = PhysicsSim.settings.zoomScale * this.pendulumLength * Math.sin(this.theta);
		var yPos = PhysicsSim.settings.zoomScale * this.pendulumLength * Math.cos(this.theta); // the minus sign is absorbed into the y-axis coordinate (down is the positive-y direction).
		var ballRadius = PhysicsSim.settings.zoomScale * 10;

		PhysicsSim.ctx.save();
		PhysicsSim.ctx.translate(250.5, 180.5);
		PhysicsSim.ctx.beginPath();
		PhysicsSim.ctx.moveTo(0, 0);
		PhysicsSim.ctx.lineTo(xPos, yPos);
		PhysicsSim.ctx.stroke();
		PhysicsSim.ctx.closePath();
		PhysicsSim.ctx.arc(xPos, yPos, ballRadius, 0, 2*Math.PI);
		PhysicsSim.ctx.fillStyle = 'blue';
		PhysicsSim.ctx.fill();
		PhysicsSim.ctx.restore();
	}

	this.setNextPosition = function() {
		var result = PhysicsSim.iterMethod.RungeKutta_2ndOrderODE(this.ode1, this.ode2, PhysicsSim.settings.stepSize, this.time, this.theta, this.omega);
		this.time += this.stepSize;
		this.theta = result.yNext;
		this.omega = result.zNext;
	}

	this.getState = function() {
		return {t: this.time, theta: this.theta, omega: this.omega};
	}

	this.getInputs = function() {
		var params = {
			theta:  Number(document.getElementById('controls-ball-pos-theta').value) || 45, // degrees
			length: Number(document.getElementById('controls-pen-length').value) || 80,
			mass: Number(document.getElementById('controls-ball-mass').value) || 200
		};
		params.theta = params.theta * (Math.PI / 180);

		return params;
	}
}

document.addEventListener('DOMContentLoaded', function() {
	var params = {
		theta:  Number(document.getElementById('controls-ball-pos-theta').value) || 45, // degrees
		length: Number(document.getElementById('controls-pen-length').value) || 80,
		mass: Number(document.getElementById('controls-ball-mass').value) || 200
	};
	params.theta = params.theta * (Math.PI / 180);
	PhysicsSim.loadModel('SimplePendulum', params);
});

var $inputControls = document.getElementsByClassName('input-controls');
for (var i = 0; i < $inputControls.length; i++) {
	$inputControls[i].addEventListener('change', function() {
		var params = PhysicsSim.activeModel.getInputs();
		if (!PhysicsSim.isAnimating) {
			PhysicsSim.loadModel('SimplePendulum', params);
		}
	});
}

var $runButton = document.getElementById('controls-change-model');
$runButton.addEventListener('click', function() {
	var params = PhysicsSim.activeModel.getInputs();
	PhysicsSim.runModel('SimplePendulum', params);
});

