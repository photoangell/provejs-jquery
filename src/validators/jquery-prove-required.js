!function ($) {
	"use strict";

	/**
	* Required validator.
	* @param {object} options The validator configuration.
	* @option {string or array} state The input value to validate.
	* @option {object} values All input values.
	* @return {bool or null} The result of the validation.
	*/
	$.fn.proveRequired = function(options){

		var input = $(this);
		var value = input.vals();
		var isValid = input.hasValue();

		if (options.debug){
			console.groupCollapsed('Validator.required()', options.field);
				console.log('options', options);
				console.log('input', input);
				console.log('value', value);
				console.log('isValid', isValid);
			console.groupEnd();
		}

		return isValid;
	};
}(window.jQuery);
