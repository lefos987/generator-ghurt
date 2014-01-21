
	describe('<%= tpl.objectName %> filter', function () {

		var filter;
		
		beforeEach(module('<%= tpl.moduleName %>'));
		beforeEach(inject(function ($filter) {
			filter = $filter('<%= tpl.objectName %>');
		}));

		it('should return a rounded value', function () {
			expect(filter('')).toBe('<%= tpl.objectName %> filter: ');
			expect(filter('0')).toBe('<%= tpl.objectName %> filter: 0');
			expect(filter('12')).toBe('<%= tpl.objectName %> filter: 12');
			expect(filter('hi')).toBe('<%= tpl.objectName %> filter: hi');
		});

	});
