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
	isActive: false,
	isAnimating: false,
	isDragging: false,

	activeModel: {},

	init: function(canvasElementSelector) {
		var simCanvas = document.getElementById(canvasElementSelector);
		PhysicsSim.canvas = simCanvas;
		PhysicsSim.ctx = simCanvas.getContext('2d');
	},

	drawModel: function() {
		if (!PhysicsSim.activeModel) {
			console.error('drawModel requires a model be loaded.');
			return false;
		}

		PhysicsSim.ctx.clearRect(0, 0, PhysicsSim.canvas.clientWidth, PhysicsSim.canvas.clientHeight);
		PhysicsSim.activeModel.draw();
	},

	animateModel: function() {
		if (!PhysicsSim.activeModel) {
			console.error('animateModel requires a model be loaded.');
			return false;
		}

		PhysicsSim.isAnimating = true;
		PhysicsSim.ctx.clearRect(0, 0, PhysicsSim.canvas.clientWidth, PhysicsSim.canvas.clientHeight);
		PhysicsSim.activeModel.draw();
		PhysicsSim.activeModel.setNextPosition();
		PhysicsSim.animationID = window.requestAnimationFrame(PhysicsSim.animateModel);
	},

	pauseModel: function() {
		if (PhysicsSim.isAnimating && PhysicsSim.animationID) {
			PhysicsSim.isAnimating = false;
			window.cancelAnimationFrame(PhysicsSim.animationID);
		}
	},

	stopModel: function() {
		if (PhysicsSim.isActive) {
			PhysicsSim.isActive = false;
			PhysicsSim.isAnimating = false;
			window.cancelAnimationFrame(PhysicsSim.animationID);
		}
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
		
		//PhysicsSim.activeModel = new PhysicsSim.model[modelName](optionalParams);
		PhysicsSim.isActive = true;
		PhysicsSim.isAnimating = true;
		PhysicsSim.animateModel();
	}
};

document.addEventListener('DOMContentLoaded', function() {
	PhysicsSim.init('sim-canvas');
});