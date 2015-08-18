'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Climate Schema
 */
var ClimateSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Climate name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Climate', ClimateSchema);