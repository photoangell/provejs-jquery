!function ($) {
	"use strict";

	/**
	* Pattern validator.
	* @param {bool} config The validator configuration.
	* @param {string or array} num2 The input value to validate.
	* @param {object} values All input values.
	* @return {bool or null} The result of the validation.
	*/
	$.fn.provePattern = function(options){

		var input = $(this);
		var value = input.val();
		var hasValue = input.hasValue();
		var regex = (options.regex instanceof RegExp)
			? options.regex
			: new RegExp( "^(?:" + options.regex + ")$" );
		var isValid;

		if (!hasValue) {
			// all validators should return true (or perhaps null)
			// when there is no value. Otherwise, there is no purpose
			// for the 'proveRequired' validator.
			isValid = true;
		} else if (regex instanceof RegExp) {
			isValid = regex.test(value);
		} else {
			isValid = false;
		}

		if (options.debug){
			console.groupCollapsed('Validator.provePattern()', options.field);
				console.log('options', options);
				console.log('isValid', isValid);
			console.groupEnd();
		}

		return isValid;
	};

}(window.jQuery);

