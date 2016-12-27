!function ($) {
	"use strict";

	$.fn.texty = function(options){

		options = options || {};
		var input = $(this);

		if (options.debug){
			console.groupCollapsed('Decorators.texty()');
				console.log('input', input);
				console.log('validation', options.validation);
				console.log('wrapper', options.wrapper);
				console.log('placement', options.placement);
				console.log('message', options.message);
			console.groupEnd();
		}

		function setup(container){
			var texty = $(options.wrapper);
			texty.addClass('texty-wrapper');
			texty.html(options.message);
			container.children().not('.form-control-static').last().after(texty);
		}

		function teardown(container){
			container.find('.texty-wrapper').remove();
		}

		teardown(input);
		if (options.message) setup(input, options);
	};
}(window.jQuery);
