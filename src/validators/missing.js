!function ($) {
	"use strict";

	$.fn.proveMissing = function( options ) {

		//return validation result
		return {
			validator: options.validator,
			field: options.field,
			valid: false,
			//value: undefined,
			message: 'Prove validator "' + options.validator+ '" not found.'
		};
	};
}(window.jQuery);
