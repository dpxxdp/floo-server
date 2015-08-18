'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Climate = mongoose.model('Climate'),
	_ = require('lodash');

/**
 * Create a Climate
 */
exports.create = function(req, res) {
	var climate = new Climate(req.body);
	climate.user = req.user;

	climate.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(climate);
		}
	});
};

/**
 * Show the current Climate
 */
exports.read = function(req, res) {
	res.jsonp(req.climate);
};

/**
 * Update a Climate
 */
exports.update = function(req, res) {
	var climate = req.climate ;

	climate = _.extend(climate , req.body);

	climate.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(climate);
		}
	});
};

/**
 * Delete an Climate
 */
exports.delete = function(req, res) {
	var climate = req.climate ;

	climate.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(climate);
		}
	});
};

/**
 * List of Climates
 */
exports.list = function(req, res) { 
	Climate.find().sort('-created').populate('user', 'displayName').exec(function(err, climates) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(climates);
		}
	});
};

/**
 * Climate middleware
 */
exports.climateByID = function(req, res, next, id) { 
	Climate.findById(id).populate('user', 'displayName').exec(function(err, climate) {
		if (err) return next(err);
		if (! climate) return next(new Error('Failed to load Climate ' + id));
		req.climate = climate ;
		next();
	});
};

/**
 * Climate authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.climate.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
