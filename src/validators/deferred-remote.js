!function($) {
	'use strict';

	$.fn.proveDeferredRemote = function(options) {

		var input = $(this);
		var value = input.vals();
		var hasValue = input.hasValue();

		var enabled = $('body').booleanator(options.enabled);
		var url;

		var dfd = $.Deferred();
		var result = {
			field: options.field,
			validator: options.validator,
			status: 'validated',
			message: options.message
		};

		if (!enabled) {
			result.validation = 'reset';
			dfd.resolve(result);
		} else if (!hasValue) {
			// All validators are optional except for `required` validator.
			result.validation = 'success';
			dfd.resolve(result);
		} else {
			url = options.url(value);
			$.get(url)
				.done(function() {
					result.validation = 'success';
					dfd.resolve(result);
				})
				.fail(function(xhr) {
					result.validation = 'danger';
					if (!options.message) result.message = xhr.responseText;
					dfd.resolve(result);
				});
		}

		if (options.debug) {
			console.groupCollapsed('Validator.proveDeferredRemote()', options.field);
				console.log('options', options);
				console.log('input', input);
				console.log('value', value);
				console.log('enabled', enabled);
				console.log('url', url);
				console.log('validation', result.validation);
			console.groupEnd();
		}

		return dfd;
	};
}(window.jQuery);
