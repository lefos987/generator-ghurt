'use strict';

// Load routes scripts
var <%= tpl.routeName %> = require('./<%= tpl.routeName %>/<%= tpl.routeName %>');
//ghurt-marker:require

// Define route config
var <%= tpl.routeName %>Config = {
	method: '<%= tpl.method %>',
	path: '/api<%= tpl.route %>',
	config: {
		handler: <%= tpl.routeName %>.<%= tpl.routeName %>Handler<% if (tpl.method == 'GET' || tpl.method == '*') { %>,
		cache: {
			privacy: 'default',
			expiresIn: 86400000 //: a day in milliseconds
		}<% } %>
	}
};
//ghurt-marker:conf

module.exports = [
	<%= tpl.routeName %>Config //ghurt-marker:export
];