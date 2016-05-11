!function ($) {
	"use strict";

	function clone(obj){
		return $.extend({}, obj);
	}

	function last(arr){
		return arr[arr.length - 1];
	}

	// return either:
	// - the first result where result.valid === false or
	// - the last result
	function pickResult(results){
		var pick = clone(last(results));
		$.each(results, function(index, result){
			if (result.valid === false) pick = clone(result);
		});
		return pick;
	}

/*	function isPromise (obj) {
		return $.isFunction(obj.done);
	}*/

	function isPlugin (plugin){
		var exist = ($.isFunction($.fn[plugin]));
		if (!exist) console.error('Missing validator plugin "%s".', plugin);
		return exist;
	}

/*	function warnIncorrectResult(result, validator){
		if (!('valid' in result)) console.warn('Missing `valid` property in validator ($.fn.' + validator + ') result.');
		if (!('field' in result)) console.warn('Missing `field` property in validator ($.fn.' + validator + ') result.');
		if (!('validator' in result)) console.warn('Missing `validator` property in validator ($.fn.' + validator + ') result.');
		if (!('message' in result)) console.warn('Missing `message` property in validator ($.fn.' + validator + ') result.');
	}*/

	// validate a single input
	$.fn.proveInput = function(field, states) {

		var validators = field.validators || {};
		var input = $(this);
		var enabled = input.booleanator(field.enabled);
		var stateful = input.booleanator(field.stateful);
		var dirty = input.dirty(field.group);
		var uuid = input.uuid();
		var state = states[uuid];
		var result = {
			field: field.name,
			validator: undefined,
			valid: undefined,
			message: undefined
		};
		var combined = $.Deferred();
		var promises = [];

		if (field.debug){
			console.groupCollapsed('proveInput()', field.name);
			console.log('enabled', enabled);
			console.log('state', state);
			console.log('dirty', dirty);
			console.groupEnd();
		}

		// return early
		if (!enabled) {
			input.trigger('validated.input.prove', result);
			states[uuid] = false;
			//return undefined;
			combined.resolve(undefined);
			return combined;
		} else if (stateful && state && !dirty) {
			input.trigger('validated.input.prove', state); //clone here?
			//return state.valid;
			combined.resolve(state.valid);
			return combined;
		} else {

			// loop validators

			// if none of the validator results are promises:
			// - return the result of the first false result

			// If one of the validators results is a promise:
			// - push all validator results into promises array
			// - combined = $.when.apply($, promises);
			// - results = $.makeArray(arguments);
			// - isValid = evaluate(results);
			// - combined.resolve(isValid);
			$.each(validators, function(validator, config){

				config.field = field.name;
				config.validator = validator;

				// invoke validator plugin
				if (!isPlugin(validator)) return false;
				//result = input[validator](config);
				var promise = input[validator](config);
				promises.push(promise);

				//warnIncorrectResult(result, validator);

				// break loop at first non-promise result.valid === false
				//return result.valid;
				return promise.valid;
			});

			// evaluate combined promises
			combined = $.when.apply($, promises);

			combined.done(function() {
				var results = $.makeArray(arguments);
				var result = pickResult(results);

				//save state
				if (stateful) states[uuid] = result;

				// Trigger event indicating validation result
				input.trigger('validated.input.prove', result);
			});

			return combined;
		}
	};
}(window.jQuery);
