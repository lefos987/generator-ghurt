'use strict';

var indexRoute = {
	method: 'GET',
	path: '/{path*}',
	config: {
		handler: {
			file: '../client/dist/index.html'
		}
	}
};

var vendorsContentRoute = {
	method: 'GET',
	path: '/vendor/{path*}',
	config: {
		handler: {
			directory: { path: '../client/vendor/', listing: false, index: false }
		}
	}
};

var distContentRoute = {
	method: 'GET',
	path: '/dist/{path*}',
	config: {
		handler: {
			directory: { path: '../client/dist/', listing: false, index: false }
		}
	}
};

var srcContentRoute = {
	method: 'GET',
	path: '/src/{path*}',
	config: {
		handler: {
			directory: { path: '../client/src/', listing: false, index: false }
		}
	}
};

module.exports = [vendorsContentRoute, distContentRoute, srcContentRoute, indexRoute];