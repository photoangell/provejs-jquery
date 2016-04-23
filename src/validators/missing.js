!function ($) {
	"use strict";

	$.fn.proveMissing = function( options ) {

		options.message = 'Prove validator "' + options.validator+ '" not found.';

		//return validation result
		return {
			validator: options.validator,
			field: options.field,
			valid: false
		};
	};
}(window.jQuery);
