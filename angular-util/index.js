'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var ngGenTools = require('./ngGenTools.js');

/**
 * NgcapToolsGenerator
 * 
 */
var NgcapToolsGenerator = module.exports = function NgcapToolsGenerator() {
	yeoman.generators.Base.apply(this, arguments);
	ngGenTools.init(this);
};

util.inherits(NgcapToolsGenerator, yeoman.generators.Base);

/**
 * askCommand
 *
 * Ask for the command to execute
 * on top of basic info, 
 * then add it to basicInfo
 */
NgcapToolsGenerator.prototype.askCommand = function askCommand() {

	// Check if the command is not already set via
	// generator arguments
	if (!!this.command) {
		return;
	}

	var cb = this.async();
	var prompts = [{
			type: 'list',
			name: 'command',
			message: 'What do you want to create?',
			choices: ngGenTools.commandList()
		}];

	this.prompt(prompts, function (props) {
		this.command = props.command;
		cb();
	}.bind(this));
};

/**
 * askCommandParameters
 *
 * Ask for the command to execute
 * on top of basic info, 
 * then add it to basicInfo
 */
NgcapToolsGenerator.prototype.askCommandParameters = function askCommandParameters() {

	// Check if the command is not already set via
	// generator arguments
	if (!!this.commandParams) {
		return;
	}

	var cb = this.async();
	var prompts = ngGenTools.getPromptFrom(this.command);

	this.prompt(prompts, function (props) {
		this.commandParams = props;
		cb();
	}.bind(this));
};

/**
 * treatment
 *
 * At that point we have all the informations we need
 * we can start to build the content
 */
NgcapToolsGenerator.prototype.treatment = function treatment() {
	ngGenTools.execute();
};