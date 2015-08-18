'use strict';

// Climates controller
angular.module('climates').controller('ClimatesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Climates',
	function($scope, $stateParams, $location, Authentication, Climates) {
		$scope.authentication = Authentication;

		// Create new Climate
		$scope.create = function() {
			// Create new Climate object
			var climate = new Climates ({
				name: this.name
			});

			// Redirect after save
			climate.$save(function(response) {
				$location.path('climates/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Climate
		$scope.remove = function(climate) {
			if ( climate ) { 
				climate.$remove();

				for (var i in $scope.climates) {
					if ($scope.climates [i] === climate) {
						$scope.climates.splice(i, 1);
					}
				}
			} else {
				$scope.climate.$remove(function() {
					$location.path('climates');
				});
			}
		};

		// Update existing Climate
		$scope.update = function() {
			var climate = $scope.climate;

			climate.$update(function() {
				$location.path('climates/' + climate._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Climates
		$scope.find = function() {
			$scope.climates = Climates.query();
		};

		// Find existing Climate
		$scope.findOne = function() {
			$scope.climate = Climates.get({ 
				climateId: $stateParams.climateId
			});
		};
	}
]);