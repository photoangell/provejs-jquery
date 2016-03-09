!function ($) {
	"use strict";

	$.fn.tinsel = function(options){

		var input = $(this);

		console.groupCollapsed('Decorators.tinsel()')
			console.log('options', options);
		console.groupEnd();
	};

	$.fn.garland = function(options){

		var input = $(this);

		console.groupCollapsed('Decorators.garland()')
			console.log('options', options);
		console.groupEnd();

		function placement (selector){

			var placement;
			if (selector === 'string') {
				placement = input.closest(selector);
			} else if ($.isArray(selector)){
				placement = findClosest
			} else if (typeof selector === 'function') {

			}
			return placement;
		}

		function closest (selector){
			var closest = input.closest(selector);
			return (closest.length > 0)? closest : false;
		}

		function setupSuccess(){
			var target = placement(options.placement);
		}

		function setupFailure(){

		}

		function teardown(){

		}

		if (options.state === true) {
			highlight();
		} else if (options.state === false) {
			unhighlight();
		} else {
			teardown();
		}

	};

}(window.jQuery);