'use strict';

module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt);
	var pkg = grunt.file.readJSON('package.json');

	grunt.initConfig({

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
				src: 'coverage'
			}
		},
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
		coverage: {
			options: {
				thresholds: {
					statements: 90,
					branches: 100,
					functions: 90,
					lines: 90
				},
				dir: 'coverage'
			}
		},
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
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				ignores: ['src/app/templates.js']
			},
			files: ['gruntFile.js', '<%= src.js %>', '<%= src.specs %>']
		},
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
		ngdocs: {
			options: {
				html5Mode: false
			},
			all: ['<%= src.js %>']
		},
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
		useminPrepare: {
			html: '<%= distDir %>/index.html'
		},
		usemin: {
			html: ['<%= distDir %>/**/*.html'],
			css: ['<%= distDir %>/**/*.css'],
			options: {
				basedir: '../',
				dirs: ['<%= distDir %>']
			}
		},
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
		plato: {
			scripts: {
				files: {
					'report/output/directory': ['<%= src.js %>', '<%= src.specs %>']
				}
			}
		},
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

	grunt.registerTask('default', ['jshint', 'watch']);

	grunt.registerTask('test', ['clean:other', 'karma:build', 'coverage']);

	grunt.registerTask('develop', ['clean', 'compass', 'html2js', 'concat', 'jshint',
		'karma:unit', 'watch']);

	grunt.registerTask('server', ['connect:server']);

	grunt.registerTask('build', ['clean', 'compass', 'jshint', 'useminPrepare',
		'html2js',	'concat', 'cssmin', 'uglify', 'usemin', 'karma:build', 'coverage']);

};