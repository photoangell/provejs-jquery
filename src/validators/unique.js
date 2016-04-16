!function ($) {
	"use strict";

	$.fn.proveUnique = function(options){

		var input = $(this);
		var value = input.vals();
		var hasValue = input.hasValue();
		var isEnabled = $('body').booleanator(options.enabled);
		var isValid;

		if (!isEnabled){
			// Validators should return undefined when there is no value.
			// Decoraters will teardown any decoration when they receive an `undefined` validation state.
			isValid = undefined;
		} else if (!hasValue) {
			// All validators (except proveRequired) should return undefined when there is no value.
			// Decoraters will teardown any decoration when they receive an `undefined` validation state.
			isValid = undefined;
		} else {
			//todo: validate uniqueness this here. Options include:
			// 1. use options.selector to find other inputs
			// 2. change $.fn.vals() to return other values like it does for checkboxes and radios
			isValid = false;
		}

		if (options.debug){
			console.groupCollapsed('Validator.proveUnique()', options.field);
				console.log('options', options);
				console.log('value', value);
				//console.log('values', values);
				console.log('isValid', isValid);
			console.groupEnd();
		}

		return {
			validator: 'proveUnique',
			field: options.field,
			state: isValid
		};
	};

}(window.jQuery);
