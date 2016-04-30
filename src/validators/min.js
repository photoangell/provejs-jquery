!function ($) {
	"use strict";

	$.fn.proveMin = function(options){

		var input = (options.context)? options.context(this) : $(this);
		var value = input.vals();
		var isEnabled = $('body').booleanator(options.enabled);
		var isValid = (isEnabled)? value >= options.min : undefined;

		if (options.debug){
			console.groupCollapsed('Validator.proveMin()', options.field);
				console.log('options', options);
				console.log('input', input);
				console.log('value', value);
				console.log('isEnabled', isEnabled);
				console.log('isValid', isValid);
			console.groupEnd();
		}

		return {
			validator: options.validator,
			field: options.field,
			valid: isValid,
			//value: value,
			message: options.message
		};
	};
}(window.jQuery);
