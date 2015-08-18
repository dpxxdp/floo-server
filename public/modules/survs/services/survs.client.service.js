'use strict';

//Survs service used to communicate Survs REST endpoints
angular.module('survs').factory('Survs', ['$resource',
	function($resource) {
		return $resource('survs/:survId', { survId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);