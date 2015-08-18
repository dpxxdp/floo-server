'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Surv = mongoose.model('Surv'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, surv;

/**
 * Surv routes tests
 */
describe('Surv CRUD tests', function() {
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

		// Save a user to the test db and create new Surv
		user.save(function() {
			surv = {
				name: 'Surv Name'
			};

			done();
		});
	});

	it('should be able to save Surv instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Surv
				agent.post('/survs')
					.send(surv)
					.expect(200)
					.end(function(survSaveErr, survSaveRes) {
						// Handle Surv save error
						if (survSaveErr) done(survSaveErr);

						// Get a list of Survs
						agent.get('/survs')
							.end(function(survsGetErr, survsGetRes) {
								// Handle Surv save error
								if (survsGetErr) done(survsGetErr);

								// Get Survs list
								var survs = survsGetRes.body;

								// Set assertions
								(survs[0].user._id).should.equal(userId);
								(survs[0].name).should.match('Surv Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Surv instance if not logged in', function(done) {
		agent.post('/survs')
			.send(surv)
			.expect(401)
			.end(function(survSaveErr, survSaveRes) {
				// Call the assertion callback
				done(survSaveErr);
			});
	});

	it('should not be able to save Surv instance if no name is provided', function(done) {
		// Invalidate name field
		surv.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Surv
				agent.post('/survs')
					.send(surv)
					.expect(400)
					.end(function(survSaveErr, survSaveRes) {
						// Set message assertion
						(survSaveRes.body.message).should.match('Please fill Surv name');
						
						// Handle Surv save error
						done(survSaveErr);
					});
			});
	});

	it('should be able to update Surv instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Surv
				agent.post('/survs')
					.send(surv)
					.expect(200)
					.end(function(survSaveErr, survSaveRes) {
						// Handle Surv save error
						if (survSaveErr) done(survSaveErr);

						// Update Surv name
						surv.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Surv
						agent.put('/survs/' + survSaveRes.body._id)
							.send(surv)
							.expect(200)
							.end(function(survUpdateErr, survUpdateRes) {
								// Handle Surv update error
								if (survUpdateErr) done(survUpdateErr);

								// Set assertions
								(survUpdateRes.body._id).should.equal(survSaveRes.body._id);
								(survUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Survs if not signed in', function(done) {
		// Create new Surv model instance
		var survObj = new Surv(surv);

		// Save the Surv
		survObj.save(function() {
			// Request Survs
			request(app).get('/survs')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Surv if not signed in', function(done) {
		// Create new Surv model instance
		var survObj = new Surv(surv);

		// Save the Surv
		survObj.save(function() {
			request(app).get('/survs/' + survObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', surv.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Surv instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Surv
				agent.post('/survs')
					.send(surv)
					.expect(200)
					.end(function(survSaveErr, survSaveRes) {
						// Handle Surv save error
						if (survSaveErr) done(survSaveErr);

						// Delete existing Surv
						agent.delete('/survs/' + survSaveRes.body._id)
							.send(surv)
							.expect(200)
							.end(function(survDeleteErr, survDeleteRes) {
								// Handle Surv error error
								if (survDeleteErr) done(survDeleteErr);

								// Set assertions
								(survDeleteRes.body._id).should.equal(survSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Surv instance if not signed in', function(done) {
		// Set Surv user 
		surv.user = user;

		// Create new Surv model instance
		var survObj = new Surv(surv);

		// Save the Surv
		survObj.save(function() {
			// Try deleting Surv
			request(app).delete('/survs/' + survObj._id)
			.expect(401)
			.end(function(survDeleteErr, survDeleteRes) {
				// Set message assertion
				(survDeleteRes.body.message).should.match('User is not logged in');

				// Handle Surv error error
				done(survDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Surv.remove().exec();
		done();
	});
});