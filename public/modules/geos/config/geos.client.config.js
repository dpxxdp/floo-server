'use strict';

// Configuring the Articles module
angular.module('geos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Geos', 'geos', 'dropdown', '/geos(/create)?');
		Menus.addSubMenuItem('topbar', 'geos', 'List Geos', 'geos');
		Menus.addSubMenuItem('topbar', 'geos', 'New Geo', 'geos/create');
	}
]);