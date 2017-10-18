function RungeKutta(ode, stepSize, T_n, y_n) {
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
function SecondOrderODE_RK(ode1, ode2, stepSize, t, y, z) {
	let k = [];
	let l = [];

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

	return [yNext, zNext];
}

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
function pendulumODE1(time = null, theta = null, omega = null) {
	return omega;
}

function pendulumODE2(time = null, theta = null, omega = null) {
	const g = 9.81;
	const pendulumLength = 10;
	return -1 * g * Math.sin(theta) / pendulumLength;
}





/* Enter y'(t) */
/* y'(t) = -2 t y(t) */
function sampleODE(t, y) {
	return -2 * t * y;
}

//console.log(RungeKutta(sampleODE, 0.5, 0.5, 1.55729));

// Perform numerical computation

// Initial condition; enter y(0)
const stepSize = 0.2;
let theta = Math.PI/4;
let omega = 0;
for (t=0; t<10; t+=stepSize) {
	const result = SecondOrderODE_RK(pendulumODE1, pendulumODE2, stepSize, t, theta, omega);
	console.log({
		t,
		theta: result[0]
	});

	theta = result[0];
	omega = result[1];
}
