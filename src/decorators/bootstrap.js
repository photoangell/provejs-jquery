!function ($) {
	"use strict";

	function inverse(valid){
		switch (valid) {
			case 'success': return 'danger';
			case 'warning': return 'danger';
			case 'danger': return 'success';
			case 'reset': return 'reset';
		}
		return (valid === undefined)? valid : !valid;
	}

	$.fn.bootstrap = function(options){

		options = options || {};
		var input = $(this);
		var parent1, parent2, parent3, parentContainer, errorContainer, group;

		if (options.status === 'progress') return;

		// manage feedback
		if (options.status === 'validating') {
			input.feedback({state: true});
		} else if (options.status === 'validated'){
			input.feedback({state: false});
		}

		if (options.status === 'validating') return;

		// add success class on options.validation = 'success'.
		// add failure class on options.validation = 'danger'.
		// remove success and failure classes on options.validation = 'reset'
		var tinsel = {
			validation: options.validation,
			classSuccess: 'has-success',
			classFailure: 'has-error',
			classWarning: 'has-warning'
		};

		// show message on options.validation = 'danger'.
		// remove message on options.valid = 'success'.
		// remove message on options.valid = 'reset'.
		var garland = {
			validation: inverse(options.validation),
			wrapper: '<span class="help-block"></span>',
			message: options.message
		};

		parent1 = input.parent();
		parent2 = parent1.parent();
		parent3 = parent2.parent();

		//placement
		if (parent1.is('.form-group')){
			errorContainer = parent1;
			parentContainer = parent1;
		} else if (parent1.is('[class^="col-"]')){
			errorContainer = parent1;
			parentContainer = parent2;
		} else if (parent1.is('td')) {
			errorContainer = parent1;
			parentContainer = parent1;
		} else if (parent1.is('.checkbox') || parent1.is('.radio')){
			errorContainer = parent2;
			parentContainer = parent2;
		} else if (parent1.is('.input-group')){
			errorContainer = parent2;
			if (parent2.is('[class^="col-"]')) {
				parentContainer = parent3;
			} else {
				parentContainer = parent2;
			}
		} else if (parent3.is('[class^="col-"]')){
			errorContainer = parent3;
			parentContainer = input.closest('.form-group');
		} else {
			group = input.closest('.form-group');
			if (group.length) {
				errorContainer = input.closest('.form-group');
				parentContainer = input.closest('.form-group');
			} else {
				errorContainer = parent3;
				parentContainer = parent3;
			}
		}

		if (options.parentContainer) parentContainer = $(options.parentContainer);
		if (options.errorContainer) errorContainer = $(options.errorContainer);

		errorContainer.garland(garland);
		parentContainer.tinsel(tinsel);
	};
}(window.jQuery);
