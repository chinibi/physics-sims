/**
 * Double pendulum
 *
 * A double pendulum is a pendulum with another pendulum attached to its bob.
 *
 * While the single pendulum's motion is simple and easily tracked,
 * just this addition of a second pendulum causes the system to have 
 * dynamic, chaotic, and erratic behavior.  The sets of equations 
 * needed to predict the motion of each pendulum are more complicated.
 *
 * Length units are in centimeters. 1px = 1cm.
 */

PhysicsSim.model.DoublePendulum = function (params) {
	this.pendulum1 = {
		color: 'red',
		length: params.pendulum1.length || 80,
		initialTheta: params.pendulum1.theta || Math.PI/4,
		initialOmega: 0,
		mass: params.pendulum1.mass || 1,
		theta: params.pendulum1.theta || Math.PI/4,
		omega: 0,
		origin: {
			x: 250.5, 
			y: 180.5
		},
		ode1: function(time, pendulum1, pendulum2) {
			return pendulum1.omega;
		},
		ode2: function(time, pendulum1, pendulum2) {
			// this equation is too long to write it out all at once
			// so it will be split up into smaller parts
			var g = 9.81 * 100;
			var terms = {
				a: (2*pendulum1.mass + pendulum2.mass) * g * Math.sin(pendulum1.theta),
				b: pendulum2.mass * g * Math.sin(pendulum1.theta - 2*pendulum2.theta),
				c: 2*pendulum2.mass*Math.sin(pendulum1.theta - pendulum2.theta),
				d: pendulum2.omega**2 * pendulum2.length,
				e: pendulum1.omega**2 * pendulum1.length * Math.cos(pendulum1.theta - pendulum2.theta),
				f: pendulum1.length * (2*pendulum1.mass + pendulum2.mass - pendulum2.mass*Math.cos(2*(pendulum1.theta - pendulum2.theta)))
			};

			var fullEquation = -1 * (terms.a + terms.b + terms.c * (terms.d + terms.e)) / (terms.f);

			return fullEquation;
		}
	};

	this.pendulum2 = {
		color: 'blue',
		length: params.pendulum2.length || 80,
		initialTheta: params.pendulum2.theta || (3/4) * Math.PI,
		initialOmega: 0,
		mass: params.pendulum2.mass || 1,
		theta: params.pendulum2.theta || (3/4) * Math.PI,
		omega: 0,
		origin: { // pendulum2 begins at pendulum1's bob
			x: this.pendulum1.length*Math.sin(this.pendulum1.theta) + this.pendulum1.origin.x, 
			y: this.pendulum1.length*Math.cos(this.pendulum1.theta) + this.pendulum1.origin.y
		},
		ode1: function(time, pendulum1, pendulum2) {
			return pendulum2.omega;
		},
		ode2: function(time, pendulum1, pendulum2) {
			var g = 9.81 * 100;
			var terms = {
				a: 2*Math.sin(pendulum1.theta - pendulum2.theta),
				b: pendulum1.omega**2 * pendulum1.length * (pendulum1.mass + pendulum2.mass),
				c: g * (pendulum1.mass + pendulum2.mass) * Math.cos(pendulum1.theta),
				d: pendulum2.omega**2 * pendulum2.length * pendulum2.mass * Math.cos(pendulum1.theta - pendulum2.theta),
				e: pendulum2.length * (2*pendulum1.mass + pendulum2.mass - pendulum2.mass*Math.cos(2*(pendulum1.theta - pendulum2.theta)))
			};

			var fullEquation = terms.a * (terms.b + terms.c + terms.d) / terms.e;

			return fullEquation;
		}
	};

	this.time = 0;

	this.drawPendulum = function(pendulum, index) {
		// Convert polar to Cartesian
		if (index === 1) {
			var xPos = PhysicsSim.settings.zoomScale * this.pendulum1.length * Math.sin(this.pendulum1.theta);
			var yPos = PhysicsSim.settings.zoomScale * this.pendulum1.length * Math.cos(this.pendulum1.theta); // the minus sign is absorbed into the y-axis coordinate (down is the positive-y direction).
		}
		else if (index === 2) {
			var xPos = PhysicsSim.settings.zoomScale * this.pendulum2.length * Math.sin(this.pendulum2.theta) + PhysicsSim.settings.zoomScale * this.pendulum1.length * Math.sin(this.pendulum1.theta);
			var yPos = PhysicsSim.settings.zoomScale * this.pendulum2.length * Math.cos(this.pendulum2.theta) + PhysicsSim.settings.zoomScale * this.pendulum1.length * Math.cos(this.pendulum1.theta); // the minus sign is absorbed into the y-axis coordinate (down is the positive-y direction).
		}
		var ballRadius = PhysicsSim.settings.zoomScale * 10;

		PhysicsSim.ctx.save();
		PhysicsSim.ctx.translate(this.pendulum1.origin.x, this.pendulum1.origin.y);
		PhysicsSim.ctx.beginPath();
		PhysicsSim.ctx.moveTo(0, 0);
		PhysicsSim.ctx.lineWidth = 1.0 * PhysicsSim.settings.zoomScale;
		PhysicsSim.ctx.lineTo(xPos, yPos);
		PhysicsSim.ctx.stroke();
		PhysicsSim.ctx.closePath();
		PhysicsSim.ctx.arc(xPos, yPos, ballRadius, 0, 2*Math.PI);
		PhysicsSim.ctx.fillStyle = pendulum.color;
		PhysicsSim.ctx.fill();
		PhysicsSim.ctx.restore();
	};

	this.draw = function() {
		var x1Pos = PhysicsSim.settings.zoomScale * this.pendulum1.length * Math.sin(this.pendulum1.theta);
		var y1Pos = PhysicsSim.settings.zoomScale * this.pendulum1.length * Math.cos(this.pendulum1.theta); // the minus sign is absorbed into the y-axis coordinate (down is the positive-y direction).
		var x2Pos = PhysicsSim.settings.zoomScale * this.pendulum2.length * Math.sin(this.pendulum2.theta) + PhysicsSim.settings.zoomScale * this.pendulum1.length * Math.sin(this.pendulum1.theta);
		var y2Pos = PhysicsSim.settings.zoomScale * this.pendulum2.length * Math.cos(this.pendulum2.theta) + PhysicsSim.settings.zoomScale * this.pendulum1.length * Math.cos(this.pendulum1.theta); // the minus sign is absorbed into the y-axis coordinate (down is the positive-y direction).
		var ballRadius = PhysicsSim.settings.zoomScale * 10;

		PhysicsSim.ctx.save();
		PhysicsSim.ctx.translate(this.pendulum1.origin.x, this.pendulum1.origin.y);
		PhysicsSim.ctx.beginPath();
		PhysicsSim.ctx.moveTo(0, 0);
		PhysicsSim.ctx.lineWidth = 1.0 * PhysicsSim.settings.zoomScale;
		PhysicsSim.ctx.lineTo(x1Pos, y1Pos);
		PhysicsSim.ctx.stroke();
		PhysicsSim.ctx.closePath();
		PhysicsSim.ctx.arc(x1Pos, y1Pos, ballRadius, 0, 2*Math.PI);
		PhysicsSim.ctx.fillStyle = this.pendulum1.color;
		PhysicsSim.ctx.fill();
		PhysicsSim.ctx.beginPath();
		PhysicsSim.ctx.moveTo(x1Pos, y1Pos);
		PhysicsSim.ctx.lineTo(x2Pos, y2Pos);
		PhysicsSim.ctx.stroke();
		PhysicsSim.ctx.closePath();
		PhysicsSim.ctx.arc(x2Pos, y2Pos, ballRadius, 0, 2*Math.PI);
		PhysicsSim.ctx.fillStyle = this.pendulum2.color;
		PhysicsSim.ctx.fill();
		PhysicsSim.ctx.restore();
	};

	this.setNextPosition = function() {
		var result = PhysicsSim.iterMethod.RungeKutta_DoublePendulum(this.pendulum1, this.pendulum2, PhysicsSim.settings.stepSize, this.time);
		this.time += PhysicsSim.settings.stepSize;
		this.pendulum1.theta = result.pend1Next.theta;
		this.pendulum1.omega = result.pend1Next.omega;
		this.pendulum2.theta = result.pend2Next.theta;
		this.pendulum2.omega = result.pend2Next.omega;
		this.pendulum2.origin = { // pendulum2 begins at pendulum1's bob
			x: this.pendulum1.length*Math.sin(this.pendulum1.theta) + this.pendulum1.origin.x, 
			y: this.pendulum1.length*Math.cos(this.pendulum1.theta) + this.pendulum1.origin.y
		};
	};

	this.getState = function() {
		return {
			t: this.time, 
			pendulum1: this.pendulum1, 
			pendulum2: this.pendulum2
		};
	};

	this.getInputs = function() {
		var params = {
			pendulum1: {
				theta:  Number(document.getElementById('controls-pen1-pos-theta').value) || 45, // degrees
				length: Number(document.getElementById('controls-pen1-length').value) || 80,
				mass: Number(document.getElementById('controls-pen1-mass').value) || 1
			},
			pendulum2: {
				theta:  Number(document.getElementById('controls-pen2-pos-theta').value) || 135, // degrees
				length: Number(document.getElementById('controls-pen2-length').value) || 80,
				mass: Number(document.getElementById('controls-pen2-mass').value) || 1
			}
		};
		params.pendulum1.theta *= Math.PI/180;
		params.pendulum2.theta *= Math.PI/180;

		return params;
	};
};

