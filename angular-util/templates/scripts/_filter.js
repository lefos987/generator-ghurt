

	/**
	 * @ngdoc function
	 * @name ng.filter:<%= tpl.objectName %>
	 * @function
	 *
	 * @description
	 * [add a description]
	 *
	 * @param {string} input Source array or string.
	 * @returns {string} A new string with the name of the filter.
	 *
	 * @example
	   <doc:example>
	     <doc:source>
	       <script>
	         function Ctrl($scope) {
	           $scope.letters = "abcdefghi";
	         }
	       </script>
	       <div ng-controller="Ctrl">
	         {{letters}} become {{ letters | <%= tpl.objectName %> }}
	       </div>
	     </doc:source>
	     <doc:scenario>
	       it('should add the filter name', function() {
	         expect(binding('letters | <%= tpl.objectName %>')).toEqual('<%= tpl.objectName %> filter: abcdefghi');
	       });
	     </doc:scenario>
	   </doc:example>
	 */
	.filter('<%= tpl.objectName %>', function () {
		return function (input) {
			return '<%= tpl.objectName %> filter: ' + input;
		};
	})