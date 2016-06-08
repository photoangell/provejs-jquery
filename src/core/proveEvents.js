!function ($) {
	'use strict';

	//return string of space seperated events used to detect change to the DOM element
	$.fn.proveEvents = function() {

		var input = $(this);
		var type = input.attr('type');

		if (type === 'text') {
			return 'change keyup blur';
		} else if (type === 'checkbox') {
			return 'change click blur';
		} else if (type === 'file') {
			return 'change blur';
		} else if (type === 'email') {
			return 'change keyup blur';
		} else if (type === 'password') {
			return 'change keyup blur';
		} else if (type === 'hidden') {
			return 'change';
		} else if (type === 'radio') {
			return 'change click blur';
		} else if (type === 'number') {
			return 'change keyup blur';
		} else if (type === 'range') {
			return 'change keyup click blur';
		} else if (type === 'button') {
			return 'change click blur';
		} else if (type === 'tel') {
			return 'change keyup blur';
		} else if (type === 'url') {
			return 'change keyup blur';
		} else if (type === 'date') {
			return 'change keyup blur';
		} else if (type === 'datetime-local') {
			return 'change keyup blur';
		} else if (type === 'month') {
			return 'change keyup blur';
		} else if (type === 'time') {
			return 'change keyup blur';
		} else if (type === 'week') {
			return 'change keyup blur';
		} else if (input.is('select')) {
			return 'change blur';
		} else if (input.is('textarea')) {
			return 'change keyup blur';
		} else {
			return 'change keyup click blur';
		}
	};

}(window.jQuery);