document.addEventListener('DOMContentLoaded', function() {
	var params = {
		pendulum1: {
			theta:  Number(document.getElementById('controls-pen1-pos-theta').value) || 45, // degrees
			length: Number(document.getElementById('controls-pen1-length').value) || 80,
			mass: Number(document.getElementById('controls-pen1-mass').value) || 1
		},
		pendulum2: {
			theta:  Number(document.getElementById('controls-pen2-pos-theta').value) || 135, // degrees
			length: Number(document.getElementById('controls-pen2-length').value) || 80,
			mass: Number(document.getElementById('controls-pen2-mass').value) || 1
		}
	};
	params.pendulum1.theta *= Math.PI/180;
	params.pendulum2.theta *= Math.PI/180;

	PhysicsSim.loadModel('DoublePendulum', params);

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
				PhysicsSim.loadModel('DoublePendulum', params);
			}
		});
	}

	var $runButton = document.getElementById('controls-run-model');
	$runButton.addEventListener('click', function() {
		if (!PhysicsSim.isAnimating) {
			var params = PhysicsSim.activeModel.getInputs();
			$runButton.innerHTML = 'Pause';
			if (!PhysicsSim.isActive) {
				PhysicsSim.runModel('DoublePendulum', params);
			} else {
				PhysicsSim.animateModel();
			}
		} else {
			$runButton.innerHTML = 'Run';
			PhysicsSim.pauseModel();
		}
	});

	var $nextFrameButton = document.getElementById('controls-nextframe-model');
	$nextFrameButton.addEventListener('click', function() {
		PhysicsSim.ctx.clearRect(0, 0, PhysicsSim.canvas.clientWidth, PhysicsSim.canvas.clientHeight);
		PhysicsSim.activeModel.setNextPosition();
		PhysicsSim.activeModel.draw();
	})

	var $stopButton = document.getElementById('controls-stop-model');
	$stopButton.addEventListener('click', function() {
		PhysicsSim.stopModel();
		var params = PhysicsSim.activeModel.getInputs();
		$runButton.innerHTML = 'Run';
		PhysicsSim.loadModel('DoublePendulum', params);
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

	// PhysicsSim.canvas.addEventListener('mousemove', function(e) {
	// 	if (PhysicsSim.isDragging) {
	// 		if (PhysicsSim.isAnimating) {
	// 			PhysicsSim.isAnimating = false;
	// 			PhysicsSim.isActive = false;
	// 			$runButton.innerHTML = 'Run';
	// 			window.cancelAnimationFrame(PhysicsSim.animationID);
	// 		}

	// 		var rect = PhysicsSim.canvas.getBoundingClientRect();
	// 		var origin = PhysicsSim.activeModel.origin;
	// 		var mouseCartesian = {
	// 			x: e.clientX - rect.left - origin.x,
	// 			y: e.clientY - rect.top - origin.y
	// 		};

	// 		// Usually it's Math.atan2(y,x) but we want theta to start from the negative-y axis going counterclockwise
	// 		var mouseAngle = Math.atan2(mouseCartesian.x, mouseCartesian.y);

	// 		document.getElementById('controls-ball-pos-theta').value = Math.floor(mouseAngle * (180 / Math.PI));
	// 		var params = {
	// 			theta:  mouseAngle, // degrees
	// 			length: Number(document.getElementById('controls-pen-length').value) || 80,
	// 			mass: Number(document.getElementById('controls-ball-mass').value) || 200
	// 		};
	// 		PhysicsSim.isActive = false;
	// 		PhysicsSim.loadModel('DoublePendulum', params);
	// 	}
	// });

	window.addEventListener('mouseup', function(e) {
		if (PhysicsSim.isDragging) {
			PhysicsSim.isDragging = false;
		}
	});
});