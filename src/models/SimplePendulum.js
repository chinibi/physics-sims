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
	this.pendulumLength = params.length || 80;
	this.initialTheta = params.theta || Math.PI/4;
	this.initialOmega = 0;
	this.origin = {x: 250.5, y: 180.5}; // location of the origin on the canvas

	this.time = 0;
	this.theta = this.initialTheta;
	this.omega = 0;

	this.ode1 = (function(time, theta, omega) {
		return omega;
	}).bind(this);

	this.ode2 = (function(time, theta, omega) {
		var g = 9.81 * 100;
		return -1 * g * Math.sin(theta) / this.pendulumLength;
	}).bind(this);

	this.draw = function() {
		// Convert polar to Cartesian
		var xPos = PhysicsSim.settings.zoomScale * this.pendulumLength * Math.sin(this.theta);
		var yPos = PhysicsSim.settings.zoomScale * this.pendulumLength * Math.cos(this.theta); // the minus sign is absorbed into the y-axis coordinate (down is the positive-y direction).
		var ballRadius = PhysicsSim.settings.zoomScale * 10;

		PhysicsSim.ctx.save();
		PhysicsSim.ctx.translate(this.origin.x, this.origin.y);
		PhysicsSim.ctx.beginPath();
		PhysicsSim.ctx.moveTo(0, 0);
		PhysicsSim.ctx.lineWidth = 1.0 * PhysicsSim.settings.zoomScale;
		PhysicsSim.ctx.lineTo(xPos, yPos);
		PhysicsSim.ctx.stroke();
		PhysicsSim.ctx.closePath();
		PhysicsSim.ctx.arc(xPos, yPos, ballRadius, 0, 2*Math.PI);
		PhysicsSim.ctx.fillStyle = 'blue';
		PhysicsSim.ctx.fill();
		PhysicsSim.ctx.restore();
	};

	this.setNextPosition = function() {
		var result = PhysicsSim.iterMethod.RungeKutta_2ndOrderODE(this.ode1, this.ode2, PhysicsSim.settings.stepSize, this.time, this.theta, this.omega);
		this.time += PhysicsSim.settings.stepSize;
		this.theta = result.yNext;
		this.omega = result.zNext;
	};

	this.getState = function() {
		return {t: this.time, theta: this.theta, omega: this.omega};
	};

	this.getInputs = function() {
		var params = {
			theta:  Number(document.getElementById('controls-ball-pos-theta').value) || 45, // degrees
			length: Number(document.getElementById('controls-pen-length').value) || 80,
			mass: Number(document.getElementById('controls-ball-mass').value) || 200
		};
		params.theta = params.theta * (Math.PI / 180);

		return params;
	};
};


document.addEventListener('DOMContentLoaded', function() {
	var params = {
		theta:  Number(document.getElementById('controls-ball-pos-theta').value) || 45, // degrees
		length: Number(document.getElementById('controls-pen-length').value) || 80,
		mass: Number(document.getElementById('controls-ball-mass').value) || 200
	};
	params.theta = params.theta * (Math.PI / 180);
	PhysicsSim.loadModel('SimplePendulum', params);

	/****
	 *
	 *	Event listeners
	 *
	 ****/
	var $inputControls = document.getElementsByClassName('input-controls');
	for (var i = 0; i < $inputControls.length; i++) {
		$inputControls[i].addEventListener('change', function() {
			var params = PhysicsSim.activeModel.getInputs();
			if (!PhysicsSim.isAnimating) {
				PhysicsSim.isActive = false;
				PhysicsSim.loadModel('SimplePendulum', params);
			}
		});
	}

	var $runButton = document.getElementById('controls-run-model');
	$runButton.addEventListener('click', function() {
		if (!PhysicsSim.isAnimating) {
			var params = PhysicsSim.activeModel.getInputs();
			$runButton.innerHTML = 'Pause';
			if (!PhysicsSim.isActive) {
				PhysicsSim.runModel('SimplePendulum', params);
			} else {
				PhysicsSim.animateModel();
			}
		} else {
			$runButton.innerHTML = 'Run';
			PhysicsSim.pauseModel();
		}
	});

	var $stopButton = document.getElementById('controls-stop-model');
	$stopButton.addEventListener('click', function() {
		PhysicsSim.stopModel();
		var params = {
			theta:  Number(document.getElementById('controls-ball-pos-theta').value) || 45, // degrees
			length: Number(document.getElementById('controls-pen-length').value) || 80,
			mass: Number(document.getElementById('controls-ball-mass').value) || 200
		};
		$runButton.innerHTML = 'Run';
		params.theta = params.theta * (Math.PI/180);
		PhysicsSim.loadModel('SimplePendulum', params);
	});

	PhysicsSim.canvas.addEventListener('wheel', function(e) {
		PhysicsSim.settings.zoomScale += e.deltaY > 0 ? 0.1 : -0.1;

		if (PhysicsSim.activeModel) {
			PhysicsSim.ctx.clearRect(0, 0, PhysicsSim.canvas.clientWidth, PhysicsSim.canvas.clientHeight)			
			PhysicsSim.activeModel.draw();
		}
		return false;
	});

	PhysicsSim.canvas.addEventListener('mousedown', function(e) {
		PhysicsSim.isDragging = true;
	});

	PhysicsSim.canvas.addEventListener('mousemove', function(e) {
		if (PhysicsSim.isDragging) {
			if (PhysicsSim.isAnimating) {
				PhysicsSim.isAnimating = false;
				PhysicsSim.isActive = false;
				$runButton.innerHTML = 'Run';
				window.cancelAnimationFrame(PhysicsSim.animationID);
			}

			var rect = PhysicsSim.canvas.getBoundingClientRect();
			var origin = PhysicsSim.activeModel.origin;
			var mouseCartesian = {
				x: e.clientX - rect.left - origin.x,
				y: e.clientY - rect.top - origin.y
			};

			// Usually it's Math.atan2(y,x) but we want theta to start from the negative-y axis going counterclockwise
			var mouseAngle = Math.atan2(mouseCartesian.x, mouseCartesian.y);

			document.getElementById('controls-ball-pos-theta').value = Math.floor(mouseAngle * (180 / Math.PI));
			var params = {
				theta:  mouseAngle, // degrees
				length: Number(document.getElementById('controls-pen-length').value) || 80,
				mass: Number(document.getElementById('controls-ball-mass').value) || 200
			};
			PhysicsSim.isActive = false;
			PhysicsSim.loadModel('SimplePendulum', params);
		}
	});

	window.addEventListener('mouseup', function(e) {
		if (PhysicsSim.isDragging) {
			PhysicsSim.isDragging = false;
		}
	});
});



