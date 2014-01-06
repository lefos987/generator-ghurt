'use strict';

angular.module('dependencies', [])<% 
	_.each(extDependencies.extDepend, function (dep) { %>
	.factory('<%= dep %>', ['$window', function ($window) {
		return $window.<%= dep %>;
	}])<% }); %>;