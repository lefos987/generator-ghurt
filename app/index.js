'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var Q = require('q');
var common = require('../common/common');

var CapinnovationGenerator = module.exports = function CapinnovationGenerator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);
	//Commented out as a placeholder for possible future use
	// this.on('end', function() {});
	this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(CapinnovationGenerator, yeoman.generators.Base);

CapinnovationGenerator.prototype.welcome = function welcome() {
	if (!this.options['skip-welcome-message']) {
		console.log(this.yeoman);
	}
};

CapinnovationGenerator.prototype.askBasic = function askBasic() {

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
		type: 'input',
		name: 'name',
		message: 'What is the name of your app?',
		validate: common.checkRequired
	}, {
		type: 'list',
		name: 'type',
		message: 'Are you creating a: ',
		choices: choices
	}];

	this.prompt(prompts, function (props) {
		this.basicInfo = props;
		cb();
	}.bind(this));
};

CapinnovationGenerator.prototype.createStructure = function createStructure() {
	var cb = this.async();
	var appInfo = {
		appName: this.basicInfo.name
	};
	switch (this.basicInfo.type) {
	case 'client' :
		this._createClient('angular', appInfo).finally(function () {
			cb();
		});
		break;
	case 'server' :
		this._createServer('hapi', appInfo).finally(function () {
			cb();
		});
		break;
	case 'both' :
		this.mkdir('client');
		this.mkdir('server');

		this.destinationRoot('client');
		appInfo.appName = this.basicInfo.name + '_client';
		this._createClient('angular', appInfo).finally(function () {
			this.destinationRoot('../server');
			appInfo.appName = this.basicInfo.name + '_server';
			this._createServer('hapi', appInfo).then(function () {
				this.destinationRoot('..');
				cb();
			}.bind(this));
		}.bind(this));
		break;
	}
};

CapinnovationGenerator.prototype.addReadme = function addReadme() {
	console.log('tadsaasd');
	this.packageInfo = this.dest.readJSON((this.basicInfo.type === 'both') ?
	'client/package.json' : 'package.json');
	console.log('asdsad ', this.packageInfo);
	this.template('_readme.md', 'README.md');
};

CapinnovationGenerator.prototype._createClient = function _createClient(client, appInfo) {
	var deferred = Q.defer();
	var options = {
		'skip-welcome-message': true,
		appName: appInfo.appName
	};
	this.invoke('capinnovation:' + client, {options: options}, function () {
		deferred.resolve();
	});
	return deferred.promise;
};

CapinnovationGenerator.prototype._createServer = function _createServer(server, appInfo) {
	var deferred = Q.defer();
	var options = {
		'skip-welcome-message': true,
		appName: appInfo.appName
	};
	this.invoke('capinnovation:' + server, {options: options}, function () {
		deferred.resolve();
	});
	return deferred.promise;
};