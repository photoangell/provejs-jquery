!function ($) {
	"use strict";

	$.fn.proveUnique = function(options){

		var input = $(this);
		var value = input.val();
		var hasValue = input.hasValue();
		var isEnabled = $('body').booleanator(options.enabled);
		var others = $(options.uniqueTo).not(input);
		var valid = true;

		if (!isEnabled){
			// Validators should return undefined when there is no value.
			// Decoraters will teardown any decoration when they receive an `undefined` validation result.
			valid = undefined;
		} else if (!hasValue) {
			// All validators (except proveRequired) should return undefined when there is no value.
			// Decoraters will teardown any decoration when they receive an `undefined` validation result.
			valid = undefined;
		} else {
			// compare against other input values
			others.each(function(){
				var other = $(this);
				if (other.hasValue() && other.val() === value) valid = false;
			});
		}

		if (options.debug){
			console.groupCollapsed('Validator.proveUnique()', options.field);
				console.log('options', options);
				console.log('value', value);
				console.log('valid', valid);
			console.groupEnd();
		}

		return {
			field: options.field,
			validator: options.validator,
			valid: valid,
			message: options.message
		};
	};
}(window.jQuery);
