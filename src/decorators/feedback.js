(function($) {

	$.fn.feedback = function (options) {

		options = options || {};

		var input = $(this);
		var klass = options.classFeedback || 'has-default';
		var group = input.closest('.form-group');
		var feedback = input.parent().find('.form-control-feedback');

		//toggle
		if (feedback.length) {
			feedback.remove();
			group.removeClass(klass);
			group.removeClass('has-feedback');
		} else {
			group.addClass(klass);
			group.addClass('has-feedback');
			input.parent().append('<span class="form-control-feedback fa fa-spinner fa-spin"></span>');
		}
	};
})(window.jQuery);
