!function ($) {
	"use strict";

	$.fn.provePrecision = function(options){

		var regex = /^(.)*(\.[0-9]{1,2})?$/;
		var input = (options.context)? options.context(this) : $(this);
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
			validator: 'provePrecision',
			field: options.field,
			valid: isValid
		};
	};
}(window.jQuery);
