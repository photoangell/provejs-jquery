(function() {

	//setup
	var form = $('form');
	var select1 = form.find('[name="field"]');
	var regex = /^[-a-zA-Z0-9,.)( ]*$/;
	var cfg = {
		fields: {
			field: {
				enabled: true, //booleanator
				//trigger: 'change', //tagsinput plugin triggers `change` event which in turn triggers field validation
				validators:{
					proveRequired: {
						debug: false,
						message: 'Fruit is required.',
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

	//form plugins
	form.prove(cfg); //validate

	select1.multiselect({});

})();