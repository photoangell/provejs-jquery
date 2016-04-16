!function ($) {
	"use strict";

	$.fn.decorate = function(framework){

		framework = framework || 'bootstrap';
		var form = $(this);

		// decorate the form
		form.on('validated.field.prove', function(event, data){
			var input = $(event.target);
			if (framework === 'bootstrap') {
				input.bootstrap(data);
			} else {
				console.warn('Unsupported decorator framework. Please make a pull request.');
			}
		});
	};

}(window.jQuery);
