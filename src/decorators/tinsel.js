!function ($) {
	"use strict";

	$.fn.tinsel = function(options){

		options = options || {};
		var input = $(this);

		if (options.debug){
			console.groupCollapsed('Decorators.tinsel()');
				console.log('input', input);
				console.log('validation', options.validation);
				console.log('placement', options.placement);
				console.log('classSuccess', options.classSuccess);
				console.log('classFailure', options.classFailure);
			console.groupEnd();
		}

		function setup(container, validation){
			//var container = input.huntout(options.placement);
			var klass = (validation === 'success')? options.classSuccess : options.classFailure;
			container.addClass(klass);
		}

		function teardown(container){
			//var container = input.huntout(options.placement);
			container.removeClass(options.classFailure).removeClass(options.classSuccess);
		}

		teardown(input);
		if (options.validation === 'success' || options.validation === 'danger') {
			setup(input, options.validation);
		}
	};
}(window.jQuery);
