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
		var parent1, parent2, parent3, group;

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
			parent1.garland(garland);
			parent1.tinsel(tinsel);
		} else if (parent1.is('[class^="col-"]')){
			parent1.garland(garland);
			parent2.tinsel(tinsel);
		} else if (parent1.is('td')) {
			parent1.garland(garland);
			parent1.tinsel(tinsel);
		} else if (parent1.is('.checkbox') || parent1.is('.radio')){
			parent2.garland(garland);
			parent2.tinsel(tinsel);
		} else if (parent1.is('.input-group')){
			parent2.garland(garland);
			if (parent2.is('[class^="col-"]')) {
				parent3.tinsel(tinsel);
			} else {
				parent2.tinsel(tinsel);
			}
		} else if (parent3.is('[class^="col-"]')){
			parent3.garland(garland);
			input.closest('.form-group').tinsel(tinsel);
		} else {
			group = input.closest('.form-group');
			if (group.length) {
				input.closest('.form-group').garland(garland);
				input.closest('.form-group').tinsel(tinsel);
			} else {
				parent3.garland(garland);
				parent3.tinsel(tinsel);
			}
		}
	};
}(window.jQuery);
