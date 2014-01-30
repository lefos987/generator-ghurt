'use strict';

/**
 * TODO: This is temporary until we find a better way to force any url path
 * to serve the index.html and all necessary static files.
 * We need a catch all route eg. /{path*} that will always serve the 
 * client/dist directory with the index.html.
 *
 * The following is not the solution since if you type a url like /a/b/c
 * in the browser it returns not found, since it cannot find index.html
 * there.
 * 
 * var indexRoute = {
			method: '*',
			path: '/{path*}',
			config: {
			handler: {
				directory: { path: '../client/dist/', listing: false, index: true }
			}
		}
	};
 */

var indexRoute = {
	method: '*',
	path: '/{path*}',
	config: {
		handler: {
			file: { path: '../client/dist/index.html' }
		}
	}
};

var vendorRoute = {
	method: '*',
	path: '/vendor/{v*}',
	config: {
		handler: {
			directory: { path: '../client/dist/vendor/' }
		}
	}
};

var assetsRoute = {
	method: '*',
	path: '/assets/{a*}',
	config: {
		handler: {
			directory: { path: '../client/dist/assets/' }
		}
	}
};

var appJsRoute = {
	method: '*',
	path: '/app.js',
	config: {
		handler: {
			file: { path: '../client/dist/app.js'}
		}
	}
};

var appMinJsRoute = {
	method: '*',
	path: '/app.min.js',
	config: {
		handler: {
			file: { path: '../client/dist/app.min.js'}
		}
	}
};

var appCssRoute = {
	method: '*',
	path: '/app.css',
	config: {
		handler: {
			file: { path: '../client/dist/app.css'}
		}
	}
};

var appMinCssRoute = {
	method: '*',
	path: '/app.min.css',
	config: {
		handler: {
			file: { path: '../client/dist/app.min.css'}
		}
	}
};

module.exports = [indexRoute, vendorRoute, assetsRoute, appJsRoute, appCssRoute];