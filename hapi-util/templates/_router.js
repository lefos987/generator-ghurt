'use strict';

// Load routes scripts
var <%= tpl.routeName %> = require('./<%= tpl.routeName %>/<%= tpl.routeName %>');
//mk:require

// Define route config
var <%= tpl.routeName %>Config = {
	method: '<%= tpl.method %>',
	path: '/api<%= tpl.route %>',
	config: {
		handler: <%= tpl.routeName %>.<%= tpl.routeName %>Handler
	}
};
//mk:conf

module.exports = [
	<%= tpl.routeName %>Config //mk:export
];