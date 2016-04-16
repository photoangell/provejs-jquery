!function ($) {
	"use strict";

	// Called at setup and while validating entire form.
	$.fn.provables = function(fields, filter) {

		var inputs = $();
		var form = $(this);
		fields = fields || {};

		// build selector
		$.each(fields, function(name, field){

			var found = form.find(field.selector);
			var filtered = (filter)? found.filterables(field) : found;

			filtered.each(function(){
				this.field = name;
				inputs.push(this);
			});
		});
		return inputs;
	};

	// Any field for which you might have multiple inputs of the same name (checkbox, radio, name="fields[]")
	// for which you want to be validated individually, you can set the field.multiple = true.
	$.fn.filterables = function(field){
		var found = $(this);
		var isRadio = found.is('[type="radio"]');
		var hasChecked = (found.filter(':checked').length > 0);

		var filtered = found.filter(function(index, element){

			//only filter a radios if atleast one is selected and then filter to the selected radio
			if (isRadio && hasChecked && !field.multiple){
				return $(element).is(':checked');
			} else {
				return true;
			}
		});

		return filtered;
	};

}(window.jQuery);
