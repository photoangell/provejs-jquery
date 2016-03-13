!function ($) {
	"use strict";

	$.fn.bootstrap = function(options){

		options = options || {};
		var input = $(this);

		//add some classes to decorate the input
		input.tinsel({
			state: options.state,
			placement: ['.tinsel', '.form-group', '.checkbox', '.radio', 'td'], //first of
			classSuccess: 'has-success',
			classFailure: 'has-error'
		});

		//show message on error, clear error message on success
		input.garland({
			state: !options.state,
			wrapper: '<span class="help-block"></span>',
			placement: ['.garland', '.form-group', 'td', '.checkbox', '.radio'], //first of
			message: options.message
		});
	};

}(window.jQuery);
