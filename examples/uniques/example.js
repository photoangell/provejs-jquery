(function() {
	var form = $('form');
	var email = $('[name="emails[]"]');
	var cfg = {
		fields: {
			'emails[]': {
				trigger: 'keyup',
				validators: {
/*					provePattern: {
						debug: false,
						regex: '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,63}',
						message: 'Invalid email address.' //optional, passed to decorator
					},*/
					proveUnique: {
						debug: true,
						message: 'Not unique value.' //optional, passed to decorator
					}
				}
			}
		}
	};

	form.on('click', '#optout', function () {
		email.validate(); // or email.trigger('validate.field.prove');
	});

	//form plugins
	form.prove(cfg);
	form.decorate('bootstrap');

})();