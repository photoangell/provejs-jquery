!function ($) {
	"use strict";

	function inverse(state){
		return (state === undefined)? state : !state;
	}

	$.fn.bootstrap = function(options){

		options = options || {};
		var input = $(this);

		// add success class on options.state = true.
		// add failure class on options.state = false.
		// remove success and failure classes on options.state = undefined
		input.tinsel({
			state: options.state,
			placement: ['.tinsel', '.form-group', '.checkbox', '.radio', 'td'], //first of
			classSuccess: 'has-success',
			classFailure: 'has-error'
		});

		// show message on options.state = false.
		// remove message on options.state = true.
		// remove message on options.state = undefined.
		input.garland({
			state: inverse(options.state),
			wrapper: '<span class="help-block"></span>',
			placement: ['.garland', '.form-group', 'td', '.checkbox', '.radio'], //first of
			message: options.message
		});
	};

}(window.jQuery);
