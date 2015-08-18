'use strict';

// Configuring the Articles module
angular.module('climates').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Climates', 'climates', 'dropdown', '/climates(/create)?');
		Menus.addSubMenuItem('topbar', 'climates', 'List Climates', 'climates');
		Menus.addSubMenuItem('topbar', 'climates', 'New Climate', 'climates/create');
	}
]);