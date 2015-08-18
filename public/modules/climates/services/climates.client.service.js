'use strict';

//Climates service used to communicate Climates REST endpoints
angular.module('climates').factory('Climates', ['$resource',
	function($resource) {
		return $resource('climates/:climateId', { climateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);