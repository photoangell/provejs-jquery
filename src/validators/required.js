!function ($) {
	"use strict";

	$.fn.proveRequired = function(options){

		var input = (options.context)? options.context(this) : $(this);
		var value = input.vals();
		var isEnabled = $('body').booleanator(options.enabled);
		var isValid = (isEnabled)? input.hasValue() : undefined;

		if (options.debug){
			console.groupCollapsed('Validator.proveRequired()', options.field);
				console.log('options', options);
				console.log('input', input);
				console.log('value', value);
				console.log('isEnabled', isEnabled);
				console.log('isValid', isValid);
			console.groupEnd();
		}

		return {
			validator: 'proveRequired',
			field: options.field,
			valid: isValid,
			value: value,
			message: options.message
		};
	};
}(window.jQuery);
