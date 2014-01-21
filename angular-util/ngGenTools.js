'use strict';

/**
 * ngGenTools
 * group of tools to generate objects on angular
 *
 */

var common = require('../common/common.js');
var chalk = require('chalk');

/**
 * getGenericPrompt
 * common function to generate generic prompt
 * questions. Otherwise, the ngGenTools.commands 
 * gets quickly busy and heavy
 * 
 * @param		string		objectType	Prompt object
 * @return	array
 */
var getGenericPrompt = function (objectType) {
	return [{
		type: 'input',
		message: 'What\'s the name of your ' + objectType + '?',
		validate: common.checkRequiredModuleName
	},
	{
		type: 'input',
		message: 'For which module (ex: common/event/popup)?',
		validate: common.checkModuleName
	}];
};

/**
 * ngGenTools object
 * @type Object
 *
 * This object is divided in subparts
 * 	constants:			set the settings about the generator
 * 	init:						init the object with command settings
 * 	execute:				execute the task to generate an object
 * 	checking:				basic function to test the current folder and files
 * 	module writer:	methods to write or update files
 * 	commands data:	to get access to command data
 */
var ngGenTools = {

	/**
	 * Constants
	 * ------------------------------------------------------------------
	 */
	
	/**
	 * Path for scripts
	 * @type {String}
	 */
	scriptPath: 'src/app/',

	/**
	 * Path for tests
	 * @type {String}
	 */
	testPath: 'test/unit/app/',

	/**
	 * Command database
	 * @type {Object}
	 */
	commands: {
		controller: {
			prompt: getGenericPrompt('controller'),
			objectSuffix: 'Ctrl',
			generateView: true
		},

		directive: {
			prompt: getGenericPrompt('directive'),
			objectSuffix: ''
		},

		factory: {
			prompt: getGenericPrompt('factory'),
			objectSuffix: 'Factory'
		},

		filter: {
			prompt: getGenericPrompt('filter'),
			objectSuffix: ''
		},

		service: {
			prompt: getGenericPrompt('service'),
			objectSuffix: 'Service'
		}
	},

	/**
	 * Settings of file type
	 * @type {Object}
	 */
	fileTypes: {
		module: {
			delimiter: ';',
			contentPattern: '',
			tplLink: '/_module.js'
		},
		test: {
			delimiter: '});',
			contentPattern: '',
			tplLink: '/_test.spec.js'
		}
	},


	/**
	 * Init
	 * ------------------------------------------------------------------
	 */

	/**
	 * init
	 * Main script of ngGenTools
	 * Check the command and run the code.
	 *
	 * @param		object					generator		Generator instance
	 */
	init: function (generator) {
		this.generator = generator;
		this.setUpAttributes();
	},

	/**
	 * setUpAttributes
	 * set up the generator parameters in the generator
	 * instance. Ready for the promtps
	 *
	 */
	setUpAttributes: function () {
		// Get the command
		if (this.generator.args.length > 0) {
			var command = this.generator.args.shift();
			if (!!ngGenTools.commands[command]) {
				this.generator.command = command;
			} else {
				console.log('This generator cannot treat "' + command + '"');
				return;
			}
		}
		// Get the paramters for the command
		if (this.generator.args.length > 0) {
			this.generator.commandParams = this.generator.args;
		}
		return;
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
		if (!this.generator.command || !this.generator.commandParams) {
			console.log('There\'s not what I require');
			return;
		}
		this.executeTreatment();
		this.executeWriting();
	},

	/**
	 * executeTreatment
	 * make the generic treatment for most of the generator
	 * commands composed by an object name [and a module name]
	 * 
	 */
	executeTreatment: function () {
		var pObject, pModule;
		var params = this.generator.commandParams;
		var suffix = this.commands[this.generator.command].objectSuffix;
		this.checkCurrentPath();

		// Param tests
		if (typeof params !== 'object' || !params[0]) {
			throw 'Some arguments are missing';
		}
		else if (params[0].indexOf('/') !== -1 && !!params[1] && params[1].indexOf('/') !== -1) {
			throw 'The location of the new object and module are in conflict';
		}

		// Set up variables
		pObject = params[0].substr(-4).toLowerCase() === suffix.toLowerCase() ? params[0].slice(0, -4) : params[0];
		pModule = !!params[1] ? params[1] : '';

		if (pModule !== '') {
			this.generator.tpl = {
				filePath: pModule,
				moduleName: pModule.split('/').pop(),
				objectName: pObject
			};
		}
		else {
			this.generator.tpl = {
				filePath: pObject,
				moduleName: pObject.split('/').pop(),
				objectName: pObject.split('/').pop()
			};
		}
		this.generator.tpl.objectName += suffix;
		this.generator.tpl.objectNameDash = common.toDashCase(this.generator.tpl.objectName);
	},

	/**
	 * executeWriting
	 * write or ovewrite files in the repo
	 * 
	 */
	executeWriting: function () {
		var commandConfig = this.commands[this.generator.command];

		// Write files
		this.writeScript();
		this.writeTest();

		if (commandConfig.generateView) {
			this.writeView();
		}
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
		var testFile = this.scriptPath + 'app.js';
		var errorLabel = 'The current path is not correct. Please move to the root folder of the Angular app.';
		return ngGenTools.checkFile(testFile, errorLabel);
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
		var filePath = this.scriptPath + this.generator.tpl.filePath + '.js';
		var objectContent = this.engineFromTpl('/scripts/_' + this.generator.command + '.js');
		this.insertIn('module', filePath, objectContent);

		console.log(chalk.bold.yellow('Think to add your module \'' + this.generator.tpl.moduleName + '\' as dependency'));
	},

	/**
	 * writeView
	 * write the view file
	 */
	writeView: function () {
		var filePath = this.scriptPath + this.generator.tpl.filePath + '.view.html';
		this.generator.template('_view.html', filePath);
	},

	/**
	 * writeTest
	 * write the unit test file
	 */
	writeTest: function () {
		var filePath = this.testPath + this.generator.tpl.filePath + '.spec.js';
		var objectContent = this.engineFromTpl('/tests/_' + this.generator.command + '.spec.js');
		this.insertIn('test', filePath, objectContent);
	},


	/**
	 * Utils
	 * ------------------------------------------------------------------
	 */

	/**
	 * insertIn
	 * insert content into the module
	 * if the file does not exists, the script generate it
	 * 
	 * @param		String	contentToInsert		Content to add in the module
	 */
	insertIn: function (fileType, filePath, contentToInsert) {

		// Load file config
		var config = this.fileTypes[fileType];
		var moduleContent;

		// Generate the module file if it does not exists
		if (!this.checkFile(filePath)) {
			moduleContent = this.engineFromTpl(config.tplLink);
		}
		else {
			moduleContent = this.generator.readFileAsString(filePath);
			// if (!config.contentPattern.test(moduleContent)) {
			// 	throw 'The module is not valid';
			// }
			this.generator.dest.delete(filePath);
		}

		var markerPosition = moduleContent.lastIndexOf(config.delimiter);
		moduleContent = [moduleContent.slice(0, markerPosition), contentToInsert, moduleContent.slice(markerPosition)].join('');
		this.generator.dest.write(filePath, moduleContent);
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
			this.generator.readFileAsString(this.generator.src._base + tplLink),
			this.generator
		);
	},


	/**
	 * Commands data
	 * ------------------------------------------------------------------
	 */

	/**
	 * commandList
	 * generate and return an array containing the list
	 * of commands available for the generator
	 * this is based on ngGenTools.commands
	 * 
	 * @return	Array
	 */
	commandList: function () {
		var list = [];
		for (var i in ngGenTools.commands) {
			list.push(i);
		}
		return list;
	},

	/**
	 * getPromptFrom
	 * get the prompt config for a command
	 * it just return the prompt object from ngGenTools.commands
	 * and add the name attribute
	 * 
	 * @param		string		commandName		Command name
	 * @return	object
	 */
	getPromptFrom: function (commandName) {
		var prompt = ngGenTools.commands[commandName].prompt;
		for (var i in prompt) {
			prompt[i].name = i;
		}
		return prompt;
	}
};

module.exports = ngGenTools;