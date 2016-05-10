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

	function evaluate(results){
		var isProved = undefined;
		$.each(results, function(index, result){
			isProved = toggleState(result, isProved);
		});
		return isProved;
	}

	$.fn.proveForm = function() {

		var form = $(this);
		var prove = form.data('prove');
		var states = prove.states;
		var fields = prove.options.fields;
		var filter = true;
		//var valid = true;
		//var master = $.Deferred();
		var promises = [];
		var combined;

		// Loop inputs and validate them. There may be multiple
		// identical inputs (ie radios) for which we do not want to
		// validate twice. Therefore, $.fn.provables() will filter
		// these multiples for us unless less field.multiple is true.
		form.provables(fields, filter).each(function(){

			var input = $(this);
			var field = fields[this.field];
			//var isProved = input.proveInput(field, states);
			var promise = input.proveInput(field, states);
			promises.push(promise);

			//valid = toggleState(valid, isProved);
		});

		// evaluate combined promises
		combined = $.when.apply($, promises);

		combined.done(function() {
			var results = $.makeArray(arguments);
			var valid = evaluate(results);

			// Trigger event indicating validation result
			form.trigger('validated.form.prove', {
				valid: valid
			});
		});
		combined.fail(function() {
			console.log("async code failed so validation failed");
		});
		combined.progress(function(){
			console.log('progress');
		});

		return combined;
	};
}(window.jQuery);
