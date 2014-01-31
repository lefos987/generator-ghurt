'use strict';

/**
 * hapiGenTools
 * group of tools to generate objects on angular
 *
 */

var common = require('../common/common');
var utilBase = require('../common/util-base');


/**
 * hapiGenTools object
 * @type Object
 *
 * This object is divided in subparts
 * 	constants:			set the settings about the generator
 * 	init:						init the object with command settings
 * 	execute:				execute the task to generate an object
 * 	module writer:	methods to write or update files
 * 	checking:				basic function to test the current folder and files
 */
var hapiGenTools = {

	/**
	 * Constants
	 * ------------------------------------------------------------------
	 */
	
	/**
	 * Path for scripts
	 * @type {String}
	 */
	scriptPath: 'src/api/',

	/**
	 * Path for test
	 * @type {String}
	 */
	testPath: 'test/api/',

	/**
	 * Methods allowed
	 * @type {Array}
	 */
	methods: [
		'*',
		'GET',
		'POST',
		'PUT',
		'PATCH',
		'DELETE',
		'COPY',
		'HEAD',
		'OPTIONS',
		'LINK',
		'UNLINK',
		'PURGE'
	],


	/**
	 * Init
	 * ------------------------------------------------------------------
	 */

	/**
	 * init
	 * Main script of hapiGenTools
	 * Check the command and run the code.
	 *
	 * @param		object					generator		Generator instance
	 */
	init: function (generator) {
		this.generator = generator;
		this.fileCache = {};

		this.checkCurrentPath();
		this.setUpAttributes();

		// Force overwriting if requested
		this.generator.conflicter.force = !!this.generator.options.force;
	},

	/**
	 * setUpAttributes
	 * set up the generator parameters in the generator
	 * instance. Ready for the promtps
	 *
	 */
	setUpAttributes: function () {
		// Get the method
		if (this.generator.args.length > 0) {
			var method = this.generator.args.shift().toUpperCase();
			if (!!this.checkHttpVerb(method)) {
				this.generator.method = method;
			} else {
				console.log('This generator does not allowed "' + method + '" method.');
				return;
			}
		}
		// Get the paramters for the command
		if (this.generator.args.length > 0) {
			var route = this.generator.args.shift();
			var routeCheck = this.checkRoute(route);
			if (routeCheck === true) {
				this.generator.route = route;
			} else {
				console.log(routeCheck);
				return;
			}
		}
	},


	/**
	 * Execute
	 * ------------------------------------------------------------------
	 */

	/**
	 * execute
	 * the main program to execute a command
	 * the main switcher
	 *
	 */
	execute: function () {
		if (!this.generator.method || !this.generator.route) {
			console.log('There\'s not what I require');
			return;
		}

		this.executeTreatment();
		
		this.writeScript();
		this.writeRouter();
		this.updateIndex();

		this.reset();
		if (!this.installMod) {
			this.writeFiles();
		}
	},

	/**
	 * executeTreatment
	 * generate all the necessary variables to generate
	 * the route
	 * ex: GET /user/{userID}/likes/counter
	 *  action: 'user',
	 *  actionScript: 'user/userRoutes.js',
	 *  method: 'GET',
	 *  route: '/user/{userID}/likes/counter'
	 *  routeName: 'getLikesCounter', 
	 *  routePath: 'user/getLikesCounter/getLikesCounter',
	 *
	 * @return {[type]} [description]
	 */
	executeTreatment: function () {
		var method = this.generator.method.replace('*', 'all').toLowerCase();
		var route = this.generator.route;

		// Transform
		route = route[0] === '/' ? route : '/' + route;
		var routeChunks = route.replace(/\/\{([a-z][a-zA-Z0-9]*)\??\}/g, '').split('/');
		routeChunks.shift();

		// Tests
		if (routeChunks.length === 0) {
			throw 'Your route is too tricky, sorry';
		}
		else if (routeChunks.length === 1) {
			if (route.indexOf('{') === -1) {
				routeChunks.push('index');
			}
			else {
				routeChunks.push((route.indexOf('?') === -1) ? 'item' : 'list');
			}
		}

		// Templating
		var routeName = method.toLowerCase();
		for (var i = 1; i < routeChunks.length; i++) {
			routeName += common.capitalise(routeChunks[i]);
		}

		this.tpl = {
			action: routeChunks[0],
			actionScript: routeChunks[0] + '/' + routeChunks[0] + 'Routes.js',
			method: this.generator.method,
			route: route,
			routeName: routeName,
			routePath: routeChunks[0] + '/' + routeName + '/' + routeName,
		};
		this.generator.tpl = this.tpl;
	},

	/**
	 * install
	 * script to create routes form routes.js
	 *
	 */
	install: function () {
		var route;
		var conf = require(this.generator.dest._base + '/routes.js');
		for (var i = 0; i < conf.length; i++) {
			route = conf[i];
			this.generator.method = route.method;
			this.generator.route = route.route;
			this.execute();
		}
		this.writeFiles();
		console.log('Done. ' + i + ' route(s) created.');
	},


	/**
	 * Module writer
	 * ------------------------------------------------------------------
	 * these methods require 2 variables from the generator
	 * .command (object type to generate)
	 * .tpl (variables relatives to the object to generate)
	 */
	
	/**
	 * writeScript
	 * write the object script
	 */
	writeScript: function () {
		this.template('_script.js', this.scriptPath + this.tpl.routePath + '.js');
		this.template('_test.spec.js', this.testPath + this.tpl.routePath + '.spec.js');
	},

	/**
	 * writeView
	 * write the view file
	 */
	writeRouter: function () {
		var routerPath = this.scriptPath + this.tpl.actionScript;
		if (this.checkFile(routerPath)) {
			this.insert(routerPath, [
				{tpl: 'router/_require', marker: 'require'},
				{tpl: 'router/_conf', marker: 'conf'},
				{tpl: 'router/_export', marker: 'export'}
			]);
			this.ended = true;
		}
		else {
			this.template('_router.js', routerPath);
		}
	},

	/**
	 * writeTest
	 * write the unit test file
	 */
	updateIndex: function () {
		if (!this.ended) {
			this.insert('server.js', [
				{tpl: 'index/_require', marker: 'require'},
				{tpl: 'index/_route', marker: 'route'}
			]);
		}
	},

	/**
	 * Reset
	 * reset the generator
	 * 
	 */
	reset: function () {
		this.ended = null;
	},


	/**
	 * Checking
	 * ------------------------------------------------------------------
	 */

	/**
	 * checkCurrentPath
	 * validation method to check if the user execute
	 * the generator from the good place
	 *
	 * @return	boolean
	 */
	checkCurrentPath: function () {
		var testFile = 'server.js';
		var errorLabel = 'The current path is not correct. Please move to the root folder of the Hapi app.';
		return this.checkFile(testFile, errorLabel);
	},

	/**
	 * checkHttpVerb
	 * validation method to check if a request method
	 * is allowed
	 * return true if the method is allowed
	 *
	 * @param	{string} method	
	 * @return {boolean}
	 */
	checkHttpVerb: function (method) {
		return this.methods.indexOf(method) !== -1;
	},

	/**
	 * checkRoute
	 * check if a route is valid
	 * return true if the method is valid
	 * @param  {string} route
	 * @return {boolean|string}
	 */
	checkRoute: function (route) {
		route = route[0] === '/' ? route : '/' + route;
		if (/^(\/([a-z0-9-_]+|\{([a-z][a-zA-Z0-9]*)\??\}))+$/.test(route)) {
			return true;
		}
		else {
			return 'A route might not be in camelCase (ex: /hello/{world})';
		}
	}
};

// Merge the base and our new tools
hapiGenTools = common.merge(utilBase, hapiGenTools);

module.exports = hapiGenTools;