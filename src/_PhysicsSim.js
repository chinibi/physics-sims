var PhysicsSim = {
	canvas: null,
	ctx: null,
	animationID: null,
	iterMethod: {},
	model: {},
	settings: {
		lengthScale: 100, // the number of pixels representing one meter
		zoomScale: 1, // zoom in and out by multiplying lengths by this factor
		stepSize: 1 / 60
	},
	isAnimating: false,

	activeModel: {},

	init: function(canvasElementSelector) {
		var canvas = document.getElementById(canvasElementSelector);
		PhysicsSim.canvas = canvas;
		PhysicsSim.ctx = canvas.getContext('2d');
		PhysicsSim.canvas.addEventListener('wheel', function(e) {
			PhysicsSim.settings.zoomScale += e.deltaY > 0 ? 0.1 : -0.1;
			return false;
		});
	},

	drawModel: function() {
		if (!PhysicsSim.activeModel) {
			return false;
		}

		PhysicsSim.ctx.clearRect(0, 0, PhysicsSim.canvas.clientWidth, PhysicsSim.canvas.clientHeight);
		PhysicsSim.activeModel.draw();
	},

	animateModel: function() {
		PhysicsSim.isAnimating = true;
		PhysicsSim.ctx.clearRect(0, 0, PhysicsSim.canvas.clientWidth, PhysicsSim.canvas.clientHeight);
		PhysicsSim.activeModel.draw();
		PhysicsSim.activeModel.setNextPosition();
		PhysicsSim.animationID = window.requestAnimationFrame(PhysicsSim.animateModel);
	},

	loadModel: function(modelName, optionalParams) {
		PhysicsSim.activeModel = new PhysicsSim.model[modelName](optionalParams);
		PhysicsSim.drawModel();
	},

	runModel: function(modelName, optionalParams) {
		if (!optionalParams) {
			optionalParams = null;
		}

		if (PhysicsSim.animationID) {
			window.cancelAnimationFrame(PhysicsSim.animationID);
		}
		
		PhysicsSim.activeModel = new PhysicsSim.model[modelName](optionalParams);
		PhysicsSim.animateModel();
	}
};

document.addEventListener('DOMContentLoaded', function() {
	PhysicsSim.init('sim-canvas');
});