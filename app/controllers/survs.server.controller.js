'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Surv = mongoose.model('Surv'),
	_ = require('lodash');

/**
 * Create a Surv
 */
exports.create = function(req, res) {
	console.log(req);
	var surv = new Surv(req.body);
	surv.user = req.user;

	surv.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(surv);
		}
	});
};

/**
 * Show the current Surv
 */
exports.read = function(req, res) {
	res.jsonp(req.surv);
};

/**
 * Update a Surv
 */
exports.update = function(req, res) {
	var surv = req.surv ;

	surv = _.extend(surv , req.body);

	surv.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(surv);
		}
	});
};

/**
 * Delete an Surv
 */
exports.delete = function(req, res) {
	var surv = req.surv ;

	surv.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(surv);
		}
	});
};

/**
 * List of Survs
 */
exports.list = function(req, res) { 
	Surv.find().sort('-created').populate('user', 'displayName').exec(function(err, survs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(survs);
		}
	});
};

/**
 * Surv middleware
 */
exports.survByID = function(req, res, next, id) { 
	Surv.findById(id).populate('user', 'displayName').exec(function(err, surv) {
		if (err) return next(err);
		if (! surv) return next(new Error('Failed to load Surv ' + id));
		req.surv = surv ;
		next();
	});
};

/**
 * Surv authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.surv.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
