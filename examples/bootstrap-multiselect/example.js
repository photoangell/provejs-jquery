(function() {

	//setup
	var form = $('form');
	var select = form.find('select');
	var cfg = {
		fields: {
			gender: {
				validators:{
					proveRequired: {
						message: 'The gender is required.',
					}
				}
			},
			browsers: {
				validators:{
					proveRequired: {
						message: 'Please choose 2-3 browsers you use for developing.',
					},
					proveLength: {
						min: 2,
						max: 3,
						message: 'Please choose 2-3 browsers you use for developing.'
					}
				}
			}
		}
	};

	// decorate the form
	form.on('validated.field.prove', function(event, data){
		var input = $(event.target);
		input.bootstrap(data);
	});

	// stop form submit
	form.submit(function(event){
		console.log('stopping submit because only a demo');
		event.preventDefault();
	});

	select.multiselect();
	form.prove(cfg); //validate



})();