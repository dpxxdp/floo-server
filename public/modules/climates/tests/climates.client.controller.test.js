'use strict';

(function() {
	// Climates Controller Spec
	describe('Climates Controller Tests', function() {
		// Initialize global variables
		var ClimatesController,
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

			// Initialize the Climates controller.
			ClimatesController = $controller('ClimatesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Climate object fetched from XHR', inject(function(Climates) {
			// Create sample Climate using the Climates service
			var sampleClimate = new Climates({
				name: 'New Climate'
			});

			// Create a sample Climates array that includes the new Climate
			var sampleClimates = [sampleClimate];

			// Set GET response
			$httpBackend.expectGET('climates').respond(sampleClimates);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.climates).toEqualData(sampleClimates);
		}));

		it('$scope.findOne() should create an array with one Climate object fetched from XHR using a climateId URL parameter', inject(function(Climates) {
			// Define a sample Climate object
			var sampleClimate = new Climates({
				name: 'New Climate'
			});

			// Set the URL parameter
			$stateParams.climateId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/climates\/([0-9a-fA-F]{24})$/).respond(sampleClimate);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.climate).toEqualData(sampleClimate);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Climates) {
			// Create a sample Climate object
			var sampleClimatePostData = new Climates({
				name: 'New Climate'
			});

			// Create a sample Climate response
			var sampleClimateResponse = new Climates({
				_id: '525cf20451979dea2c000001',
				name: 'New Climate'
			});

			// Fixture mock form input values
			scope.name = 'New Climate';

			// Set POST response
			$httpBackend.expectPOST('climates', sampleClimatePostData).respond(sampleClimateResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Climate was created
			expect($location.path()).toBe('/climates/' + sampleClimateResponse._id);
		}));

		it('$scope.update() should update a valid Climate', inject(function(Climates) {
			// Define a sample Climate put data
			var sampleClimatePutData = new Climates({
				_id: '525cf20451979dea2c000001',
				name: 'New Climate'
			});

			// Mock Climate in scope
			scope.climate = sampleClimatePutData;

			// Set PUT response
			$httpBackend.expectPUT(/climates\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/climates/' + sampleClimatePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid climateId and remove the Climate from the scope', inject(function(Climates) {
			// Create new Climate object
			var sampleClimate = new Climates({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Climates array and include the Climate
			scope.climates = [sampleClimate];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/climates\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleClimate);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.climates.length).toBe(0);
		}));
	});
}());