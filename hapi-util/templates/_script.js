'use strict';

var logger = require('../../util/logger'),
	Hapi = require('hapi');

/**
 * <%= tpl.routeName %>
 * @type {Object}
 */
var <%= tpl.routeName %> = {

	/**
	 * <%= tpl.routeName %> Handler
	 * Get and reply to the request
	 * 
	 */
	<%= tpl.routeName %>Handler: function (request, response) {

		// Logging when a new request is received
		logger.log('info', '<%= tpl.routeName %>: New request received', {
			tags: ['cm_info'],
			method: '<%= tpl.routeName %>'
		});

		response({success: true}).code(200);
	}
};

module.exports = <%= tpl.routeName %>;