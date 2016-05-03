!function ($) {
	"use strict";

	$.fn.decorateErrors = function(errors){

		errors = errors || {};
		var form = $(this);

		$.each(errors, function(name, message){
			var selector = '[name="' + name + '"]';
			var data = {
				validator: 'server',
				field: name,
				valid: false,
				message: message
			};
			var input = form.find(selector);
			input.trigger('validated.input.prove', data);
		});
	};

}(window.jQuery);
