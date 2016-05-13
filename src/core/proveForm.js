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
		var promises = [];
		var dfd = $.Deferred();
		var combined;

		// Loop inputs and validate them. There may be multiple
		// identical inputs (ie radios) for which we do not want to
		// validate twice. Therefore, $.fn.provables() will filter
		// these multiples for us unless less field.multiple is true.
		form.provables(fields, filter).each(function(){
			var input = $(this);
			var field = fields[this.field];
			var promise = input.proveInput(field, states);
			promises.push(promise);
		});

		// wait for all field promises to resolve
		combined = $.when.apply($, promises);

		combined.done(function() {
			var results = $.makeArray(arguments);
			var valid = evaluate(results);

			if (prove.debug) {
				console.groupCollapsed('Proveform.done()');
				console.log('results', results);
				console.log('valid', valid);
				console.groupEnd();
			}

			// Trigger event indicating validation result
			form.trigger('validated.form.prove', {
				valid: valid
			});

			dfd.resolve(valid);
		});
		combined.fail(function(obj) {
			dfd.reject(obj);
		});
		combined.progress(function(){
			console.log('progress');
		});

		return dfd;
	};
}(window.jQuery);
