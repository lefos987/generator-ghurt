'use strict';

/*global module*/

module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt);
	var pkg = grunt.file.readJSON('package.json');

	// Project configuration.
	grunt.initConfig({
		watch: {
			files: ['gruntFile.js', 'server.js', 'src/**/*.js', 'test/**/*.js'],
			tasks: 'develop'
		},
		jshint: {
			files: ['gruntFile.js', 'server.js', 'src/**/*.js', 'test/**/*.js'],
			options: {
				jshintrc: '.jshintrc'
			}
		},
		'jasmine_node': {
			coverage: {
				options : {
					failTask: true,
					branches : 85,
					functions: 90,
					statements: 90,
					lines: 90
				},
				src: ['src/**/*.js']
			},
			verbose: false,
			specFolders: ['test'],
			projectRoot: 'src',
			options: {
				match: '.',
				matchall: false,
				forceExit: false,
				extensions: 'js',
				jUnit: {
					report: false,
					savePath : './build/reports/jasmine/',
					useDotNotation: true,
					consolidate: true
				}
			}
		},
		ngdocs: {
			options: {
				html5Mode: false
			},
			all: ['src/**/*.js']
		},
		plato: {
			scripts: {
				files: {
					'report/output/directory': ['src/**/*.js', 'test/**/*.js']
				}
			}
		},
	});

	// Default task.
	grunt.registerTask('develop', ['timestamp', 'jshint', 'test', 'watch']);

	grunt.registerTask('test', 'jasmine_node');

	grunt.registerTask('timestamp', function () {
		grunt.log.subhead(Date());
	});

	grunt.registerTask('server', function () {
		this.async();
		require('supervisor').run(['server.js']);
	});

	grunt.registerTask('build', ['jshint', 'test']);
};
