'use strict';

// Configuring the Articles module
angular.module('survs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Survs', 'survs', 'dropdown', '/survs(/create)?');
		Menus.addSubMenuItem('topbar', 'survs', 'List Survs', 'survs');
		Menus.addSubMenuItem('topbar', 'survs', 'New Surv', 'survs/create');
	}
]);