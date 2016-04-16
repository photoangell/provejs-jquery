!function ($) {
	"use strict";

	function inverse(state){
		return (state === undefined)? state : !state;
	}

	$.fn.bootstrap = function(options){

		options = options || {};
		var input = $(this);
		var parent1 = input.parent();
		var parent2 = parent1.parent();
		var parent3 = parent2.parent();

		// add success class on options.state = true.
		// add failure class on options.state = false.
		// remove success and failure classes on options.state = undefined
		var tinsel = {
			state: options.state,
			classSuccess: 'has-success',
			classFailure: 'has-error'
		};

		// show message on options.state = false.
		// remove message on options.state = true.
		// remove message on options.state = undefined.
		var garland = {
			state: inverse(options.state),
			wrapper: '<span class="help-block"></span>',
			message: options.message
		};

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
		} else {
			parent3.garland(garland);
			parent3.tinsel(tinsel);
		}
	};
}(window.jQuery);
