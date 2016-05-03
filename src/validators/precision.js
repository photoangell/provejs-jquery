!function ($) {
	"use strict";

	$.fn.provePrecision = function(options){

		var regex = /^(.)*(\.[0-9]{1,2})?$/;
		var input = $(this);
		var value = input.vals();
		var isEnabled = $('body').booleanator(options.enabled);
		var isValid = (isEnabled)? regex.test(value) : undefined;

		if (options.debug){
			console.groupCollapsed('Validator.provePrecision()', options.field);
				console.log('options', options);
				console.log('input', input);
				console.log('value', value);
				console.log('isEnabled', isEnabled);
				console.log('isValid', isValid);
			console.groupEnd();
		}

		return {
			field: options.field,
			validator: options.validator,
			valid: isValid,
			message: options.message
		};
	};
}(window.jQuery);
