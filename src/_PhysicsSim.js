var PhysicsSim = {
	// canvas: document.getElementById(canvasElementSelector);
	// this.ctx = null;
	//
	// this.init = function() {
	// 	if (!this.canvas) {
	// 		console.error('No element was selected to display the sim on.');
	// 		return false;
	// 	}
	//
	// 	// Initialize the canvas element
	// 	this.ctx = this.canvas.getContext('2d');
	//
	// 	// change to Cartesian coordinates
	// 	this.ctx.scale(1, -1);
	//
	// 	// The origin will be set by the currently selected simulation
	// }
	ctx: null,
	iterMethod: {},
	model: {},

	activeModel: {},

	init: function(canvasElementSelector) {
		var canvas = document.getElementById(canvasElementSelector);
		PhysicsSim.ctx = canvas.getContext('2d');
	},

	loadModel: function(modelName) {
		PhysicsSim.activeModel = new PhysicsSim.model[modelName];
		PhysicsSim.activeModel.draw();
	}
};

document.addEventListener('DOMContentLoaded', function() {
	PhysicsSim.init('sim-canvas');
	PhysicsSim.loadModel('Ball');
});
