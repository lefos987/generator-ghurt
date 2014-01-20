'use strict';

module.exports = function (grunt) {
	// NPM module that loads all tasks of type grunt-
	require('load-grunt-tasks')(grunt);
	var pkg = grunt.file.readJSON('package.json');

	// Project configuration.
	grunt.initConfig({
		/**
		 * Build Tasks
		 * ###########################################################
		 */

		/**
		 * jshint
		 * Apply lint rules into the js code
		 */
		jshint: {
			files: ['gruntFile.js', 'server.js', 'src/**/*.js', 'test/**/*.js'],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		/**
		 * jasmine_node
		 * Use jasmine_node test runner to run unit tests for node
		 */
		'jasmine_node': {
			coverage: {
				options : {
					failTask: true,
					branches : 85,
					functions: 90,
					statements: 90,
					lines: 90
				},
				savePath: 'report/coverage',
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

		/**
		 * Reports and Docs
		 * ------------------------------------------------------------------
		 */
		
		/**
		 * ngdocs
		 * Generates documentation from comments according to the Angular way
		 * (based on jsDoc)
		 */
		ngdocs: {
			options: {
				html5Mode: false
			},
			all: ['src/**/*.js']
		},

		/**
		 * plato
		 * Use plato util to generate static analysis report for our code
		 */
		plato: {
			scripts: {
				files: {
					'report/plato': ['src/**/*.js', 'test/**/*.js']
				}
			}
		},

		/**
		 * LiveReload Tasks
		 * ###########################################################
		 */

		/**
		 * watch
		 * Watch the scripts for any change and apply the develop grunt task
		 */
		watch: {
			files: ['gruntFile.js', 'server.js', 'src/**/*.js', 'test/**/*.js'],
			tasks: 'develop'
		}
	});

	/**
	 * Our Tasks
	 * ###########################################################
	 */

	// Default task.
	grunt.registerTask('develop', [
		'timestamp',
		'jshint',
		'test',
		'watch'
	]);

	grunt.registerTask('test', 'jasmine_node');

	grunt.registerTask('serve', function () {
		this.async();
		require('supervisor').run(['server.js']);
	});

	grunt.registerTask('report', [
		'ngdocs',
		'test',
		'plato'
	]);

	grunt.registerTask('build', ['jshint', 'report']);

	grunt.registerTask('timestamp', function () {
		grunt.log.subhead(Date());
	});
};