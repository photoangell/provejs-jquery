!function ($) {
	"use strict";

	function inverse(state){
		return (state === undefined)? state : !state;
	}

	$.fn.bootstrap = function(options){

		console.log('bootstrap()', options);

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

!function ($) {
	"use strict";

	$.fn.decorate = function(framework){

		framework = framework || 'bootstrap';
		var form = $(this);

		// decorate the form
		form.on('validated.field.prove', function(event, data){
			var input = $(event.target);
			if (framework === 'bootstrap') {
				input.bootstrap(data);
			} else {
				console.warn('Unsupported decorator framework. Please make a pull request.');
			}
		});
	};

}(window.jQuery);

!function ($) {
	"use strict";

	$.fn.garland = function(options){

		options = options || {};
		var input = $(this);

		if (options.debug){
			console.groupCollapsed('Decorators.garland()');
				console.log('input', input);
				console.log('state', options.state);
				console.log('wrapper', options.wrapper);
				console.log('placement', options.placement);
				console.log('message', options.message);
			console.groupEnd();
		}

		function setup(container){
			var garland = $(options.wrapper);
			garland.addClass('garland-wrapper');
			garland.text(options.message);
			container.append(garland);
		}

		function teardown(container){
			container.find('.garland-wrapper').remove();
		}

		if (options.state === true) {
			teardown(input);
			setup(input, options);
		} else {
			teardown(input);
		}
	};
}(window.jQuery);

!function ($) {
	"use strict";

	$.fn.tinsel = function(options){

		options = options || {};
		var input = $(this);

		if (options.debug){
			console.groupCollapsed('Decorators.tinsel()');
				console.log('input', input);
				console.log('state', options.state);
				console.log('placement', options.placement);
				console.log('classSuccess', options.classSuccess);
				console.log('classFailure', options.classFailure);
			console.groupEnd();
		}

		function setup(container, state){
			//var container = input.huntout(options.placement);
			var klass = (state)? options.classSuccess : options.classFailure;
			container.addClass(klass);
		}

		function teardown(container){
			//var container = input.huntout(options.placement);
			container.removeClass(options.classFailure).removeClass(options.classSuccess);
		}

		teardown(input);
		if (options.state === true || options.state === false) {
			setup(input, options.state);
		}
	};
}(window.jQuery);
