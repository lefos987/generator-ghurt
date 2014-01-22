

	/**
	 * @ngdoc function
	 * @name ng.directive:<%= tpl.objectName %>
	 * @function
	 *
	 * @description
	 * [add a description]
	 *
	 * @example
	   <doc:example>
	     <doc:source>
	       <<%= tpl.objectName %>></<%= tpl.objectName %>>
	     </doc:source>
	   </doc:example>
	 */
	.directive('<%= tpl.objectName %>', function () {
		return {
			template: '<div></div>',
			restrict: 'E',
			link: function postLink(scope, element) {
				// postLink can have these params: scope, element, attrs
				element.text('this is the <%= tpl.objectName %> directive');
			}
		};
	})