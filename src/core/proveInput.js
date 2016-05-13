!function ($) {
	"use strict";

	function clone(obj){
		return $.extend({}, obj);
	}

	function last(arr){
		return arr[arr.length - 1];
	}

	// pick validation result to return:
	// - the first result where result.valid === false
	// - or the last result in array
	function pickResult(results){
		var pick = clone(last(results));
		$.each(results, function(index, result){
			warnIncorrectResult(result);
			if (result.valid === false) pick = clone(result);
		});
		return pick;
	}

	function isPlugin (plugin){
		var exist = ($.isFunction($.fn[plugin]));
		if (!exist) console.error('Missing validator plugin "%s".', plugin);
		return exist;
	}

	function warnIncorrectResult(result){
		if (!('valid' in result)) console.warn('Missing `valid` property in validator ($.fn.' + result.validator + ') result.');
		if (!('field' in result)) console.warn('Missing `field` property in validator ($.fn.' + result.validator + ') result.');
		if (!('validator' in result)) console.warn('Missing `validator` property in validator ($.fn.' + result.validator + ') result.');
		if (!('message' in result)) console.warn('Missing `message` property in validator ($.fn.' + result.validator + ') result.');
	}

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
		var dfd = $.Deferred();
		var promises = [];
		var combined;

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
			dfd.resolve(undefined);
			return dfd;
		} else if (stateful && state && !dirty) {
			input.trigger('validated.input.prove', state); //clone here?
			dfd.resolve(state.valid);
			return dfd;
		} else {

			// loop validators
			$.each(validators, function(validator, config){

				config.field = field.name;
				config.validator = validator;

				// invoke validator plugin
				if (!isPlugin(validator)) return false;
				var promise = input[validator](config);
				promises.push(promise);

				// break loop at first (non-promise) result.valid === false
				return promise.valid;
			});

			// wait for the validator promises to resolve
			combined = $.when.apply($, promises);

			combined.done(function() {
				var results = $.makeArray(arguments);
				var result = pickResult(results);

				dfd.resolve(result.valid);

				//save state
				if (stateful) states[uuid] = result;

				// Trigger event indicating validation result
				input.trigger('validated.input.prove', result);
			});

			//handle promise failure
			combined.fail(function(obj) {
				dfd.reject(obj);
				//todo: input.trigger('status.input.prove', obj);
			});

			// handle promise progress
			combined.progress(function(obj){
				console.log('progress', obj);
				//todo: input.trigger('status.input.prove', obj);
			});

			return dfd;
		}
	};
}(window.jQuery);
