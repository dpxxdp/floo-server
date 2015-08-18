'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var geos = require('../../app/controllers/geos.server.controller');

	// Geos Routes
	app.route('/geos')
		.get(geos.list)
		.post(users.requiresLogin, geos.create);

	app.route('/geos/:geoId')
		.get(geos.read)
		.put(users.requiresLogin, geos.hasAuthorization, geos.update)
		.delete(users.requiresLogin, geos.hasAuthorization, geos.delete);

	// Finish by binding the Geo middleware
	app.param('geoId', geos.geoByID);
};
