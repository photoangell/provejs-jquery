(function() {
	var form = $('form');
	var email = $('#email');
	var cfg = {
		fields: {
			email: {
				//triggers: [{events: 'blur change', target: '#optout'}],
				validators: {
					proveRequired: {
						debug: false,
						enabled: '#optout:not(:checked)', // true, false, selector string, callback
						message: 'Your email is required unless you opt out.',
					},
					provePattern: {
						debug: false,
						regex: '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,63}',
						message: 'Invalid email address.' //optional, passed to decorator
					}
				}
			},
			file: {
				validators: {
					proveRequired: {
						message: 'A file is required.', //optional, passed to decorator
					}
				}
			},
			'fruit[]': {
				validators: {
					proveRequired: {
						message: 'A fruit is required.',
					}
				}
			},
			dynamicField: {
				validators: {
					proveRequired: {
						state: true,
						message: 'This input does not exist, but might sometime in the future. When it does exist prove will validate it.',
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