!function ($) {
	"use strict";

	function isPlugin (plugin){
		var exist = ($.isFunction($.fn[plugin]));
		if (!exist) console.error('Missing validator plugin "%s".', plugin);
		return exist;
	}

	function clone(obj){
		return $.extend({}, obj);
	}

	$.fn.proveInput = function(field) {

		var data, isValid;
		var validators = field.validators || {};
		var input = $(this);
		var isEnabled = input.booleanator(field.enabled);

		// return early if nothing to do
		if (!isEnabled) {
			// trigger event indicating validation state
			input.trigger('validated.field.prove', data);
			return isValid;
		}

		// loop each validator
		$.each(validators, function(validator, config){

			config.field = field.name;

			// invoke validator plugin
			if (!isPlugin(validator)) return false;
			var result = input[validator](config);

			//todo: warn if result is not an object with the required properties

			// Compose data the decorator will be interested in
			data = {
				field: result.field,
				state: result.state,
				message: config.message,
				validator: {
					name: result.validator,
					config: clone(config)
				}
			};

			isValid = result.state;

			// return of false to break loop
			return isValid;
		});

		//trigger event indicating validation state
		input.trigger('validated.field.prove', data);

		return isValid;

	};
}(window.jQuery);
