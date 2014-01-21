
	describe('<%= tpl.objectName %> directive', function () {

		var $scope, element, $compile, outerDiv;
		
		beforeEach(module('<%= tpl.moduleName %>'));
		beforeEach(inject(function (_$compile_, $rootScope) {
			$scope = $rootScope.$new();
			$compile = _$compile_;
			outerDiv = '<<%= tpl.objectNameDash %>><div></div></<%= tpl.objectNameDash %>>';
			element = angular.element('<<%= tpl.objectNameDash %>></<%= tpl.objectNameDash %>>');
			$compile(element)($scope);
		}));

		it('should have only one child div', function () {
			expect(angular.element(element.children()[0]).html()).toBeUndefined();
			expect(angular.element(element.children()[1]).html()).toBeUndefined();
		});

	});
