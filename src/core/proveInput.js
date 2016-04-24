!function ($) {
	"use strict";

	function isPlugin (plugin){
		var exist = ($.isFunction($.fn[plugin]));
		if (!exist) console.error('Missing validator plugin "%s".', plugin);
		return exist;
	}

	function warnIncorrectResult(result, validator){
		if (!('valid' in result)) console.warn('Missing `valid` property in validator ($.fn.' + validator + ') result.');
		if (!('field' in result)) console.warn('Missing `field` property in validator ($.fn.' + validator + ') result.');
		if (!('validator' in result)) console.warn('Missing `validator` property in validator ($.fn.' + validator + ') result.');
		if (!('message' in result)) console.warn('Missing `message` property in validator ($.fn.' + validator + ') result.');
	}

	// validate a single input
	$.fn.proveInput = function(field, states) {

		//var data;
		var result;
		var validators = field.validators || {};
		var input = $(this);
		var enabled = input.booleanator(field.enabled);
		var stateful = input.booleanator(field.stateful);
		var dirty = input.dirty(field);
		var uuid = input.uuid();
		var state = states[uuid];

		console.groupCollapsed('proveInput()', field.name);
		console.log('state', state);
		console.log('dirty', dirty);
		console.groupEnd();

		// return early
		if (!enabled) {
			// trigger event
			input.trigger('validated.input.prove', result);
			return;
		} else if (stateful && state && !dirty) {
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

		//console.log('result', value, result.valid);

		//save state
		if (stateful) states[uuid] = result;

		//trigger event
		input.trigger('validated.input.prove', result);

		return result.valid;
	};
}(window.jQuery);
