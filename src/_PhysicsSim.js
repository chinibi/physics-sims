var PhysicsSim = {
	canvas: null,
	ctx: null,
	animationID: null,
	iterMethod: {},
	model: {},

	activeModel: {},

	init: function(canvasElementSelector) {
		var canvas = document.getElementById(canvasElementSelector);
		PhysicsSim.canvas = canvas;
		PhysicsSim.ctx = canvas.getContext('2d');
	},

	animateModel: function() {
		PhysicsSim.ctx.clearRect(0, 0, PhysicsSim.canvas.clientWidth, PhysicsSim.canvas.clientHeight);
		PhysicsSim.activeModel.draw();
		PhysicsSim.activeModel.setNextPosition();
		PhysicsSim.animationID = window.requestAnimationFrame(PhysicsSim.animateModel);
	},

	loadModel: function(modelName) {
		window.cancelAnimationFrame(PhysicsSim.animationID);
		PhysicsSim.activeModel = new PhysicsSim.model[modelName];
		PhysicsSim.animateModel();
	}
};
