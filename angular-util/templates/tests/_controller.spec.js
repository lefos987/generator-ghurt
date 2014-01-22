
	describe('<%= tpl.objectName %> controller', function () {

		var scope, <%= tpl.objectName %>;
		
		beforeEach(module('<%= tpl.moduleName %>'));
		beforeEach(inject(function ($rootScope, $controller) {
			scope = $rootScope.$new();
			<%= tpl.objectName %> = $controller('<%= tpl.objectName %>', {
				$scope: scope
			});
		}));
		
		it('should have the msg correctly defined in the scope', function () {
			scope.$root.$digest();
			expect(scope.msg).toEqual('This is the <%= tpl.objectName %> controller');
		});

	});
