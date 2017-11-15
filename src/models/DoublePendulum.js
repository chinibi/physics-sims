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
		theta: this.pendulum1.initialTheta,
		omega: this.pendulum1.initialOmega,
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
		theta: this.pendulum2.initialTheta,
		omega: this.pendulum2.initialOmega,
		origin: { // pendulum2 begins at pendulum1's bob
			x: this.pendulum1.pendulumLength*Math.sin(this.pendulum1.theta) + this.pendulum1.origin.x, 
			y: this.pendulum1.pendulumLength*Math.cos(this.pendulum1.theta) + this.pendulum1.origin.y
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

	this.drawPendulum = function(pendulum) {
		// Convert polar to Cartesian
		var xPos = PhysicsSim.settings.zoomScale * pendulum.length * Math.sin(pendulum.theta);
		var yPos = PhysicsSim.settings.zoomScale * pendulum.length * Math.cos(pendulum.theta); // the minus sign is absorbed into the y-axis coordinate (down is the positive-y direction).
		var ballRadius = PhysicsSim.settings.zoomScale * 10;

		PhysicsSim.ctx.save();
		PhysicsSim.ctx.translate(pendulum.origin.x, pendulum.origin.y);
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
		this.drawPendulum(this.pendulum1);
		this.drawPendulum(this.pendulum2);
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