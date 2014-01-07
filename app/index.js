'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var CapinnovationGenerator = module.exports = function CapinnovationGenerator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);

	this.on('end', function() {
		
	});

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
		type: 'list',
		name: 'appType',
		message: 'Are you creating a: ',
		choices: choices
	}];

	this.prompt(prompts, function (props) {
		this.basicInfo = props;
		cb();
	}.bind(this));
};

CapinnovationGenerator.prototype.createStructure = function createStructure() {
	switch (this.basicInfo.appType) {
	case 'client' :
		this.invoke('capinnovation:angular');
		break;
	case 'server' :
		this.invoke('capinnovation:hapi');
		break;
	case 'both' :
		this.mkdir('client');
		this.spawnCommand('cd', ['client']);
		this.invoke('capinnovation:angular', {}, function () {
			this.spawnCommand('cd', ['..']);
			this.mkdir('server');
			this.spawnCommand('cd', ['server']);
			this.invoke('capinnovation:hapi');
		});
		break;
	}


	// case 'both' :
	// 	this.mkdir('server');
	// 	this.spawnCommand('cd', ['server']);
	// 	this.spawnCommand('yo', ['capinnovation:hapi', '--skip-welcome-message']);
	// 	this.spawnCommand('cd', ['..']);
	// 	this.mkdir('client');
	// 	this.spawnCommand('cd', ['client']);
	// 	this.spawnCommand('yo', ['capinnovation:angular', '--skip-welcome-message']);
	// 	break;
	// }
};