!function ($) {
	"use strict";

	$.fn.garland = function(options){

		options = options || {};
		var input = $(this);

		if (options.debug){
			console.groupCollapsed('Decorators.garland()');
				console.log('input', input);
				console.log('validation', options.validation);
				console.log('wrapper', options.wrapper);
				console.log('placement', options.placement);
				console.log('message', options.message);
			console.groupEnd();
		}

		function setup(container){
			var garland = $(options.wrapper);
			garland.addClass('garland-wrapper');
			garland.html(options.message);
			container.children().not('.form-control-static').last().after(garland);
		}

		function teardown(container){
			container.find('.garland-wrapper').remove();
		}
		
		teardown(input);
		if (options.message) setup(input, options);
	};
}(window.jQuery);
