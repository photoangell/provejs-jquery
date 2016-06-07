!function ($) {
	"use strict";

	//return string of space seperated events used to detect change to the DOM element
	$.fn.proveEvents = function() {

		//var input = $();
		//console.log('input', input);

		// todo: dynamcally return different events string based on form input types

		return 'change keyup click blur';
	};

}(window.jQuery);
