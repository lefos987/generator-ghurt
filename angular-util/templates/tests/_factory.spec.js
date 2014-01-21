
	describe('<%= tpl.objectName %> factory', function () {

		var <%= tpl.objectName %>;

		beforeEach(module('<%= tpl.moduleName %>'));
		beforeEach(inject(function (_<%= tpl.objectName %>_) {
			<%= tpl.objectName %> = _<%= tpl.objectName %>_;
		}));

		it('- should return the meaning of life', function () {
			expect(<%= tpl.objectName %>.someMethod()).toEqual(42);
		});

	});
