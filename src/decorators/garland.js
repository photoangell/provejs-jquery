!function ($) {
	"use strict";

	$.fn.garland = function(options){

		options = options || {};
		var input = $(this);

		if (options.debug){
			console.groupCollapsed('Decorators.garland()');
				console.log('input', input);
				console.log('valid', options.valid);
				console.log('wrapper', options.wrapper);
				console.log('placement', options.placement);
				console.log('message', options.message);
			console.groupEnd();
		}

		function setup(container){
			var garland = $(options.wrapper);
			garland.addClass('garland-wrapper');
			garland.text(options.message);
			container.append(garland);
		}

		function teardown(container){
			container.find('.garland-wrapper').remove();
		}

		if (options.valid === true) {
			teardown(input);
			setup(input, options);
		} else {
			teardown(input);
		}
	};
}(window.jQuery);
