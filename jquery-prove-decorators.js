!function ($) {
	"use strict";

/*	$.fn.container = function(selector){
		var el = $(this);
		var container;

		if (typeof selector === 'string') {
			container = el.closest(selector);
		} else if ($.isArray(selector)){

			// test each array item until we find one
			// loop selectors in array of selectors until
			// we find the closests.
			for (var i = 0; i < selector.length; i++) {
				container = el.closest(selector[i]);
				if (container.length > 0) break;
			}
		} else if (typeof selector === 'function') {
			container = el.parents().filter(selector());
		} else {
			throw new Error('Invalid selector.')
		}

		console.groupCollapsed('Decorators.container()')
			console.log('el', el);
			console.log('selector', selector);
			console.log('container', container);
		console.groupEnd();

		return container;
	};*/


	$.fn.tinsel = function(options){

		var input = $(this);

		console.groupCollapsed('Decorators.tinsel()')
			console.log('input', input);
			console.log('state', options.state);
			console.log('placement', options.placement);
			console.log('classSuccess', options.classSuccess);
			console.log('classFailure', options.classFailure);
		console.groupEnd();

		function setup(input, state){
			var container = input.closest(options.placement);
			var klass = (state)? options.classSuccess : options.classFailure;
			container.addClass(klass);
		}

		function teardown(input){
			var container = input.closest(options.placement);
			container.removeClass(options.classFailure).removeClass(options.classSuccess);
		}

		teardown(input);
		if (options.state === true || options.state === false) {
			setup(input, options.state);
		}
	};

	$.fn.garland = function(options){

		var input = $(this);

		console.groupCollapsed('Decorators.garland()')
			console.log('input', input);
			console.log('state', options.state);
			console.log('wrapper', options.wrapper);
			console.log('placement', options.placement);
			console.log('message', options.message);
		console.groupEnd();

		function setup(input){
			var container = input.closest(options.placement);
			var garland = $(options.wrapper);
			garland.addClass('garland-wrapper');
			garland.text(options.message);
			container.append(garland);
		}

		function teardown(input){
			var container = input.closest(options.placement);
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