(function($) {

	$.fn.feedback = function (options) {

		options = options || {};

		var input = $(this);
		var klass = options.classFeedback || 'has-default';
		var group, feedback;

		if (!input.is('input')) return;

		group = input.closest('.form-group');
		feedback = input.parent().find('.form-control-feedback');

		//toggle
		if (options.state === false) {
			feedback.remove();
			group.removeClass(klass);
			group.removeClass('has-feedback');
		} else if (options.state === true){
			group.addClass(klass);
			group.addClass('has-feedback');
			input.parent().append('<span class="form-control-feedback fa fa-spinner fa-spin"></span>');
		}
	};
})(window.jQuery);
