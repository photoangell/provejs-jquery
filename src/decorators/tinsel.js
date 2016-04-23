!function ($) {
	"use strict";

	$.fn.tinsel = function(options){

		options = options || {};
		var input = $(this);

		if (options.debug){
			console.groupCollapsed('Decorators.tinsel()');
				console.log('input', input);
				console.log('valid', options.valid);
				console.log('placement', options.placement);
				console.log('classSuccess', options.classSuccess);
				console.log('classFailure', options.classFailure);
			console.groupEnd();
		}

		function setup(container, valid){
			//var container = input.huntout(options.placement);
			var klass = (valid)? options.classSuccess : options.classFailure;
			container.addClass(klass);
		}

		function teardown(container){
			//var container = input.huntout(options.placement);
			container.removeClass(options.classFailure).removeClass(options.classSuccess);
		}

		teardown(input);
		if (options.valid === true || options.valid === false) {
			setup(input, options.valid);
		}
	};
}(window.jQuery);
