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
			'fruit[]': {
				validators: {
					proveRequired: {
						state: true,
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

	var events = $('#events');
	var all = [
		'setup.field.prove',
		'setup.form.prove',

		'validate.field.prove',
		'validated.field.prove',
		'validated.form.prove',

		'destroyed.field.prove',
		'destroyed.form.prove'
		].join(' ');

	form.on(all, function(event, data){
		data = data || {};
		events.prepend(eventRow(event, data));
	});

	form.on('click', '#optout', function () {
		$('#email').trigger('validate.field.prove');
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

	//private function
	function eventRow(event, data){

		var input = $(event.target);
		var ts = new Date(event.timeStamp);
		var tr = $('<tr><td></td><td></td><td></td><td></td><td></td></tr>');
		var td = tr.find('td');
		td.eq(0).text(event.type);
		td.eq(1).text(event.namespace);
		td.eq(2).text(input.attr('name') || 'form');
		td.eq(3).text(data.state);
		td.eq(4).text(ts.toISOString());
		return tr;
	}

})();