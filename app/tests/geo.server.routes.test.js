'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Geo = mongoose.model('Geo'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, geo;

/**
 * Geo routes tests
 */
describe('Geo CRUD tests', function() {
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

		// Save a user to the test db and create new Geo
		user.save(function() {
			geo = {
				name: 'Geo Name'
			};

			done();
		});
	});

	it('should be able to save Geo instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Geo
				agent.post('/geos')
					.send(geo)
					.expect(200)
					.end(function(geoSaveErr, geoSaveRes) {
						// Handle Geo save error
						if (geoSaveErr) done(geoSaveErr);

						// Get a list of Geos
						agent.get('/geos')
							.end(function(geosGetErr, geosGetRes) {
								// Handle Geo save error
								if (geosGetErr) done(geosGetErr);

								// Get Geos list
								var geos = geosGetRes.body;

								// Set assertions
								(geos[0].user._id).should.equal(userId);
								(geos[0].name).should.match('Geo Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Geo instance if not logged in', function(done) {
		agent.post('/geos')
			.send(geo)
			.expect(401)
			.end(function(geoSaveErr, geoSaveRes) {
				// Call the assertion callback
				done(geoSaveErr);
			});
	});

	it('should not be able to save Geo instance if no name is provided', function(done) {
		// Invalidate name field
		geo.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Geo
				agent.post('/geos')
					.send(geo)
					.expect(400)
					.end(function(geoSaveErr, geoSaveRes) {
						// Set message assertion
						(geoSaveRes.body.message).should.match('Please fill Geo name');
						
						// Handle Geo save error
						done(geoSaveErr);
					});
			});
	});

	it('should be able to update Geo instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Geo
				agent.post('/geos')
					.send(geo)
					.expect(200)
					.end(function(geoSaveErr, geoSaveRes) {
						// Handle Geo save error
						if (geoSaveErr) done(geoSaveErr);

						// Update Geo name
						geo.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Geo
						agent.put('/geos/' + geoSaveRes.body._id)
							.send(geo)
							.expect(200)
							.end(function(geoUpdateErr, geoUpdateRes) {
								// Handle Geo update error
								if (geoUpdateErr) done(geoUpdateErr);

								// Set assertions
								(geoUpdateRes.body._id).should.equal(geoSaveRes.body._id);
								(geoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Geos if not signed in', function(done) {
		// Create new Geo model instance
		var geoObj = new Geo(geo);

		// Save the Geo
		geoObj.save(function() {
			// Request Geos
			request(app).get('/geos')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Geo if not signed in', function(done) {
		// Create new Geo model instance
		var geoObj = new Geo(geo);

		// Save the Geo
		geoObj.save(function() {
			request(app).get('/geos/' + geoObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', geo.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Geo instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Geo
				agent.post('/geos')
					.send(geo)
					.expect(200)
					.end(function(geoSaveErr, geoSaveRes) {
						// Handle Geo save error
						if (geoSaveErr) done(geoSaveErr);

						// Delete existing Geo
						agent.delete('/geos/' + geoSaveRes.body._id)
							.send(geo)
							.expect(200)
							.end(function(geoDeleteErr, geoDeleteRes) {
								// Handle Geo error error
								if (geoDeleteErr) done(geoDeleteErr);

								// Set assertions
								(geoDeleteRes.body._id).should.equal(geoSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Geo instance if not signed in', function(done) {
		// Set Geo user 
		geo.user = user;

		// Create new Geo model instance
		var geoObj = new Geo(geo);

		// Save the Geo
		geoObj.save(function() {
			// Try deleting Geo
			request(app).delete('/geos/' + geoObj._id)
			.expect(401)
			.end(function(geoDeleteErr, geoDeleteRes) {
				// Set message assertion
				(geoDeleteRes.body.message).should.match('User is not logged in');

				// Handle Geo error error
				done(geoDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Geo.remove().exec();
		done();
	});
});