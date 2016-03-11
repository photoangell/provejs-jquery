(function() {
	var form = $('form');
	var cfg = {
		onSubmit: true,
		fields: {
			email: {
				//trigger: 'blur validate',
				validators: {
					proveRequired: {
						state: '#apple:checked', // true, false, selector string, callback
						message: 'Your email is required if you has a password.',
					},
					provePattern: {
						regex: '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,63}',
						message: 'Invalid email address.' //optional, passed to decorator
					}
				}
			},
			password: {
				validators: {
					proveRequired: {
						state: true, // true, false, selector string, callback
						message: 'Your password is required.', //optional, passed to decorator
					}
				}
			},
			file: {
				validators: {
					proveRequired: {
						state: true, // true, false, selector string, callback
						message: 'A file is required.', //optional, passed to decorator
					}
				}
			},
			fruit: {
				validators: {
					proveRequired: {
						state: true,
						message: 'A fruit is required.',
					}
				}
			}
		}
	};

	form.on('validated.field.prove', function(event, data){
		var input = $(event.target);
		input.bootstrap(data);
	});

	form.submit(function(event){
		event.preventDefault();

		var ok = form.data('prove').validate();
		//form.trigger('validate.form.prove');

		console.log('submit', ok);
	});

	//form plugins
	form.prove(cfg); //validate

})();