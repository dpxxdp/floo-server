'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var survs = require('../../app/controllers/survs.server.controller');

	// Survs Routes
	app.route('/survs')
		.get(users.requiresLogin, survs.list)
		.post(users.requiresLogin, survs.create);

	app.route('/survs/:survId')
		.get(survs.read)
		.put(users.requiresLogin, survs.hasAuthorization, survs.update)
		.delete(users.requiresLogin, survs.hasAuthorization, survs.delete);

	// Finish by binding the Surv middleware
	app.param('survId', survs.survByID);
};
