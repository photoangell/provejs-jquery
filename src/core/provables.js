!function ($) {
	"use strict";

	$.fn.provables = function(options) {

		var inputs = $();
		var form = $(this);
		var prove = form.data('prove');
		var opts = (options)? options : prove.options;
		var fields = opts.fields || {};

		// build selector
		$.each(fields, function(name, field){
			var found = form.find(field.selector);
			found.each(function(){
				this.field = name;
				inputs.push(this);
			});
		});
		return inputs;
	};
}(window.jQuery);
