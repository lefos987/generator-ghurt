'use strict';

/*global module*/

module.exports = function (grunt) {

	require('load-grunt-tasks')(grunt);

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
		githooks: {
			all: {
				// Will run the build task at every commit
				'pre-commit': 'build'
			}
		},
		ngdocs: {
			options: {
				html5Mode: false
			},
			all: ['src/**/*.js']
		}
	});

	// Default task.
	grunt.registerTask('develop', ['timestamp', 'jshint', 'test', 'watch']);

	grunt.registerTask('test', 'jasmine_node');

	grunt.registerTask('timestamp', function () {
		grunt.log.subhead(Date());
	});

	grunt.registerTask('supervise', function () {
		this.async();
		require('supervisor').run(['server.js']);
	});

	grunt.registerTask('build', ['jshint', 'test']);
};
