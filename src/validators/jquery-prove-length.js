!function ($) {
	"use strict";

	/**
	* Required validator.
	* @param {object} options The validator configuration.
	* @option {string or array} state The input value to validate.
	* @option {object} values All input values.
	* @return {bool or null} The result of the validation.
	*/
	$.fn.proveLength = function(options){

		var input = $(this);
		var value = input.vals();
		var hasValue = input.hasValue();
		var isValid = input.hasValue();
		var isEnabled = $('body').booleanator(options.enabled);
		var okMin = (typeof options.min !== 'undefined')? (value.length >= options.min) : true;
		var okMax = (typeof options.max !== 'undefined')? (value.length <= options.max) : true;

		if (!isEnabled){
			isEnabled = undefined;
		} else if (!hasValue) {
			// All validators are optional except of `required` validator.
			isValid = true;
		} else if (okMin && okMax) {
			isValid = true;
		} else {
			isValid = false;
		}

		if (options.debug){
			console.groupCollapsed('Validator.proveLength()', options.field);
				console.log('options', options);
				console.log('input', input);
				console.log('value', value);
				console.log('isEnabled', isEnabled);
				console.log('isValid', isValid);
			console.groupEnd();
		}

		return isValid;
	};
}(window.jQuery);
