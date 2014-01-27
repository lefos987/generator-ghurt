'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var Q = require('q');
var common = require('../common/common');
var generatorData = require('./data');

var GhurtGenerator = module.exports = function GhurtGenerator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);
	
	// Commented out as a placeholder for possible future use
	// this.on('end', function() {});
};

util.inherits(GhurtGenerator, yeoman.generators.Base);


/**
 * Public methods / install script
 * ------------------------------------------------------------------
 */

/**
 * welcome
 * 
 * Say hello and setup the default data
 */
GhurtGenerator.prototype.welcome = function welcome() {
	if (!this.options['skip-welcome-message']) {
		console.log(this.yeoman);
	}

	// Set default data
	this.basicInfo = generatorData.defaultConfig.basicInfo;
};

/**
 * askBasic
 * 
 * Generate the prompt to ask the basic information
 * and set the result in this.basicInfo
 * This method is common to all generators 
 * The default basicInfo data is set in the welcome method
 */
GhurtGenerator.prototype.askBasic = common.askBasic;

/**
 * askInstallItype
 * 
 * Ask what kind of app we need to install (client and/or server)
 * then add it to basicInfo
 */
GhurtGenerator.prototype.askInstallType = function askInstallType() {
	var cb = this.async();
	var choices = [{
			name: 'Client app?',
			value: 'client'
		}, {
			name: 'Server app?',
			value: 'server'
		}, {
			name: 'Server and Client app?',
			value: 'both'
		}
	];

	var prompts = [{
		type: 'list',
		name: 'type',
		message: 'Are you creating a: ',
		choices: choices
	}];

	this.prompt(prompts, function (props) {
		this.basicInfo.installType = props.type;
		cb();
	}.bind(this));
};

/**
 * createStructure
 * 
 * Creates the base folder structure for our app and run the correct subgenerator
 * 1. if we have a client or server app then files are put on the root of the app and then either
 *		angular or hapi subgenerators are run.
 * 2. if we have both a client and a server app then it creates client and server and then runs
 * the corresponding subgenerator
 *		subdirectories
 * In both cases it attaches a README file to the root.
 * #TODO: 
 *	1. when you select server you should get a list of all the available server subgenerators
 *	and select the preferred one
 *	2. when you select client you should get a list of all the available client subgenerators
 *	and select the preferred one
 *	3. when you select both it should again display the above options.
 */
GhurtGenerator.prototype.createStructure = function createStructure() {
	var cb = this.async();
	var basicInfo;
	switch (this.basicInfo.installType) {
	case 'client' :
		this._runSubGenerator('angular', this.basicInfo).finally(function () {
			cb();
		});
		break;
	case 'server' :
		this._runSubGenerator('hapi', this.basicInfo).finally(function () {
			cb();
		});
		break;
	case 'both' :
		this.mkdir('client');
		this.mkdir('server');

		this.destinationRoot('client');
		basicInfo = common.merge(this.basicInfo, {
			name: this.basicInfo.name + '_client',
			pathPrefix: '../'
		});
		this._runSubGenerator('angular', basicInfo).finally(function () {

			this.destinationRoot('../server');
			basicInfo = common.merge(this.basicInfo, {
				name: this.basicInfo.name + '_server',
				pathPrefix: '../'
			});
			this._runSubGenerator('hapi', basicInfo).then(function () {

				this.destinationRoot('..');
				cb();
			}.bind(this));
		}.bind(this));
		break;
	}
};

/**
 * addReaadme
 * 
 * Attach the README.md file to the root of the project
 */
GhurtGenerator.prototype.addReadme = function addReadme() {
	this.template('_readme.md', 'README.md');
};

/**
 * gitConfig
 * 
 * Apply a bisc git configuration to the root directory of the app
 * 1. git init to initialize a git repo
 * 2. copy the pre-commit and pre-push git hooks in order to ensure quality of the code
 * before code is pushed.
 */
GhurtGenerator.prototype.gitConfig = function gitConfig() {
	this.spawnCommand('git', ['init']);
	this.template('gitHooks/_pre-commit', '.git/hooks/pre-commit');
	this.copy('gitHooks/pre-push', '.git/hooks/pre-push');
};

/**
 * gitHooksRights
 * 
 * Make the git hooks that we just copied executable.
 * #NOTE: Created as a separate method to ensure that it will run synchronously after the
 * files are copied
 */
GhurtGenerator.prototype.gitHookRights = function gitHookRights() {
	this.spawnCommand('chmod', ['-R', '755', '.git/hooks']);
};


/**
 * Private methods
 * ------------------------------------------------------------------
 */

/**
 * _runSubGenerator
 * method that runs a subgenerator
 * @param		string		generator		the name of the subgenerator that we will run
 * @param		object		basicInfo		basic options(eg. name) that we want to pass to the subgenerator
 * @returns a promise obj
 */
GhurtGenerator.prototype._runSubGenerator = function _runSubGenerator(subgen, basicInfo) {
	var deferred = Q.defer();
	var options = {
		'skip-welcome-message': true,
		basicInfo: basicInfo
	};
	this.invoke('ghurt:' + subgen, {options: options}, function () {
		deferred.resolve();
	});
	return deferred.promise;
};