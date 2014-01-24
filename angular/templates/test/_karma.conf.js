// Karma configuration

module.exports = function(config) {
	config.set({
		// base path, that will be used to resolve files and exclude
		basePath: '../../',

		frameworks: ['jasmine'],
		// list of files / patterns to load in the browser
		files: [
			<%
			var configFiles = [
				"'dist/vendor/angular/angular.min.js'",
				"'dist/vendor/angular-mocks/angular-mocks.js'",
				"'src/**/*.js'",
				"'test/unit/**/*.spec.js'"
			];
			configFiles = configFiles.concat(
				_.map(ngDependencies.ngDepend, function(dep){return "'dist/" + _ngDepend[dep].scriptDir + "'";}),
				_.map(extDependencies.extDepend, function(dep){return "'dist/" + _extDepend[dep].scriptDir + "'";})); 
			%>
			<%= configFiles.join(',\r\t\t\t') %>
		],

		// list of files to exclude
		exclude: [
			'src/app/app.js',
			'src/app/templates.js'
		],

		// test results reporter to use
		// possible values: dots || progress || growl
		reporters: ['dots', 'coverage'],

		// web server port
		port: 9876,

//		// cli runner port
//		runnerPort: 9100,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
		browsers: ['Chrome'],

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 5000,

		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun: false,

		preprocessors: {
			// If a template need to be tested (and add it to configFiles)
			// 'src/app/common/widget/widget.html': ['ng-html2js'],
			'src/app/**/*.js': ['coverage']
		},

		// Config for coverage report
		coverageReporter: {
			type: 'html',
			dir: 'report/coverage'
		}

	});
};