!function ($) {
	"use strict";

	function inverse(valid){
		return (valid === undefined)? valid : !valid;
	}

	$.fn.bootstrap = function(options){

		options = options || {};
		var input = $(this);
		var parent1 = input.parent();
		var parent2 = parent1.parent();
		var parent3 = parent2.parent();

		// add success class on options.valid = true.
		// add failure class on options.valid = false.
		// remove success and failure classes on options.valid = undefined
		var tinsel = {
			valid: options.valid,
			classSuccess: 'has-success',
			classFailure: 'has-error'
		};

		// show message on options.valid = false.
		// remove message on options.valid = true.
		// remove message on options.valid = undefined.
		var garland = {
			valid: inverse(options.valid),
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
		form.on('validated.input.prove', function(event, data){

			console.log('data', event.target, data);

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

	$.fn.decorateErrors = function(errors){

		errors = errors || {};
		var form = $(this);

		$.each(errors, function(name, message){
			var selector = '[name="' + name + '"]';
			var data = {
				validator: 'server',
				field: name,
				valid: false,
				message: message
			};
			var input = form.find(selector);
			input.trigger('validated.input.prove', data);
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
				console.log('valid', options.valid);
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

		if (options.valid === true) {
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
				console.log('valid', options.valid);
				console.log('placement', options.placement);
				console.log('classSuccess', options.classSuccess);
				console.log('classFailure', options.classFailure);
			console.groupEnd();
		}

		function setup(container, valid){
			//var container = input.huntout(options.placement);
			var klass = (valid)? options.classSuccess : options.classFailure;
			container.addClass(klass);
		}

		function teardown(container){
			//var container = input.huntout(options.placement);
			container.removeClass(options.classFailure).removeClass(options.classSuccess);
		}

		teardown(input);
		if (options.valid === true || options.valid === false) {
			setup(input, options.valid);
		}
	};
}(window.jQuery);
