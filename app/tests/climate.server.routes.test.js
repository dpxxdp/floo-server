'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Climate = mongoose.model('Climate'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, climate;

/**
 * Climate routes tests
 */
describe('Climate CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Climate
		user.save(function() {
			climate = {
				name: 'Climate Name'
			};

			done();
		});
	});

	it('should be able to save Climate instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Climate
				agent.post('/climates')
					.send(climate)
					.expect(200)
					.end(function(climateSaveErr, climateSaveRes) {
						// Handle Climate save error
						if (climateSaveErr) done(climateSaveErr);

						// Get a list of Climates
						agent.get('/climates')
							.end(function(climatesGetErr, climatesGetRes) {
								// Handle Climate save error
								if (climatesGetErr) done(climatesGetErr);

								// Get Climates list
								var climates = climatesGetRes.body;

								// Set assertions
								(climates[0].user._id).should.equal(userId);
								(climates[0].name).should.match('Climate Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Climate instance if not logged in', function(done) {
		agent.post('/climates')
			.send(climate)
			.expect(401)
			.end(function(climateSaveErr, climateSaveRes) {
				// Call the assertion callback
				done(climateSaveErr);
			});
	});

	it('should not be able to save Climate instance if no name is provided', function(done) {
		// Invalidate name field
		climate.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Climate
				agent.post('/climates')
					.send(climate)
					.expect(400)
					.end(function(climateSaveErr, climateSaveRes) {
						// Set message assertion
						(climateSaveRes.body.message).should.match('Please fill Climate name');
						
						// Handle Climate save error
						done(climateSaveErr);
					});
			});
	});

	it('should be able to update Climate instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Climate
				agent.post('/climates')
					.send(climate)
					.expect(200)
					.end(function(climateSaveErr, climateSaveRes) {
						// Handle Climate save error
						if (climateSaveErr) done(climateSaveErr);

						// Update Climate name
						climate.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Climate
						agent.put('/climates/' + climateSaveRes.body._id)
							.send(climate)
							.expect(200)
							.end(function(climateUpdateErr, climateUpdateRes) {
								// Handle Climate update error
								if (climateUpdateErr) done(climateUpdateErr);

								// Set assertions
								(climateUpdateRes.body._id).should.equal(climateSaveRes.body._id);
								(climateUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Climates if not signed in', function(done) {
		// Create new Climate model instance
		var climateObj = new Climate(climate);

		// Save the Climate
		climateObj.save(function() {
			// Request Climates
			request(app).get('/climates')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Climate if not signed in', function(done) {
		// Create new Climate model instance
		var climateObj = new Climate(climate);

		// Save the Climate
		climateObj.save(function() {
			request(app).get('/climates/' + climateObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', climate.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Climate instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Climate
				agent.post('/climates')
					.send(climate)
					.expect(200)
					.end(function(climateSaveErr, climateSaveRes) {
						// Handle Climate save error
						if (climateSaveErr) done(climateSaveErr);

						// Delete existing Climate
						agent.delete('/climates/' + climateSaveRes.body._id)
							.send(climate)
							.expect(200)
							.end(function(climateDeleteErr, climateDeleteRes) {
								// Handle Climate error error
								if (climateDeleteErr) done(climateDeleteErr);

								// Set assertions
								(climateDeleteRes.body._id).should.equal(climateSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Climate instance if not signed in', function(done) {
		// Set Climate user 
		climate.user = user;

		// Create new Climate model instance
		var climateObj = new Climate(climate);

		// Save the Climate
		climateObj.save(function() {
			// Try deleting Climate
			request(app).delete('/climates/' + climateObj._id)
			.expect(401)
			.end(function(climateDeleteErr, climateDeleteRes) {
				// Set message assertion
				(climateDeleteRes.body.message).should.match('User is not logged in');

				// Handle Climate error error
				done(climateDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Climate.remove().exec();
		done();
	});
});