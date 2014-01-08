'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var Q = require('q');
var common = require('../common/common');
var generatorData = require('./data');

var CapinnovationGenerator = module.exports = function CapinnovationGenerator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);
	
	// Commented out as a placeholder for possible future use
	// this.on('end', function() {});
};

util.inherits(CapinnovationGenerator, yeoman.generators.Base);


/**
 * Public methods / install script
 * ------------------------------------------------------------------
 */

CapinnovationGenerator.prototype.welcome = function welcome() {
	if (!this.options['skip-welcome-message']) {
		console.log(this.yeoman);
	}

	// Set default data
	this.basicInfo = generatorData.defaultConfig.basicInfo;
};

CapinnovationGenerator.prototype.askBasic = common.askBasic;

CapinnovationGenerator.prototype.askInstallType = function askInstallType() {
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

CapinnovationGenerator.prototype.createStructure = function createStructure() {
	var cb = this.async();
	var basicInfo;
	switch (this.basicInfo.installType) {
	case 'client' :
		this._createClient('angular', this.basicInfo).finally(function () {
			cb();
		});
		break;
	case 'server' :
		this._createServer('hapi', this.basicInfo).finally(function () {
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
		this._createClient('angular', basicInfo).finally(function () {

			this.destinationRoot('../server');
			basicInfo = common.merge(this.basicInfo, {
				name: this.basicInfo.name + '_server',
				pathPrefix: '../'
			});
			this._createServer('hapi', basicInfo).then(function () {

				this.destinationRoot('..');
				cb();
			}.bind(this));
		}.bind(this));
		break;
	}
};

CapinnovationGenerator.prototype.addReadme = function addReadme() {
	this.template('_readme.md', 'README.md');
};

CapinnovationGenerator.prototype.gitConfig = function gitConfig() {
	this.spawnCommand('git', ['init']);
	this.template('_pre-commit', '.git/hooks/pre-commit');
	this.spawnCommand('chmod', ['755', '.git/hooks/pre-commit']);
};


/**
 * Private methods
 * ------------------------------------------------------------------
 */

CapinnovationGenerator.prototype._createClient = function _createClient(client, basicInfo) {
	var deferred = Q.defer();
	var options = {
		'skip-welcome-message': true,
		basicInfo: basicInfo
	};
	this.invoke('capinnovation:' + client, {options: options}, function () {
		deferred.resolve();
	});
	return deferred.promise;
};

CapinnovationGenerator.prototype._createServer = function _createServer(server, basicInfo) {
	var deferred = Q.defer();
	var options = {
		'skip-welcome-message': true,
		basicInfo: basicInfo
	};
	this.invoke('capinnovation:' + server, {options: options}, function () {
		deferred.resolve();
	});
	return deferred.promise;
};