'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var generatorData = require('./data.js');
var common = require('../common/common.js');

/**
 * Hapi SubGenerator
 * 
 * the generator is build in 3 parts
 * 1. setup the data in the generator class
 * 2. promtp methods
 * 3. installation
 * 
 */

var HapiGenerator = module.exports = function HapiGenerator(args, options, config) {
	this.options = options;

	// Commented out as a placeholder for possible future use
	// this.on('end', function () {});
	yeoman.generators.Base.apply(this, arguments);
};

util.inherits(HapiGenerator, yeoman.generators.NamedBase);



/**
 * Data
 * ------------------------------------------------------------------
 */

HapiGenerator.prototype._hapiDepend = generatorData.hapiDependencies;
HapiGenerator.prototype._extDepend = generatorData.extDependencies;
HapiGenerator.prototype._welcome =
'\n             __    ' +
'\n  |__|  /\\  |__) | ' +
'\n  |  | /--\\ |    | ' +
'\n  server side -----\n';


/**
 * Public methods / prompt scripts
 * ------------------------------------------------------------------
 */

/**
 * welcome
 * 
 * Say hello and setup the default data
 */
HapiGenerator.prototype.welcome = function welcome() {
	if (!this.options['skip-welcome-message']) {
		console.log(this.yeoman);
	}
	else {
		console.log(this._welcome);
	}
	// Setup default config
	this.basicInfo = generatorData.defaultConfig.basicInfo;
	this.hapiDependencies = generatorData.defaultConfig.hapiDependencies;
	this.extDependencies = generatorData.defaultConfig.extDependencies;

	// Setup data from potential master generator
	if (!!this.options.basicInfo) {
		this.basicInfo = common.merge(this.basicInfo, this.options.basicInfo);
	}
};

/**
 * askBasic
 * 
 * Generate the prompt to ask the basic information
 * and set the result in this.basicInfo
 * This method is common to all generators 
 * The default basicInfo data is set in the welcome method
 */
HapiGenerator.prototype.askBasic = common.askBasic;

/**
 * askGeneral
 *
 * Ask for the general information
 * on top of basic info, 
 * then add it to basicInfo
 */
HapiGenerator.prototype.askGeneral = function askGeneral() {

	var cb = this.async();
	var prompts = [{
		type: 'input',
		name: 'serverPort',
		message: 'Which port do you want your server to run on?',
		default: this.basicInfo.serverPort,
		validate: common.checkPort
	}, {
		type: 'confirm',
		name: 'quickInstall',
		message: 'Do you want a quick install?',
		default: this.basicInfo.quickInstall
	}];

	this.prompt(prompts, function (props) {
		this.basicInfo = common.merge(this.basicInfo, props);
		cb();
	}.bind(this));
};

/**
 * askHapiDependencies
 * 
 * Ask for which hapi dependencies the user wants
 * to install. The prompt is generated from data.js
 * No version number is asked, in any case the
 * latest version is installed
 * Then set the data into this.hapiDependencies
 */
HapiGenerator.prototype.askHapiDependencies = function askHapiDependencies() {
	if (!!this.basicInfo.quickInstall) {
		return;
	}

	var cb = this.async();
	var hapiDependChoices = [];
	for (var dep in this._hapiDepend) {
		hapiDependChoices.push({
			value: dep,
			name: dep + ' (' + this._hapiDepend[dep].description + ')',
			checked: (this.hapiDependencies.hapiDepend.indexOf(dep) !== -1)
		});
	}
	var prompts = [{
		type: 'input',
		name: 'hapiVersion',
		message: 'Which version of Hapi do you want?',
		default: this.hapiDependencies.hapiVersion,
		validate: common.checkVersion
	}, {
		type: 'checkbox',
		name: 'hapiDepend',
		message: 'Which other Hapi modules do you need?',
		choices: hapiDependChoices
	}];
	
	console.log('We know that you want Hapi but need to ask you a couple more things...');
	this.prompt(prompts, function (props) {
		this.hapiDependencies = props;
		cb();
	}.bind(this));
};

/**
 * askExternalDependencies
 * 
 * Ask for which external dependencies the user wants
 * to install. The prompt is generated from data.js
 * No version number is asked, the latest version is 
 * installed by default
 * Then set the data into this.extDependencies
 */
HapiGenerator.prototype.askExternalDependencies = function askExternalDependencies() {
	if (!!this.basicInfo.quickInstall) {
		return;
	}

	var cb = this.async();
	var extDependChoices = [];
	for (var dep in this._extDepend) {
		extDependChoices.push({
			value: dep,
			name: dep,
			checked: (this.extDependencies.extDepend.indexOf(dep) !== -1)
		});
	}
	var prompts = [{
		type: 'checkbox',
		name: 'extDepend',
		message: 'Choose the packages you need...',
		choices: extDependChoices
	}];

	console.log('Hapi is great but you might need some other packages...');
	this.prompt(prompts, function (props) {
		this.extDependencies = props;
		cb();
	}.bind(this));
};


/**
 * End of questions / deploy
 * ------------------------------------------------------------------
 */

/**
 * npmDependencies
 *
 * Generate the dependency object for package.json
 * ready for the template 
 */
HapiGenerator.prototype.npmDependencies = function npmDependencies() {
	var dependencies = {};
	dependencies.hapi = this.hapiDependencies.hapiVersion;
	for (var i in this.hapiDependencies.hapiDepend) {
		dependencies[this.hapiDependencies.hapiDepend[i]] = 'latest';
	}
	for (var e in this.extDependencies.extDepend) {
		dependencies[this.extDependencies.extDepend[e]] = 'latest';
	}
	this.npmDependencies = dependencies;
};

/**
 * createStructure
 * 
 * Create the folder structure of the repo
 * obvious, isn't it?
 */
HapiGenerator.prototype.createStructure = function createStructure() {
	this.mkdir('src');
	this.mkdir('src/api');
	this.mkdir('src/api/index');
	this.mkdir('src/api/util');
	this.mkdir('src/error_messages');
	this.mkdir('test');
	this.mkdir('test/api');
};

/**
 * rootFilesInit
 * 
 * Generate the files of the root folder
 */
HapiGenerator.prototype.rootFilesInit = function rootFilesInit() {
	this.template('_package.json', 'package.json');
	this.copy('.jshintrc', '.jshintrc');
	this.copy('gruntFile.js', 'gruntFile.js');
	this.copy('_gitignore', '.gitignore');
	this.template('_config.js', 'config.js');
	this.template('_server.js', 'server.js');
};

/**
 * srcFolderInit
 * 
 * Generate the files of the source folder
 */
HapiGenerator.prototype.srcFolderInit = function srcFolderInit() {
	this.copy('src/indexRoutes.js', 'src/api/index/indexRoutes.js');
	this.copy('src/logger.js', 'src/api/util/logger.js');
	this.copy('src/en_GB.json', 'src/error_messages/en_GB.json');
};

/**
 * installDeps
 * 
 * Install the dependencies of the repo
 * > npm install
 */
HapiGenerator.prototype.installDeps = function installDeps() {
	var cb = this.async();
	this.installDependencies({
		skipInstall: this.options['skip-install'],
		callback: function () {
			cb();
		}
	});
};