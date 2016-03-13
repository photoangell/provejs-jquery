!function ($) {
	"use strict";

	$.fn.garland = function(options){

		options = options || {};
		var input = $(this);

		if (options.debug){
			console.groupCollapsed('Decorators.garland()');
				console.log('input', input);
				console.log('state', options.state);
				console.log('wrapper', options.wrapper);
				console.log('placement', options.placement);
				console.log('message', options.message);
			console.groupEnd();
		}

		function setup(input){
			var container = input.huntout(options.placement);
			var garland = $(options.wrapper);
			garland.addClass('garland-wrapper');
			garland.text(options.message);
			container.append(garland);
		}

		function teardown(input){
			var container = input.huntout(options.placement);
			container.find('.garland-wrapper').remove();
		}

		if (options.state === true) {
			teardown(input);
			setup(input, options);
		} else {
			teardown(input);
		}

	};
}(window.jQuery);
