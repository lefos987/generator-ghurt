'use strict';

var indexRoute = {
	method: '*',
	path: '/{path*}',
	config: {
		handler: {
			directory: { path: '../client/dist/', listing: false, index: true }
		}
	}
};

module.exports = [indexRoute];