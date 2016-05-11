!function ($) {
	"use strict";

	$.fn.proveDeferred = function(options){

		var input = $(this);
		var value = input.vals();
		var hasValue = input.hasValue();
		//var valid = input.hasValue();
		var isEnabled = $('body').booleanator(options.enabled);
		var dfd = $.Deferred();
		var result = {
			field: options.field,
			validator: options.validator,
			message: options.message
		};

		if (!isEnabled){
			result.valid = undefined;
			dfd.resolve(result);
		} else if (!hasValue) {
			// All validators are optional except for `required` validator.
			result.valid = true;
			dfd.resolve(result);
		} else {
			result.valid = options.valid;
			setTimeout(function(){
				dfd.resolve(result);
			}, options.delay);
		}

		if (options.debug){
			console.groupCollapsed('Validator.proveDeferredNever()', options.field);
				console.log('options', options);
				console.log('input', input);
				console.log('value', value);
				console.log('isEnabled', isEnabled);
				console.log('valid', result.valid);
			console.groupEnd();
		}

		return dfd;
	};
}(window.jQuery);
