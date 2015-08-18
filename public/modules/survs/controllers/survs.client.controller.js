'use strict';

// Survs controller
angular.module('survs').controller('SurvsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Survs',
	function($scope, $stateParams, $location, Authentication, Survs) {
		$scope.authentication = Authentication;

		// Create new Surv
		$scope.create = function() {
			// Create new Surv object
			var surv = new Survs ({
				name: this.name
			});

			// Redirect after save
			surv.$save(function(response) {
				$location.path('survs/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Surv
		$scope.remove = function(surv) {
			if ( surv ) { 
				surv.$remove();

				for (var i in $scope.survs) {
					if ($scope.survs [i] === surv) {
						$scope.survs.splice(i, 1);
					}
				}
			} else {
				$scope.surv.$remove(function() {
					$location.path('survs');
				});
			}
		};

		// Update existing Surv
		$scope.update = function() {
			var surv = $scope.surv;

			surv.$update(function() {
				$location.path('survs/' + surv._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Survs
		$scope.find = function() {
			$scope.survs = Survs.query();
		};

		// Find existing Surv
		$scope.findOne = function() {
			$scope.surv = Survs.get({ 
				survId: $stateParams.survId
			});
		};
	}
]);