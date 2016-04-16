!function ($) {
	"use strict";

	$.fn.hasValue = function(){

		var input = $(this);
		var value = input.vals();
		var isString, isArray, hasValue;

		isString = (typeof value === 'string');
		isArray = $.isArray(value);
		value = (isString)? $.trim(value) : value;
		hasValue = ((isString && !!value.length) || (isArray && !!value.length && !!value[0].length));
		return hasValue;
	};
}(window.jQuery);
