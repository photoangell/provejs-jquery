(function() {
	var form = $('form');
	var cfg = {
		onSubmit: true,
		fields: {
			email: {
				//trigger: 'blur validate',
				validators: {
					proveRequired: {
						state: '#optout:checked', // true, false, selector string, callback
						message: 'Your email is required unless you opt out.',
					},
					provePattern: {
						regex: '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,63}',
						message: 'Invalid email address.' //optional, passed to decorator
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

	var events = $('#events');
	var all = 'validated.field.prove validate.field.prove setup.field.prove destroy.field.prove'

	form.on(all, function(event, data){
		var input = $(event.target);
		var ts = new Date(event.timeStamp);
		events.append('<div>' + event.type + '.' + event.namespace + ': ' + input.attr('name') + ' ' + ts.toISOString() +'</div>');
	});

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

	form.on()

	//form plugins
	form.prove(cfg); //validate

})();