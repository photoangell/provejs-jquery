(function() {

	//setup
	var form = $('form');
	var select1 = form.find('[name="field"]');
	var regex = /^[-a-zA-Z0-9,.)( ]*$/;
	var cfg = {
		fields: {
			field: {
				enabled: true,
				//trigger: false, //demo code below triggers `validate` event
				validators:{
					proveRequired: {
						debug: false,
						message: 'Description is required.',
					},
					provePattern: {
						debug: false,
						regex: regex,
						message: 'Invalid description.'
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

	form.submit(function(event){
		event.preventDefault();

		var ok = form.data('prove').validate();
		//form.trigger('validate.form.prove');

		console.log('submit', ok);
	});

	//form plugins
	form.prove(cfg); //validate

	//tags
	//select1.on('itemAdded', revalidate);
	//select1.on('itemRemoved', revalidate);
	select1.tagsinput({
		trimValue: true,
		itemText: toLowerCase,
		tagClass: tagClass
	});


	function tagClass(item){
		var isValid = regex.test(item);
		return (isValid)? 'label label-default' : 'label label-danger';
	}

	function revalidate(event){
		//console.log('revalidate()', event.target.name);
		var input = $(event.target);
		input.trigger('validate.field.prove');
	}

	function toLowerCase(item){
		return item.toLowerCase();
	}

})();