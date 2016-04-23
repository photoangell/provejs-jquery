!function ($) {
	"use strict";

	function isPlugin (plugin){
		var exist = ($.isFunction($.fn[plugin]));
		if (!exist) console.error('Missing validator plugin "%s".', plugin);
		return exist;
	}

	function noChange(state, value){
		if (!state) return false;
		return (state.value === value);
	}

	function warnIncorrectResult(result, validator){
		if (!('valid' in result)) console.warn('Missing `valid` property in validator ($.fn.' + validator + ') result.');
		if (!('field' in result)) console.warn('Missing `field` property in validator ($.fn.' + validator + ') result.');
		if (!('validator' in result)) console.warn('Missing `validator` property in validator ($.fn.' + validator + ') result.');
		if (!('message' in result)) console.warn('Missing `message` property in validator ($.fn.' + validator + ') result.');
	}

	// validate a single input
	//todo: warn if result is not an object with the required properties
	$.fn.proveInput = function(field, states) {

		//var data;
		var result;
		var validators = field.validators || {};
		var input = $(this);
		var isEnabled = input.booleanator(field.enabled);
		var uuid = input.uuid();
		var state = states[uuid];
		var value = input.vals();
		var isStateful = (field.stateful !== false);
		var noChanged = noChange(state, value);

		console.log('proveInput()', field.name);

		// return early
		if (!isEnabled) {
			// trigger event
			input.trigger('validated.input.prove', result);
			return;
		} else if (isStateful && noChanged) {
			input.trigger('validated.input.prove', state); //clone here?
			return state.valid;
		}

		// loop validators
		$.each(validators, function(validator, config){

			config.field = field.name;

			// invoke validator plugin
			if (!isPlugin(validator)) return false;
			result = input[validator](config);

			warnIncorrectResult(result, validator);

			// break loop
			return result.valid;
		});

		console.log('result', value, result.valid);

		//save state
		states[uuid] = result;

		//trigger event
		input.trigger('validated.input.prove', result);

		return result.valid;

	};
}(window.jQuery);
