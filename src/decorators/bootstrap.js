!function ($) {
	"use strict";

	$.fn.bootstrap = function(options){

		options = options || {};
		var input = $(this);
		var parent1, parent2, parent3, el1, el2, group, garland, tinsel;
		var prefixes = options.prefixes || {};

		if (options.status === 'progress') return;

		// manage feedback
		if (options.status === 'validating') {
			input.feedback({state: true});
		} else if (options.status === 'validated'){
			input.feedback({state: false});
		}

		if (options.status === 'validating') return;

		parent1 = input.parent();
		parent2 = parent1.parent();
		parent3 = parent2.parent();
		garland = input.closest('.garland');
		tinsel = input.closest('.tinsel');

		//placement
		if (garland.length && tinsel.length) {
			el1 = garland;
			el2 = tinsel;
		} else if (parent1.hasClass('form-group')){
			el1 = parent1;
			el2 = parent1;
		} else if (parent1.is('[class^="col-"]')){
			el1 = parent1;
			el2 = parent2;
		} else if (parent1.is('td')) {
			el1 = parent1;
			el2 = parent1;
		} else if (parent1.hasClass('checkbox') || parent1.hasClass('radio')){
			el1 = parent2;
			el2 = parent2;
		} else if (parent1.hasClass('input-group')){
			el1 = parent2;
			if (parent2.is('[class^="col-"]')) {
				el2 = parent3;
			} else {
				el2 = parent2;
			}
		} else if (parent3.is('[class^="col-"]')){
			el1 = parent3;
			el2 = input.closest('.form-group');
		} else {
			group = input.closest('.form-group');
			if (group.length) {
				el1 = input.closest('.form-group');
				el2 = input.closest('.form-group');
			} else {
				el1 = parent3;
				el2 = parent3;
			}
		}

		//prefix message
		if (options.message) {
			if (prefixes.success) options.message = prefixes.success + options.message;
			if (prefixes.danger) options.message = prefixes.danger + options.message;
			if (prefixes.warning) options.message = prefixes.warning + options.message;
			if (prefixes.reset) options.message = prefixes.reset + options.message;
		}

		// display message.
		el1.garland({
			wrapper: '<span class="help-block"></span>',
			message: options.message
		});

		// add success class on options.validation = 'success'.
		// add failure class on options.validation = 'danger'.
		// remove success and failure classes on options.validation = 'reset'
		el2.tinsel({
			validation: options.validation,
			classSuccess: 'has-success',
			classFailure: 'has-error',
			classWarning: 'has-warning'
		});
	};
}(window.jQuery);
