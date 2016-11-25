!function($) {
	'use strict';

	$.fn.proveDeferredRemote = function(options) {

		var input = $(this);
		var value = input.vals();
		var hasValue = $.hasValue(value);

		var enabled = $('body').booleanator(options.enabled);
		var url;
		var method = options.method || 'GET';
		var data;

		var dfd = $.Deferred();
		var result = {
			field: options.field,
			validator: options.validator,
			status: 'validated',
			message: undefined
		};

		if (!enabled) {
			result.validation = 'reset';
			dfd.resolve(result);
		} else if (!hasValue) {
			// All validators are optional except for `required` validator.
			result.validation = 'success';
			dfd.resolve(result);
		} else {
			url = ($.isFunction(options.url))? options.url(value) : options.url;
			data = ($.isFunction(options.data))? options.data(value) : options.data;

			$.ajax({
				url: url,
				method: method,
				data: data
			})
			.done(function() {
				result.validation = 'success';
				dfd.resolve(result);
			})
			.fail(function(xhr) {
				result.validation = 'danger';
				if (options.message) {
					result.message = options.message;
				} else {
					result.message = xhr.responseText;
				}
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
				console.log('method', method);
				console.log('data', data);
				console.log('validation', result.validation);
			console.groupEnd();
		}

		return dfd;
	};
}(window.jQuery);
