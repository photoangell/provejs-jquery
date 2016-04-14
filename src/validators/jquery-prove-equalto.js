!function ($) {
	"use strict";

	$.fn.proveEqualTo = function( options ) {

		var input = $(this);
		var other = $(options.equalTo);
		var form = input.closest('form');
		var isSetup = input.hasClass('validator-equalto-setup');
		var isEnabled = $('body').booleanator(options.enabled);
		var isValid = (isEnabled)? (input.val() === other.val()) : undefined;

		//setup event to validate this input when other input value changes
		if (!isSetup){
			input.addClass('validator-equalto-setup');
			//on blur of other input
			form.on('focusout', options.equalTo, function(){
				input.validate();
			});
		}

		//return current validation state
		return isValid;
	};
}(window.jQuery);
