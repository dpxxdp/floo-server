'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Geo = mongoose.model('Geo'),
	_ = require('lodash');

/**
 * Create a Geo
 */
exports.create = function(req, res) {
	var geo = new Geo(req.body);
	geo.user = req.user;

	geo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(geo);
		}
	});
};

/**
 * Show the current Geo
 */
exports.read = function(req, res) {
	res.jsonp(req.geo);
};

/**
 * Update a Geo
 */
exports.update = function(req, res) {
	var geo = req.geo ;

	geo = _.extend(geo , req.body);

	geo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(geo);
		}
	});
};

/**
 * Delete an Geo
 */
exports.delete = function(req, res) {
	var geo = req.geo ;

	geo.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(geo);
		}
	});
};

/**
 * List of Geos
 */
exports.list = function(req, res) { 
	Geo.find().sort('-created').populate('user', 'displayName').exec(function(err, geos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(geos);
		}
	});
};

/**
 * Geo middleware
 */
exports.geoByID = function(req, res, next, id) { 
	Geo.findById(id).populate('user', 'displayName').exec(function(err, geo) {
		if (err) return next(err);
		if (! geo) return next(new Error('Failed to load Geo ' + id));
		req.geo = geo ;
		next();
	});
};

/**
 * Geo authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.geo.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
