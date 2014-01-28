'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var hapiGenTools = require('./hapiGenTools.js');

/**
 * hapiToolsGenerator
 * 
 */
var hapiToolsGenerator = module.exports = function hapiToolsGenerator(args, options) {
	yeoman.generators.Base.apply(this, arguments);
	hapiGenTools.init(this);

	if (!!options.install) {
		this.installMod = true;
	}
};

util.inherits(hapiToolsGenerator, yeoman.generators.Base);

/**
 * askMethod
 * Ask for the request method to use for this
 * new route
 * 
 */
hapiToolsGenerator.prototype.askMethod = function askmethod() {

	// Check if the method is not already set via
	// generator arguments
	if (!!this.method || !!this.installMod) {
		return;
	}

	var cb = this.async();
	var prompts = [{
			type: 'list',
			name: 'method',
			message: 'What request method you want to use?',
			choices: hapiGenTools.methods
		}];

	this.prompt(prompts, function (props) {
		this.method = props.method;
		cb();
	}.bind(this));
};

/**
 * askRoute
 * Ask for the route
 * 
 */
hapiToolsGenerator.prototype.askRoute = function askRoute() {

	// Check if the route is not already set via
	// generator arguments
	if (!!this.route || !!this.installMod) {
		return;
	}

	var cb = this.async();
	var prompts = [{
			type: 'input',
			name: 'route',
			message: 'Insert the route to use: ',
			validate: hapiGenTools.checkRoute
		}];

	this.prompt(prompts, function (props) {
		this.route = props.route;
		cb();
	}.bind(this));
};

/**
 * treatment
 *
 * At that point we have all the informations we need
 * we can start to build the content
 */
hapiToolsGenerator.prototype.treatment = function treatment() {
	if (!!this.installMod) {
		hapiGenTools.install();
	}
	else {
		hapiGenTools.execute();
	}
};