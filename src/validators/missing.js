!function ($) {
	"use strict";

	$.fn.proveMissing = function( options ) {

		options.message = 'Prove validator "' + options.validator+ '" not found.';

		//return current validation state
		return {
			validator: options.validator,
			field: options.field,
			state: false
		};
	};
}(window.jQuery);
