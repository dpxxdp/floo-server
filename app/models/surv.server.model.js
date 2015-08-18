'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Surv Schema
 */
var SurvSchema = new Schema({
	url: {
		type: String,
		required: 'Surv URL required'
	},
	recorded: {
		type: Date,
		required: 'Surv Recorded_Datetime required'
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	device: {
		type: Schema.ObjectId,
		ref: 'Device'
	}
});

mongoose.model('Surv', SurvSchema);
