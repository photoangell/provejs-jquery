!function ($) {
	"use strict";

	$.fn.clear = function() {
		return this.each(function() {

			var type = this.type;
			var tag = this.tagName.toLowerCase();

			if (type == 'text' || type == 'password' || tag == 'textarea') {
				this.value = '';
			} else if (type == 'checkbox' || type == 'radio') {
				this.checked = false;
			} else if (tag == 'select') {
				this.selectedIndex = -1;
			} else {
				return $(':input',this).clear();
			}
			$(this).trigger('status.input.prove', {
				status: 'validated',
				validation: 'reset'
			});
		});
	};
}(window.jQuery);
