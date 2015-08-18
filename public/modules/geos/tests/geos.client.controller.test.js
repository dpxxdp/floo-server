'use strict';

(function() {
	// Geos Controller Spec
	describe('Geos Controller Tests', function() {
		// Initialize global variables
		var GeosController,
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

			// Initialize the Geos controller.
			GeosController = $controller('GeosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Geo object fetched from XHR', inject(function(Geos) {
			// Create sample Geo using the Geos service
			var sampleGeo = new Geos({
				name: 'New Geo'
			});

			// Create a sample Geos array that includes the new Geo
			var sampleGeos = [sampleGeo];

			// Set GET response
			$httpBackend.expectGET('geos').respond(sampleGeos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.geos).toEqualData(sampleGeos);
		}));

		it('$scope.findOne() should create an array with one Geo object fetched from XHR using a geoId URL parameter', inject(function(Geos) {
			// Define a sample Geo object
			var sampleGeo = new Geos({
				name: 'New Geo'
			});

			// Set the URL parameter
			$stateParams.geoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/geos\/([0-9a-fA-F]{24})$/).respond(sampleGeo);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.geo).toEqualData(sampleGeo);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Geos) {
			// Create a sample Geo object
			var sampleGeoPostData = new Geos({
				name: 'New Geo'
			});

			// Create a sample Geo response
			var sampleGeoResponse = new Geos({
				_id: '525cf20451979dea2c000001',
				name: 'New Geo'
			});

			// Fixture mock form input values
			scope.name = 'New Geo';

			// Set POST response
			$httpBackend.expectPOST('geos', sampleGeoPostData).respond(sampleGeoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Geo was created
			expect($location.path()).toBe('/geos/' + sampleGeoResponse._id);
		}));

		it('$scope.update() should update a valid Geo', inject(function(Geos) {
			// Define a sample Geo put data
			var sampleGeoPutData = new Geos({
				_id: '525cf20451979dea2c000001',
				name: 'New Geo'
			});

			// Mock Geo in scope
			scope.geo = sampleGeoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/geos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/geos/' + sampleGeoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid geoId and remove the Geo from the scope', inject(function(Geos) {
			// Create new Geo object
			var sampleGeo = new Geos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Geos array and include the Geo
			scope.geos = [sampleGeo];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/geos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGeo);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.geos.length).toBe(0);
		}));
	});
}());