'use strict';

//Geos service used to communicate Geos REST endpoints
angular.module('geos').factory('Geos', ['$resource',
	function($resource) {
		return $resource('geos/:geoId', { geoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);