'use strict';

(function() {
	// Survs Controller Spec
	describe('Survs Controller Tests', function() {
		// Initialize global variables
		var SurvsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Survs controller.
			SurvsController = $controller('SurvsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Surv object fetched from XHR', inject(function(Survs) {
			// Create sample Surv using the Survs service
			var sampleSurv = new Survs({
				name: 'New Surv'
			});

			// Create a sample Survs array that includes the new Surv
			var sampleSurvs = [sampleSurv];

			// Set GET response
			$httpBackend.expectGET('survs').respond(sampleSurvs);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.survs).toEqualData(sampleSurvs);
		}));

		it('$scope.findOne() should create an array with one Surv object fetched from XHR using a survId URL parameter', inject(function(Survs) {
			// Define a sample Surv object
			var sampleSurv = new Survs({
				name: 'New Surv'
			});

			// Set the URL parameter
			$stateParams.survId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/survs\/([0-9a-fA-F]{24})$/).respond(sampleSurv);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.surv).toEqualData(sampleSurv);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Survs) {
			// Create a sample Surv object
			var sampleSurvPostData = new Survs({
				name: 'New Surv'
			});

			// Create a sample Surv response
			var sampleSurvResponse = new Survs({
				_id: '525cf20451979dea2c000001',
				name: 'New Surv'
			});

			// Fixture mock form input values
			scope.name = 'New Surv';

			// Set POST response
			$httpBackend.expectPOST('survs', sampleSurvPostData).respond(sampleSurvResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Surv was created
			expect($location.path()).toBe('/survs/' + sampleSurvResponse._id);
		}));

		it('$scope.update() should update a valid Surv', inject(function(Survs) {
			// Define a sample Surv put data
			var sampleSurvPutData = new Survs({
				_id: '525cf20451979dea2c000001',
				name: 'New Surv'
			});

			// Mock Surv in scope
			scope.surv = sampleSurvPutData;

			// Set PUT response
			$httpBackend.expectPUT(/survs\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/survs/' + sampleSurvPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid survId and remove the Surv from the scope', inject(function(Survs) {
			// Create new Surv object
			var sampleSurv = new Survs({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Survs array and include the Surv
			scope.survs = [sampleSurv];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/survs\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSurv);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.survs.length).toBe(0);
		}));
	});
}());