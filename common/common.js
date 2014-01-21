
'use strict';

var common = {
	/**
	 * checkVersion
	 * validation method to check if the string given
	 * in param is a valid number
	 * 
	 * @param	string			version		Value to test
	 * @return	boolean/string
	 */
	checkVersion: function (version) {
		var pass = /^\~?[0-9]+(\.[0-9]+)\.(([0-9]+)|(x))$/.test(version);
		if (pass || (version === 'latest')) {
			return true;
		}
		else {
			return 'Please enter a valid version number';
		}
	},
	/**
	 * checkProjectVersion
	 * validation method to check if the string given
	 * in param is a valid number for versionning in
	 * package.json
	 * 
	 * @param	string			version		Value to test
	 * @return	boolean/string
	 */
	checkProjectVersion: function (version) {
		if (/^[0-9]+\.[0-9]+\.[0-9]+$/.test(version)) {
			return true;
		}
		else {
			return 'Please enter a valid version number (X.Y.Z)';
		}
	},

	/**
	 * checkRequired
	 * validation method to check if a string is not empty
	 * 
	 * @param		string			opt		Value to test
	 * @return	boolean/string
	 */
	checkRequired: function (opt) {
		if (/^[a-zA-Z0-9-_]+$/.test(opt)) {
			return true;
		}
		else {
			return 'This option is required';
		}
	},

	/**
	 * checkPort
	 * validation method to check if a number is a valid
	 * and usable port
	 * 
	 * @param		string			opt		Value to test
	 * @return	boolean/string
	 */
	checkPort: function (opt) {
		var port = parseInt(opt, 10);
		if (!!port && port > 0 && port < 65536) {
			return true;
		}
		else {
			return 'This port is not valid';
		}
	},

	/**
	 * checkModuleName
	 * validation method to check if a string is a
	 * valid name
	 * 
	 * @param		string			name		Value to test
	 * @return	boolean/string
	 */
	checkModuleName: function (name) {
		return (name === '') ? true : common.checkRequiredModuleName(name);
	},

	/**
	 * checkRequiredModuleName
	 * validation method to check if a string is a
	 * valid name. Must not be empty.
	 * 
	 * @param		string			name		Value to test
	 * @return	boolean/string
	 */
	checkRequiredModuleName: function (name) {
		if (/^[a-z][a-zA-Z0-9]*(\/[a-z][a-zA-Z0-9]*)*$/.test(name)) {
			return true;
		}
		else {
			return 'The name/path must be in camel case';
		}
	},

	/**
	 * toDashCase
	 * transform text to dash case
	 * @example
	 *  toDashCase('ngRepeat') > 'ng-repeat'
	 *
	 * @param  {string} input
	 * @return {string}
	 */
	toDashCase: function (input) {
		return input.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	},

	/**
	 * merge
	 * merge two object and return it
	 * 
	 * @param objA
	 * @param objB
	 * @returns objMerged: a new object based on objA and objB
	 */
	merge: function (objA, objB) {
		var attrname;
		var objMerged = {};
		for (attrname in objA) { objMerged[attrname] = objA[attrname]; }
		for (attrname in objB) { objMerged[attrname] = objB[attrname]; }
		return objMerged;
	},

	/**
	 * askBasic
	 * implementation for the default generator
	 * set the basic info data directly into the generator object
	 * @return void
	 */
	askBasic: function () {

		// Escape if the basicInfo is already set
		if (!!this.basicInfo._set) {
			return;
		}
		
		var cb = this.async();
		console.log('We need some information about your app to automagically create it...');
		var prompts = [{
			type: 'input',
			name: 'name',
			message: 'What is the name of your application?',
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
			name: 'license',
			message: 'Under which license is it created?',
			choices: ['BSD', 'MIT', 'Apache', 'Other']
		}];

		this.prompt(prompts, function (props) {
			this.basicInfo = common.merge(this.basicInfo, props);
			this.basicInfo._set = true;
			cb();
		}.bind(this));
	}

};

module.exports = common;