!function($) {
	'use strict';

	$.fn.dataAttribute = function(options) {

		options = options || {};
		var input = $(this);
		var el1;
		var prefixes = options.prefixes || {};
		var message = options.message;

		if (options.status === 'progress') return;

		// manage feedback
		if (options.status === 'validating') {
			input.feedback({state: true});
		} else if (options.status === 'validated') {
			input.feedback({state: false});
		}

		if (options.status === 'validating') return;

		//placement
		el1 = $('['+options.attribute+'="'+options.field+'"]');

		//prefix message
		if (options.message) {
			if (prefixes.success && options.validation === 'success') message = prefixes.success + message;
			if (prefixes.danger && options.validation === 'danger') message = prefixes.danger + message;
			if (prefixes.warning && options.validation === 'warning') message = prefixes.warning + message;
			if (prefixes.reset && options.validation === 'reset') message = prefixes.reset + message;
		}

		// display message.
		el1.texty({
			wrapper: '<span></span>',
			message: message
		});

		// add success class on options.validation = 'success'.
		// add failure class on options.validation = 'danger'.
		// remove success and failure classes on options.validation = 'reset'
		el1.classy({
			validation: options.validation,
			classSuccess: options.classSuccess || 'has-success',
			classFailure: options.classFailure || 'has-error',
			classWarning: options.classWarning || 'has-warning'
		});
	};
}(window.jQuery);
