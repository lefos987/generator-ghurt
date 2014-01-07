'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var generatorData = require('./data.js');
var common = require('../common/common.js');

var HapiGenerator = module.exports = function HapiGenerator(args, options, config) {
	// By calling `NamedBase` here, we get the argument to the subgenerator call
	// as `this.name`.
	yeoman.generators.Base.apply(this, arguments);
	this.on('end', function () {
		this.installDependencies({
			skipInstall: options['skip-install'],
			callback: function () {
			}
		});
	});
};

util.inherits(HapiGenerator, yeoman.generators.NamedBase);



/**
 * Data
 * ------------------------------------------------------------------
 */

HapiGenerator.prototype._hapiDepend = generatorData.hapiDependencies;
HapiGenerator.prototype._extDepend = generatorData.extDependencies;


/**
 * Public methods / install script
 * ------------------------------------------------------------------
 */

HapiGenerator.prototype.welcome = function welcome() {
	if (!this.options['skip-welcome-message']) {
		console.log(this.yeoman);
	}
	// Setup default config
	this.basicInfo = generatorData.defaultConfig.basicInfo;
	this.hapiDependencies = generatorData.defaultConfig.hapiDependencies;
	this.extDependencies = generatorData.defaultConfig.extDependencies;
};

HapiGenerator.prototype.askBasic = function askBasic() {

	var cb = this.async();
	console.log('We need some information about your app to automagically create it...');
	var prompts = [{
		type: 'input',
		name: 'name',
		message: 'What is the name?',
		validate: common.checkRequired
	}, {
		type: 'input',
		name: 'description',
		message: 'Can you give us a brief description?',
		default: this.basicInfo.description
	}, {
		type: 'input',
		name: 'version',
		message: 'What version is it on?',
		default: this.basicInfo.version,
		validate: common.checkProjectVersion
	}, {
		type: 'input',
		name: 'author',
		message: 'Who is the author?',
		default: this.basicInfo.author
	}, {
		type: 'input',
		name: 'repo',
		message: 'What is the GitHub/Stash repo?',
		default: this.basicInfo.repo
	}, {
		type: 'list',
		name: 'licence',
		message: 'Under which licence is it created?',
		choices: ['BSD', 'MIT', 'Apache', 'Other']
	}, {
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
		this.basicInfo = props;
		cb();
	}.bind(this));

};


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

HapiGenerator.prototype.createStructure = function createStructure() {
	this.mkdir('src');
	this.mkdir('src/api');
	this.mkdir('src/api/index');
	this.mkdir('src/error_messages');
	this.mkdir('test');
	this.mkdir('test/api');
};

HapiGenerator.prototype.rootFilesInit = function rootFilesInit() {
	this.template('_package.json', 'package.json');
	this.copy('.jshintrc', '.jshintrc');
	this.copy('gruntFile.js', 'gruntFile.js');
	this.copy('.gitignore', '.gitignore');
	this.template('_config.js', 'config.js');
	this.template('_server.js', 'server.js');
};

HapiGenerator.prototype.srcFolderInit = function srcFolderInit() {
	this.copy('src/indexRoutes.js', 'src/api/index/indexRoutes.js');
};