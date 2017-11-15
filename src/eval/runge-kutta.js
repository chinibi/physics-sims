PhysicsSim.iterMethod.RungeKutta = function(ode, stepSize, T_n, y_n) {
	var k1 = ode(T_n, y_n);
	console.log( 'k1: ', {t: T_n, y: y_n} );
	var k2 = ode(T_n + stepSize / 2, y_n + stepSize * k1 / 2);
	console.log( 'k2: ', {t: T_n + stepSize / 2, y: y_n + stepSize * k1 / 2} );
	var k3 = ode(T_n + stepSize / 2, y_n + stepSize * k2 / 2);
	console.log( 'k3: ', {t: T_n + stepSize / 2, y: y_n + stepSize * k2 / 2} );
	var k4 = ode(T_n + stepSize, y_n + stepSize * k3);
	console.log( 'k4: ', {t: T_n + stepSize, y: y_n + stepSize * k3} );

	var nextValue = y_n + (stepSize / 6) * (k1 + 2*k2 + 2*k3 + k4);

	return {
		t: T_n + stepSize,
		y: nextValue
	};
}

/**
 * Perform a single Runge-Kutta iteration on a second order ODE,
 * split into a system of two first-order ODEs
 *
 * @param ode1,ode2 1st order ODEs to be iterated over
 * @param stepSize lower values give greater resolution and accuracy in exchange for computation time
 * @param t the current value of the independent variable, increased by stepSize each iteration
 * @param y,z the current approximate value of the functions at t being solved for in the ODEs
 */
PhysicsSim.iterMethod.RungeKutta_2ndOrderODE = function(ode1, ode2, stepSize, t, y, z) {
	var k = [];
	var l = [];
	k[0] = ode1(t, y, z);
	l[0] = ode2(t, y, z);
	k[1] = ode1(t + stepSize / 2, y+k[0]*stepSize/2, z+l[0]*stepSize/2);
	l[1] = ode2(t + stepSize / 2, y+k[0]*stepSize/2, z+l[0]*stepSize/2);
	k[2] = ode1(t + stepSize / 2, y+k[1]*stepSize/2, z+l[1]*stepSize/2);
	l[2] = ode2(t + stepSize / 2, y+k[1]*stepSize/2, z+l[1]*stepSize/2);
	k[3] = ode1(t + stepSize    , y+k[2]*stepSize  , z+l[2]*stepSize  );
	l[3] = ode2(t + stepSize    , y+k[2]*stepSize  , z+l[2]*stepSize  );

	yNext = y + (stepSize / 6) * (k[0] + 2*k[1] + 2*k[2] + k[3]);
	zNext = z + (stepSize / 6) * (l[0] + 2*l[1] + 2*l[2] + l[3]);
	return {yNext: yNext, zNext: zNext};
}

PhysicsSim.iterMethod.RungeKutta_DoublePendulum = function(body1, body2, stepSize, t) {
	var bodies = [body1, body2];

	var o1 = []; // next position of pendulum 1
	var w1 = []; // next speed of pendulum 1
	var o2 = []; // next position of pendulum 2
	var w2 = []; // next speed of pendulum 2

	for (var i=0; i<4; i++) {
		var stepModifier;
		switch(i) {
			case 0:
				stepModifier = 0;
				break;
			case 1:
			case 2:
				stepModifier = stepSize/2;
				break;
			case 3:
				stepModifier = stepSize;
				break;
		}

		var body1Params = Object.assign({}, body1);
		var body2Params = Object.assign({}, body2);
		if (i > 0) {
			body1Params.theta = body1.theta + o1[i-1]*stepModifier;
			body1Params.omega = body1.omega + w1[i-1]*stepModifier;
			body2Params.theta = body2.theta + o2[i-1]*stepModifier;
			body2Params.omega = body2.omega + w2[i-1]*stepModifier;
		}
		o1.push(body1.ode1(t+stepModifier, body1Params, body2Params));
		w1.push(body1.ode2(t+stepModifier, body1Params, body2Params));
		o2.push(body2.ode1(t+stepModifier, body1Params, body2Params));
		w2.push(body2.ode2(t+stepModifier, body1Params, body2Params));		
	}

	var pend1Next = {
		theta: body1.theta + (stepSize / 6) * (o1[0] + 2*o1[1] + 2*o1[2] + o1[3]),
		omega: body1.omega + (stepSize / 6) * (w1[0] + 2*w1[1] + 2*w1[2] + w1[3])
	};
	var pend2Next = {
		theta: body2.theta + (stepSize / 6) * (o2[0] + 2*o2[1] + 2*o2[2] + o2[3]),
		omega: body2.omega + (stepSize / 6) * (w2[0] + 2*w2[1] + 2*w2[2] + w2[3])
	};
	return {pend1Next: pend1Next, pend2Next: pend2Next};
} 
