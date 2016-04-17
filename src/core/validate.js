!function ($) {
	"use strict";

	$.fn.validate = function() {

		$(this).each(function(){
			var el = $(this);
			var isForm = el.is(':prove-form');
			var isInput = el.is(':prove-input');

			// We trigger events here because the event
			// handlers bound to the form already have the
			// field data bound to the event handlers. These
			// event handlers will call the $.fn.proveForm()
			// or $.fn.proveInput() with the correct field data.
			if (isForm) {
				el.trigger('validate.form.prove');
			} else if (isInput) {
				el.trigger('validate.input.prove');
			} else {
				// If the el is a dynamically inserted element then
				// it will be validated. Otherwise, prove defaults
				// to validating the entire form. So yes, all of the
				// above logic is not required, but it made me feel
				// good writing it. So I left it as was. Never know
				// what we might break in the future.
				el.trigger('validate.input.prove');
			}
		});
		return this;
	};
}(window.jQuery);
