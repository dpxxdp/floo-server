'use strict';

//Setting up route
angular.module('survs').config(['$stateProvider',
	function($stateProvider) {
		// Survs state routing
		$stateProvider.
		state('listSurvs', {
			url: '/survs',
			templateUrl: 'modules/survs/views/list-survs.client.view.html'
		}).
		state('createSurv', {
			url: '/survs/create',
			templateUrl: 'modules/survs/views/create-surv.client.view.html'
		}).
		state('viewSurv', {
			url: '/survs/:survId',
			templateUrl: 'modules/survs/views/view-surv.client.view.html'
		}).
		state('editSurv', {
			url: '/survs/:survId/edit',
			templateUrl: 'modules/survs/views/edit-surv.client.view.html'
		});
	}
]);