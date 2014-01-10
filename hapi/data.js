'use strict';

var generatorData = {

	hapiDependencies: {
		'catbox' : {
			moduleName: 'catbox',
			description: 'Multi-strategy object caching service'
		},
		'flod' : {
			moduleName: 'flod',
			description: 'A systematic toolchain for benchmarking and comparing Node.js web server ' +
			'frameworks'
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
		'travelogue' : {
			moduleName: 'travelogue',
			description: 'Passport.js integration for hapi'
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
			hapiVersion: 'latest',
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