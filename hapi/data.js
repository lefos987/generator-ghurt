'use strict';

var generatorData = {

	hapiDependencies: {
		'bell' : {
			moduleName: 'bell',
			description: 'Third-party login plugin for hapi'
		},
		'catbox' : {
			moduleName: 'catbox',
			description: 'Multi-strategy object caching service'
		},
		'hapi-auth-cookie' : {
			moduleName: 'hapi-auth-cookie',
			description: 'Cookie authentication plugin'
		},
		'hapi-auth-cookie' : {
			moduleName: 'hapi-auth-cookie',
			description: 'Cookie authentication plugin'
		},
		'joi' : {
			moduleName: 'joi',
			description: 'Object schema description language and validator for JavaScript objects'
		},
		'shot' : {
			moduleName: 'shot',
			description: 'Injects a fake HTTP request/response into a node HTTP server for simulating ' +
			'server logic'
		},
		'yar' : {
			moduleName: 'yar',
			description: 'A hapi session plugin and cookie jar'
		}
	},

	extDependencies: {
		'lodash' : {
			moduleName: 'lodash'
		},
		'moment' : {
			moduleName: 'moment'
		},
		'mongojs' : {
			moduleName: 'mongojs'
		},
		'q' : {
			moduleName: 'q'
		},
		'redis' : {
			moduleName: 'redis'
		},
		'request' : {
			moduleName: 'request'
		},
		'winston' : {
			moduleName: 'winston'
		},
		'xml2json': {
			moduleName: 'xml2json'
		}
	},

	defaultConfig: {
		basicInfo: {
			name: '',
			description: '',
			version: '0.0.1',
			author: 'Capgemini Innovation',
			repo: '',
			license: '',
			pathPrefix: '',
			serverPort: 50000,
			quickInstall: false
		},
		hapiDependencies: {
			hapiVersion: '~2.x',
			hapiDepend: [
				'catbox',
				'joi'
			]
		},
		extDependencies: {
			extDepend: [
				'lodash',
				'request',
				'q',
				'redis',
				'winston'
			]
		}
	}
};

module.exports = generatorData;
