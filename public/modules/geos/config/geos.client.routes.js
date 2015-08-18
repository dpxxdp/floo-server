'use strict';

//Setting up route
angular.module('geos').config(['$stateProvider',
	function($stateProvider) {
		// Geos state routing
		$stateProvider.
		state('listGeos', {
			url: '/geos',
			templateUrl: 'modules/geos/views/list-geos.client.view.html'
		}).
		state('createGeo', {
			url: '/geos/create',
			templateUrl: 'modules/geos/views/create-geo.client.view.html'
		}).
		state('viewGeo', {
			url: '/geos/:geoId',
			templateUrl: 'modules/geos/views/view-geo.client.view.html'
		}).
		state('editGeo', {
			url: '/geos/:geoId/edit',
			templateUrl: 'modules/geos/views/edit-geo.client.view.html'
		});
	}
]);