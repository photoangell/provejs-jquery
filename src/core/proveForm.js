!function ($) {
	"use strict";

	//isProved can be true, false, undefined.
	function toggleState(state, isProved){
		if (isProved === false) {
			state = false;
		} else {
			if (isProved === true && state !== false) state = true;
		}
		return state;
	}

	$.fn.proveForm = function() {

		var form = $(this);
		var prove = form.data('prove');
		var states = prove.states;
		var fields = prove.options.fields;
		var state = true;
		var filter = true;

		// Loop inputs and validate them. There may be multiple
		// identical inputs (ie radios) for which we do not want to
		// validate twice. Therefore, $.fn.provables() will filter
		// these multiples for us unless less field.multiple is true.
		form.provables(fields, filter).each(function(){

			var input = $(this);
			var field = fields[this.field];
			var isProved = input.proveInput(field, states);

			state = toggleState(state, isProved);
		});

		// Trigger event indicating validation state.
		// todo: perhaps, return validators (state and messages) so one could
		// display messages at the top of the form. However, that could be the
		// responsibility of a decorator to aggregate the prove error events.
		form.trigger('validated.form.prove', {
			state: state
		});

	};
}(window.jQuery);
