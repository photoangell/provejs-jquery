!function ($) {
	"use strict";

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
		var fields = form.data('prove').options.fields;
		var isValid = true;
		var completed = [];

		//loop inputs
		form.provables().each(function(){
			var isProved;
			var input = $(this);
			var field = fields[this.field];
			var isCompleted = ($.inArray(this.field, completed) > -1);
			var isMultiple = field.multiple;

			if (!field) {
				//skip inputs with no field config
			} else if (!isCompleted) {
				isProved = input.proveInput(field);
			} else if (isMultiple) {
				// Any field for which you might have multiple inputs of the same name (checkbox, radio, name="fields[]")
				// for which you want to be validated individually, you can set the field.multiple = true.
				isProved = input.proveInput(field);
			}
			isValid = toggleState(isValid, isProved);
			completed.push(field.name);
		});

		// trigger event indicating validation state
		// todo: perhaps, return validators (state and messages) so one could
		// display messages at the top of the form. However, that could be the
		// responsibility of a decorator to aggregate the prove error events.
		form.trigger('validated.form.prove', {
			state: isValid
		});

	};
}(window.jQuery);
