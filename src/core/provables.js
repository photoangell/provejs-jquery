!function ($) {
	"use strict";

	$.fn.provables = function() {

		var inputs = $();
		var form = $(this);
		var prove = form.data('prove');
		var options = prove.options || {};
		var fields = options.fields || {};

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
