!function ($) {
	"use strict";

	$.fn.proveMissing = function( options ) {

		//return validation result
		return {
			field: options.field,
			validator: options.validator,
			valid: false,
			message: 'Prove validator "' + options.validator+ '" not found.'
		};
	};
}(window.jQuery);
