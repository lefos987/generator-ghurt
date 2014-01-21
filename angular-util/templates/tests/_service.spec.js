
	describe('<%= tpl.objectName %> service', function () {

		var mock, <%= tpl.objectName %>;
		
		beforeEach(module('<%= tpl.moduleName %>'));
		beforeEach(function () {
			mock = {};
			inject(function ($injector) {
				<%= tpl.objectName %> = $injector.get('<%= tpl.objectName %>');
			});
		});
		
		it('should not alert first two notifications', function () {
			expect(<%= tpl.objectName %>.someMethod()).toEqual(42);
		});

	});
