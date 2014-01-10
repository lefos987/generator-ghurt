'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var generatorData = require('./data.js');
var common = require('../common/common.js');


var NgcapGenerator = module.exports = function NgcapGenerator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);
	this.options = options;
	//Commented out as a placeholder for possible future use
	//this.on('end', function () {});

	this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(NgcapGenerator, yeoman.generators.Base);


/**
 * Data
 * ------------------------------------------------------------------
 */

NgcapGenerator.prototype._ngDepend = generatorData.ngDependencies;
NgcapGenerator.prototype._extDepend = generatorData.extDependencies;
NgcapGenerator.prototype._welcome =
'\n             __                  __          __ ' +
'\n   /\\  |\\ | / _` |  | |     /\\  |__)      | /__`' +
'\n  /--\\ | \\| \\__> \\__/ |___ /--\\ |  \\ . \\__/ .__/' +
'\n  client side ----------------------------------\n';

/**
 * Private methods
 * ------------------------------------------------------------------
 */

/**
 * _hasNgDepend
 * check if the module name given in param is set as angular
 * dependency for this project
 * 
 * @param		string			mod		Module to check
 * @return	boolean
 */
NgcapGenerator.prototype._hasNgDepend = function _hasNgDepend(mod) {
	return this.ngDependencies.ngDepend.indexOf(mod) !== -1;
};

/**
 * _hasExtDepend
 * check if the module name given in param is set as external
 * dependency for this project
 * 
 * @param		string			mod		Lib to check
 * @return	boolean
 */
NgcapGenerator.prototype._hasExtDepend = function _hasExtDepend(mod) {
	return this.extDependencies.extDepend.indexOf(mod) !== -1;
};



/**
 * Public methods / install script
 * ------------------------------------------------------------------
 */

NgcapGenerator.prototype.welcome = function welcome() {
	if (!this.options['skip-welcome-message']) {
		console.log(this.yeoman);
	}
	else {
		console.log(this._welcome);
	}

	// Setup default config
	this.basicInfo = generatorData.defaultConfig.basicInfo;
	this.ngDependencies = generatorData.defaultConfig.ngDependencies;
	this.extDependencies = generatorData.defaultConfig.extDependencies;
	this.fdnSettings = generatorData.defaultConfig.fdnSettings;

	// Setup data from potential master generator
	if (!!this.options.basicInfo) {
		this.basicInfo = common.merge(this.basicInfo, this.options.basicInfo);
	}
};

NgcapGenerator.prototype.askBasic = common.askBasic;

