!function ($) {
	"use strict";

	$.fn.proveCompareTo = function( options ) {

		var input = $(this);
		var other = $(options.compareTo);
		var form = input.closest('form');
		var value1 = input.val();
		var value2 = other.val();
		var isSetup = input.hasClass('validator-equalto-setup');
		var isEnabled = $('body').booleanator(options.enabled);
		var valid;

		if (!isEnabled) {
			valid = undefined;
		} else if (value1 === options.ignore) {
			valid = true;
		} else if (value2 === options.ignore) {
			valid = true;
		} else if (options.comparison === '=') {
			valid = (value1 === value2);
		} else if (options.comparison === '!=') {
			valid = (value1 !== value2);
		} else if (options.comparison === '>=') {
			valid = (value1 >= value2);
		} else if (options.comparison === '>') {
			valid = (value1 > value2);
		} else if (options.comparison === '<=') {
			valid = (value1 <= value2);
		} else if (options.comparison === '<') {
			valid = (value1 < value2);
		} else {
			//
		}

		//setup event to validate this input when other input value changes
		if (!isSetup){
			input.addClass('validator-equalto-setup');
			//on blur of other input
			form.on('focusout', options.equalTo, function(){
				input.validate();
			});
		}

		//return validation result
		return {
			field: options.field,
			validator: options.validator,
			valid: valid,
			//value1: value1,
			message: options.message
		};
	};
}(window.jQuery);
