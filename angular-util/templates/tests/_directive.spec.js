
	describe('<%= tpl.objectName %> directive', function () {

		var $scope, element;
		
		beforeEach(module('<%= tpl.moduleName %>'));
		beforeEach(inject(function ($compile, $rootScope) {
			$scope = $rootScope;
			element = angular.element('<<%= tpl.objectNameDash %>></<%= tpl.objectNameDash %>>');
			$compile(element)($scope);
		}));

		it('shouldn\'t have child div', function () {
			$scope.$digest();
			expect(angular.element(element.children()).html()).toBeUndefined();
		});

		it('should contain the correct text', function () {
			$scope.$digest();
			expect(element.text()).toEqual('this is the <%= tpl.objectName %> directive');
		});

	});
