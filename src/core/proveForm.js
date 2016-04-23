!function ($) {
	"use strict";

	//isProved can be true, false, undefined.
	function toggleState(isValid, isProved){
		if (isProved === false) {
			isValid = false;
		} else {
			if (isProved === true && isValid !== false) isValid = true;
		}
		return isValid;
	}

	$.fn.proveForm = function() {

		var form = $(this);
		var prove = form.data('prove');
		var states = prove.states;
		var fields = prove.options.fields;
		var filter = true;
		var valid = true;

		// Loop inputs and validate them. There may be multiple
		// identical inputs (ie radios) for which we do not want to
		// validate twice. Therefore, $.fn.provables() will filter
		// these multiples for us unless less field.multiple is true.
		form.provables(fields, filter).each(function(){

			var input = $(this);
			var field = fields[this.field];
			var isProved = input.proveInput(field, states);

			valid = toggleState(valid, isProved);
		});

		// Trigger event indicating validation result
		form.trigger('validated.form.prove', {
			valid: valid
		});

	};
}(window.jQuery);
