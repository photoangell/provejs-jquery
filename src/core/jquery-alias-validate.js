!function ($) {
	"use strict";

	$.fn.validate = function(options) {

		var el = $(this);
		var prove = el.data('prove');

		if (options && prove) {

			// alias prove plugin
			el.prove(options);
		} else if (prove) {

			// alias prove form validate
			return el.data('prove').validate();
		} else {

			//alias input trigger validation
			el.each(function(){
				var input = $(this);
				var prove = el.data('prove');
				var event = (prove)? 'validate.form.prove' : 'validate.field.prove';
				input.trigger(event);
			});
		}
		return this;
	};
}(window.jQuery);
