'use strict';

//Setting up route
angular.module('climates').config(['$stateProvider',
	function($stateProvider) {
		// Climates state routing
		$stateProvider.
		state('listClimates', {
			url: '/climates',
			templateUrl: 'modules/climates/views/list-climates.client.view.html'
		}).
		state('createClimate', {
			url: '/climates/create',
			templateUrl: 'modules/climates/views/create-climate.client.view.html'
		}).
		state('viewClimate', {
			url: '/climates/:climateId',
			templateUrl: 'modules/climates/views/view-climate.client.view.html'
		}).
		state('editClimate', {
			url: '/climates/:climateId/edit',
			templateUrl: 'modules/climates/views/edit-climate.client.view.html'
		});
	}
]);