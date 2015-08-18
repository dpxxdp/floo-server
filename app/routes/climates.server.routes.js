'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var climates = require('../../app/controllers/climates.server.controller');

	// Climates Routes
	app.route('/climates')
		.get(climates.list)
		.post(users.requiresLogin, climates.create);

	app.route('/climates/:climateId')
		.get(climates.read)
		.put(users.requiresLogin, climates.hasAuthorization, climates.update)
		.delete(users.requiresLogin, climates.hasAuthorization, climates.delete);

	// Finish by binding the Climate middleware
	app.param('climateId', climates.climateByID);
};
