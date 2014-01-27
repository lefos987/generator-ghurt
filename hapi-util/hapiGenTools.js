'use strict';

/**
 * hapiGenTools
 * group of tools to generate objects on angular
 *
 */

var common = require('../common/common.js');

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
	 * Prefix for template marker
	 * @type {String}
	 */
	tplMarker: '//mk:',

	/**
	 * Methods allowed
	 * @type {Array}
	 */
	methods: [
		'GET',
		'POST',
		'UPDATE',
		'DELETE'
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
		this.checkCurrentPath();
		this.setUpAttributes();
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
			if (!!this.checkMethod(method)) {
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
		var method = this.generator.method.toLowerCase();
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
		this.generator.template('_script.js', this.scriptPath + this.tpl.routePath + '.js');
		this.generator.template('_test.spec.js', this.testPath + this.tpl.routePath + '.spec.js');
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
			this.generator.template('_router.js', routerPath);
		}
	},

	/**
	 * writeTest
	 * write the unit test file
	 */
	updateIndex: function () {
		if (!!this.ended) {
			return;
		}
		this.insert('server.js', [
			{tpl: 'index/_require', marker: 'require'},
			{tpl: 'index/_route', marker: 'route'}
		]);
	},


	/**
	 * Utils
	 * ------------------------------------------------------------------
	 */

	/**
	 * insert
	 * insert rendered templates into a file
	 * 
	 * @param  {[string]} filePath  Path of the file to update
	 * @param  {[array]} config     Array of object {tpl, marker}
	 */
	insert: function (filePath, config) {

		filePath = this.generator.dest._base + '/' + filePath;
		console.log(filePath);
		var content = this.generator.readFileAsString(filePath);
		var currentConf;
		for (var i in config) {
			currentConf = config[i];
			content = this.insertIn(content, currentConf.tpl, currentConf.marker);
		}
		this.generator.dest.delete(filePath);
		this.generator.dest.write(filePath, content);
	},

	/**
	 * insertIn
	 * insert content into the module
	 * if the file does not exists, the script generate it
	 * 
	 * @param		String	contentToInsert		Content to add in the module
	 */
	insertIn: function (content, tplLink, marker) {
		// var markerPosition = content.lastIndexOf(this.tplMarker + marker);
		var contentToInsert = this.engineFromTpl(tplLink);
		var newContent = content.replace(new RegExp(' *' + this.tplMarker + marker), contentToInsert + '$&');

		if (newContent.length !== content.length + contentToInsert.length) {
			throw 'Marker "' + marker + '" not found';
		}
		return newContent;

		// if (markerPosition === -1) {
		// 	throw 'Marker "' + marker + '" not found';
		// }
		// return [content.slice(0, markerPosition), contentToInsert, content.slice(markerPosition)].join('');
	},

	/**
	 * engineFromTpl
	 * use the template engine to render any template
	 * from his lin, relative to the generator path.
	 * the data used to render is this.generator
	 * @example
	 * .engineFromTpl('/_module.js')
	 * 
	 * @param  {string} tplLink Link to the template
	 * @return {string}         Content of the template rendered
	 */
	engineFromTpl: function (tplLink) {
		return this.generator.engine(
			this.generator.readFileAsString(this.generator.src._base + '/' + tplLink),
			this.generator
		);
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
	 * checkFile
	 * validation method to check if a file exists
	 *
	 * @param		string			filePath		Path to the file
	 * @param		string			errorLabel	Error label in case (if undefined it won't throw any error)
	 * @return	boolean
	 */
	checkFile: function (filePath, errorLabel) {
		var testFile;
		var failCase = function () {
			if (!!errorLabel) {
				throw errorLabel;
			}
			return false;
		};
		try {
			testFile = this.generator.readFileAsString(filePath);
			return (!testFile || testFile === '') ? failCase() : true;
		}
		catch (error) {
			return failCase();
		}
	},

	/**
	 * checkMethod
	 * validation method to check if a request method
	 * is allowed
	 * return true if the method is allowed
	 *
	 * @param	{string} method	
	 * @return {boolean}
	 */
	checkMethod: function (method) {
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

module.exports = hapiGenTools;