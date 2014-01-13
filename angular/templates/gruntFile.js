'use strict';

module.exports = function (grunt) {
	// NPM module that loads all tasks of type grunt-
	require('load-grunt-tasks')(grunt);
	var pkg = grunt.file.readJSON('package.json');

	grunt.initConfig({
		/**
		 * Basic info of our app
		 * ###########################################################
		 */
		pkg: pkg,
		banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' + ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' + ' * Licensed <%= pkg.licenses %>\n */\n',
		distDir: 'dist',
		src: {
			js: ['src/**/*.js'],
			specs: ['test/**/*.spec.js'],
			scss: ['src/styles/scss/**/*.scss'],
			css: ['src/styles/css/**/*.css'],
			html: ['src/**/*.html']
		},

		/**
		 * Build Tasks
		 * ###########################################################
		 */
		
		/**
		 * General tasks
		 * ------------------------------------------------------------------
		 */
		
		/**
		 * clean
		 * Delete any unnecessary files from dist folder
		 * Also delete any generated directories (like coverage, .sass-cache)
		 */
		clean: {
			css: {
				src: '<%= distDir %>/app.css'
			},
			compass: {
				src: '.sass-cache'
			},
			index: {
				src: '<%= distDir %>/index.html'
			},
			js: {
				src: '<%= distDir %>/app.js'
			},
			other: {
				src: ['docs', 'report']
			}
		},
		/**
		 * concat
		 * Concatenate all js files into one and all css files into one.
		 */
		concat: {
			options: {
				stripBanners: true,
				separator: ';'
			},
			js: {
				src: 'src/**/*.js',
				dest: '<%= distDir %>/app.js'
			},
			index: {
				src: 'src/index.html',
				dest: '<%= distDir %>/index.html'
			},
			css: {
				options: {
					separator: ''
				},
				src: ['src/styles/css/**/*.css', 'src/assets/fonts/**/*.css'],
				dest: '<%= distDir %>/app.css'
			}
		},
		/**
		 * useminPrepare
		 * Find the tagged blocks in index.html in order to be replaced
		 * with their minified versions in the usemin task
		 */
		useminPrepare: {
			html: '<%= distDir %>/index.html'
		},
		/**
		 * usemin
		 * Replace the references of non-minified files tagged in the useminPrepare task
		 * with their minified versions
		 */
		usemin: {
			html: ['<%= distDir %>/**/*.html'],
			css: ['<%= distDir %>/**/*.css'],
			options: {
				basedir: '../',
				dirs: ['<%= distDir %>']
			}
		},

		/**
		 * CSS tasks
		 * ------------------------------------------------------------------
		 */
		
		/**
		 * compass
		 * Compiles SCSS files into CSS files
		 */
		compass: {
			dev: {
				options: {
					config: 'src/styles/config.rb'
				}
			},
			clean: {
				options: {
					clean: true
				}
			}
		},
		/**
		 * cssmin
		 * Minifies the concatenated file of css in the dist folder
		 */
		cssmin: {
			options: {
				banner: '<%= banner %>'
			},
			minify: {
				expand: true,
				cwd: '<%= distDir %>/',
				src: ['*.css', '!*.min.css'],
				dest: '<%= distDir %>/',
				ext: '.min.css'
			}
		},

		/**
		 * JS tasks
		 * ------------------------------------------------------------------
		 */
		
		/**
		 * html2js
		 * Convert angular partial html templates into a js module
		 */
		html2js: {
			options: {
				module: 'templates',
				quoteChar: '\'',
				indentString: '	',
				useStrict: true
			},
			main: {
				src: 'src/**/*.view.html',
				dest: 'src/app/templates.js'
			}
		},
		/**
		 * jshint
		 * Apply lint rules into the js code
		 */
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				ignores: ['src/app/templates.js']
			},
			files: ['gruntFile.js', '<%= src.js %>', '<%= src.specs %>']
		},
		/**
		 * karma
		 * Use karma test runner to run unit tests for angular
		 */
		karma: {
			unit: {
				configFile: 'test/config/karma.conf.js',
				background: true
			},
			build: {
				configFile: 'test/config/karma.conf.js',
				singleRun: true
			}
		},
		/**
		 * uglify
		 * Minify concatenated js file of dist directory
		 */
		uglify: {
			options: {
				banner: '<%= banner %>',
				mangle: true
			},
			js: {
				src: '<%= distDir %>/app.js',
				dest: '<%= distDir %>/app.min.js'
			}
		},

		/**
		 * Reports and Docs
		 * ------------------------------------------------------------------
		 */
		
		/**
		 * coverage
		 * Creates test coverage report and validates against pre-set thresholds
		 */
		coverage: {
			options: {
				thresholds: {
					statements: 90,
					branches: 100,
					functions: 90,
					lines: 90
				},
				dir: 'report/coverage'
			}
		},
		/**
		 * ngdocs
		 * Generates documentation from comments according to the Angular way
		 * (based on jsDoc)
		 */
		ngdocs: {
			options: {
				html5Mode: false
			},
			all: ['<%= src.js %>']
		},
		/**
		 * plato
		 * Use plato util to generate static analysis report for our code
		 */
		plato: {
			scripts: {
				files: {
					'report/plato': ['<%= src.js %>', '<%= src.specs %>']
				}
			}
		},

		/**
		 * LiveReload Tasks
		 * ###########################################################
		 */
		
		/**
		 * connect
		 * Use connect middleware to set up a web server for livereload
		 */
		connect: {
			server: {
				options: {
					port: pkg.connectServerPort,
					hostname: '*',
					base: 'dist',
					keepalive: true,
					livereload: true,
					open: true
				}
			}
		},
		/**
		 * watch
		 * Watch the files for any change and apply the corresponding grunt task
		 * according to the type of the file.
		 * Example, if a scss file changes run compass and clean(to remove .sass-cache)
		 */
		watch: {
			options: {
				livereload: '<%= connect.server.options.livereload %>'
			},
			js: {
				files: ['<%= src.js %>', '<%= src.specs %>'],
				tasks: ['clean:js', 'clean:other', 'jshint', 'concat:js', 'karma:unit:run']
			},
			scss: {
				files: ['<%= src.scss %>'],
				tasks: ['compass:dev', 'clean:compass']
			},
			css: {
				files: ['<%= src.css %>'],
				tasks: ['clean:css', 'concat:css']
			},
			html: {
				files: ['<%= src.html %>'],
				tasks: ['clean:index', 'html2js', 'concat:index']
			}
		}
	});

	/**
	 * Our Tasks
	 * ###########################################################
	 */

	grunt.registerTask('develop', [
		'clean',
		'compass',
		'html2js',
		'concat',
		'jshint',
		'karma:unit',
		'watch'
	]);

	grunt.registerTask('test', [
		'clean:other',
		'karma:build',
		'coverage'
	]);

	grunt.registerTask('server', ['connect:server']);

	grunt.registerTask('report', [
		'clean:other',
		'ngdocs',
		'karma:build',
		'plato',
		'coverage'
	]);

	grunt.registerTask('build', [
		'clean',
		'compass',
		'jshint',
		'useminPrepare',
		'html2js',
		'concat',
		'cssmin',
		'uglify',
		'usemin',
		'ngdocs',
		'karma:build',
		'plato',
		'coverage'
	]);

};