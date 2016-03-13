!function ($) {
	"use strict";

	$.fn.tinsel = function(options){

		options = options || {};
		var input = $(this);

		if (options.debug){
			console.groupCollapsed('Decorators.tinsel()');
				console.log('input', input);
				console.log('state', options.state);
				console.log('placement', options.placement);
				console.log('classSuccess', options.classSuccess);
				console.log('classFailure', options.classFailure);
			console.groupEnd();
		}

		function setup(input, state){
			var container = input.huntout(options.placement);
			var klass = (state)? options.classSuccess : options.classFailure;
			container.addClass(klass);
		}

		function teardown(input){
			var container = input.huntout(options.placement);
			container.removeClass(options.classFailure).removeClass(options.classSuccess);
		}

		teardown(input);
		if (options.state === true || options.state === false) {
			setup(input, options.state);
		}
	};
}(window.jQuery);
