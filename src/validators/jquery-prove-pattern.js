!function ($) {
	"use strict";

	$.fn.provePattern = function(options){

		var input = $(this);
		var value = input.val();
		var hasValue = input.hasValue();
		var isEnabled = $('body').booleanator(options.enabled);
		var regex = (options.regex instanceof RegExp)
			? options.regex
			: new RegExp( "^(?:" + options.regex + ")$" );
		var isValid;

		if (!isEnabled){
			// Validators should return undefined when there is no value.
			// Decoraters will teardown any decoration when they receive an `undefined` validation state.
			isValid = undefined;
		} else if (!hasValue) {
			// All validators (except proveRequired) should return undefined when there is no value.
			// Decoraters will teardown any decoration when they receive an `undefined` validation state.
			isValid = undefined;
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

		return {
			validator: 'provePattern',
			field: options.field,
			state: isValid
		};
	};

}(window.jQuery);
