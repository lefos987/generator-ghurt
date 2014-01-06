'use strict';

angular.module('app', ['common'<%= _.map(ngDependencies.ngDepend, function (dep) { return ", '"+_ngDepend[dep].moduleName+"'"; }).join('') %>])<% 
	if (_hasNgDepend('angular-route')) { %>
	.config(['$routeProvider', '$locationProvider', 'html5Mode', function ($routeProvider, $locationProvider, html5Mode) {
		$routeProvider
			.when('/', {
				templateUrl: './src/app/app.view.html',
				controller: 'AppCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});
		$locationProvider.html5Mode(html5Mode);
	}])<% } %>
	.controller('AppCtrl', ['$scope', function ($scope) {
			$scope.message = 'Hello World';
		}
	]);