NgcapGenerator.prototype.askGeneral = function askGeneral() {

	var cb = this.async();
	console.log('We need some information about your app to automagically create it...');
	var prompts = [{
		type: 'input',
		name: 'connectServerPort',
		message: 'What\'s the port of your livereload server?',
		default: this.basicInfo.connectServerPort,
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

NgcapGenerator.prototype.askNgDependencies = function askNgDependencies() {
	if (!!this.basicInfo.quickInstall) {
		return;
	}

	var cb = this.async();
	var ngDependChoices = [];
	for (var dep in this._ngDepend) {
		ngDependChoices.push({
			value: dep,
			name: dep,
			checked: (this.ngDependencies.ngDepend.indexOf(dep) !== -1)
		});
	}
	var prompts = [{
		type: 'input',
		name: 'ngVersion',
		message: 'Which version of Angular do you want?',
		default: this.ngDependencies.ngVersion,
		validate: common.checkVersion
	}, {
		type: 'checkbox',
		name: 'ngDepend',
		message: 'Which other angular modules do you need?',
		choices: ngDependChoices
	}];
	
	console.log('We know that you want Angular but need to ask you a couple more things...');
	this.prompt(prompts, function (props) {
		this.ngDependencies = props;
		cb();
	}.bind(this));

};

NgcapGenerator.prototype.askExternalDependencies = function askExternalDependencies() {
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
		message: 'Choose the libraries you need...',
		choices: extDependChoices
	}];

	console.log('Angular is great but you might need some other libraries...');
	this.prompt(prompts, function (props) {
		this.extDependencies = props;
		cb();
	}.bind(this));
};

NgcapGenerator.prototype.jqueryAlert = function jqueryAlert() {
	var cb = this.async();

	if (this._hasExtDepend('jquery')) {
		console.log('\rReally? Angular with Jquery? You better know what you are doing... :-P');
		var prompts = [{
			type: 'input',
			name: 'jqueryExcuse',
			message: 'Please write your excuse here'
		}];
		this.prompt(prompts, function () {
			cb();
		}.bind(this));
	}
	else {
		cb();
	}
};

NgcapGenerator.prototype.askFoundation = function askFoundation() {
	if (!!this.basicInfo.quickInstall) {
		return;
	}

	var cb = this.async();
	var prompts = [{
		type: 'confirm',
		name: 'isRequired',
		message: 'Do you want to include styles (with Zurb Foundation)?',
		default: this.fdnSettings.isRequired
	}, {
		when: function (response) {
			return response.isRequired;
		},
		type: 'input',
		name: 'version',
		message: 'Which version of Zurb Foundation do you want?',
		default: this.fdnSettings.version,
		validate: common.checkVersion
	}];
	this.prompt(prompts, function (props) {
		this.fdnSettings = props;
		console.log('fdn: ', this.fdnSettings);
		cb();
	}.bind(this));
};

/**
 * End of questions / deploy
 * ------------------------------------------------------------------
 */

NgcapGenerator.prototype.bowerDependencies = function bowerDependencies() {
	var dependencies = {};
	dependencies.angular = this.ngDependencies.ngVersion;
	for (var i in this.ngDependencies.ngDepend) {
		dependencies[this.ngDependencies.ngDepend[i]] = this.ngDependencies.ngVersion;
	}
	for (var e in this.extDependencies.extDepend) {
		dependencies[this.extDependencies.extDepend[e]] = 'latest';
	}
	if (this.fdnSettings.isRequired) {
		dependencies.foundation = this.fdnSettings.version;
	}
	this.bowerDependencies = dependencies;
};

NgcapGenerator.prototype.createStructure = function createStructure() {
	this.mkdir('src');
	this.mkdir('src/app');
	this.mkdir('src/app/common');
	this.mkdir('src/styles');
	this.mkdir('src/styles/scss');
	this.mkdir('test');
	this.mkdir('test/config');
	this.mkdir('test/unit');
	this.mkdir('test/unit/app');
	this.mkdir('test/e2e');
	this.mkdir('dist');
	this.mkdir('dist/vendor');
	this.mkdir('dist/assets');
	this.mkdir('dist/assets/img');
	this.mkdir('dist/assets/fonts');
};

NgcapGenerator.prototype.rootFilesInit = function rootFilesInit() {
	this.template('_package.json', 'package.json');
	this.template('jshintrc', '.jshintrc');
	this.copy('gruntFile.js', 'gruntFile.js');
	this.copy('bowerrc', '.bowerrc');
	this.copy('.gitignore', '.gitignore');
};

NgcapGenerator.prototype.srcFolderInit = function srcFolderInit() {
	this.template('src/_index.html', 'src/index.html');

	this.template('src/app/_app.js', 'src/app/app.js');
	this.template('src/app/_app.view.html', 'src/app/app.view.html');
	this.template('src/app/_dependencies.js', 'src/app/common/dependencies.js');
	this.copy('src/app/common.js', 'src/app/common/common.js');

	this.copy('src/styles/config.rb', 'src/styles/config.rb');
	if (this.fdnSettings.isRequired) {
		this.copy('src/styles/foundation.scss', 'src/styles/scss/foundation.scss');
		this.copy('src/styles/variables.scss', 'src/styles/scss/_variables.scss');
	}
};

NgcapGenerator.prototype.testFolderInit = function testFolderInit() {
	this.template('test/_karma.conf.js', 'test/config/karma.conf.js');
	this.copy('test/protractorConf.js', 'test/config/protractorConf.js');
};

NgcapGenerator.prototype.vendorFilesInit = function vendorFilesInit() {
	this.template('vendor/_bower.json', 'dist/vendor/bower.json');
};

NgcapGenerator.prototype.installDeps = function installDeps() {
	var cb = this.async();
	this.installDependencies({
		skipInstall: this.options['skip-install'],
		callback: function () {
			cb();
		}
	});
};