!function ($) {
	"use strict";

	$.fn.proveEqualTo = function( options ) {

		var input = $(this);
		var other = $(options.equalTo);
		var form = input.closest('form');
		var isSetup = input.hasClass('validator-equalto-setup');
		var isValid = (input.val() === other.val());

		//setup event to validate this input when other input value changes
		if (!isSetup){
			input.addClass('validator-equalto-setup');
			//on blur of other input
			form.on('focusout', options.equalTo, function(){
				//trigger validation of this input
				input.trigger('validate.field.prove');
			});
		}

		//return current validation state
		return isValid;
	};
}(window.jQuery);

