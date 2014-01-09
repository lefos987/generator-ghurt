'use strict';

angular.module('app', ['templates', 'common'<%= _.map(ngDependencies.ngDepend, function (dep) { return ", '"+_ngDepend[dep].moduleName+"'"; }).join('') %>])<% 
	if (_hasNgDepend('angular-route')) { %>
	.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'app/app.view.html',
				controller: 'AppCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});
		$locationProvider.html5Mode(true);
	}])<% } %>
	.controller('AppCtrl', ['$scope', function ($scope) {
			$scope.message = 'Hello World';
		}
	]);