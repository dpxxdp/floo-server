'use strict';

// Geos controller
angular.module('geos').controller('GeosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Geos',
	function($scope, $stateParams, $location, Authentication, Geos) {
		$scope.authentication = Authentication;

		// Create new Geo
		$scope.create = function() {
			// Create new Geo object
			var geo = new Geos ({
				name: this.name
			});

			// Redirect after save
			geo.$save(function(response) {
				$location.path('geos/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Geo
		$scope.remove = function(geo) {
			if ( geo ) { 
				geo.$remove();

				for (var i in $scope.geos) {
					if ($scope.geos [i] === geo) {
						$scope.geos.splice(i, 1);
					}
				}
			} else {
				$scope.geo.$remove(function() {
					$location.path('geos');
				});
			}
		};

		// Update existing Geo
		$scope.update = function() {
			var geo = $scope.geo;

			geo.$update(function() {
				$location.path('geos/' + geo._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Geos
		$scope.find = function() {
			$scope.geos = Geos.query();
		};

		// Find existing Geo
		$scope.findOne = function() {
			$scope.geo = Geos.get({ 
				geoId: $stateParams.geoId
			});
		};
	}
]);