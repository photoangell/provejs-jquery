!function ($) {
	"use strict";

	$.fn.proveEqualTo = function( options ) {

		var input = $(this);
		var other = $(options.equalTo);
		var form = input.closest('form');
		var value = input.val();
		var isSetup = input.hasClass('validator-equalto-setup');
		var isEnabled = $('body').booleanator(options.enabled);
		var isValid = (isEnabled)? (value === other.val()) : undefined;

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
			validator: 'proveEqualTo',
			field: options.field,
			valid: isValid,
			value: value,
			message: options.message
		};
	};
}(window.jQuery);
