!function ($) {
	"use strict";

	$.fn.isMultiple = function(){

		var input = $(this);
		var name = input.attr('name');
		var last = name.charAt(name.length - 1);
		return (last === ']');
	};
}(window.jQuery);
