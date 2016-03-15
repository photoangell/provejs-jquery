(function() {

	// check related input has a value
	$.fn.myCallback = function(options){

		var checkbox = $(this);
		var input = checkbox.closest('.input-group').find('input[type="text"]');
		var value = input.val() || '';
		var hasValue = (value !== '');

		if (options.debug){
			console.groupCollapsed('Validators.myCallback()', options.field);
			console.log('options', options);
			console.log('checkbox', checkbox);
			console.log('input', input);
			console.log('value', value);
			console.log('hasValue', hasValue);
			console.groupEnd();
		}

		return hasValue;
	};

	//setup
	var form = $('form');
	var select = form.find('select');
	var inputs = form.find('input[name="charges"]');
	var cfg = {
		fields: {
/*			gender: {
				validators:{
					proveRequired: {
						message: 'The gender is required.',
					}
				}
			},
			browsers: {
				validators:{
					proveRequired: {
						message: 'Please choose browsers you use for developing.',
					}
				}
			},*/
			checkboxes: {
				//trigger: 'change',
				validators:{
					proveRequired: {
						debug: false,
						message: 'Please choose browsers you use for developing.',
					},
					myCallback: {
						debug: true,
						message: 'My custom callback validator says input not valid.',
					}
				}
			},
			/*charges: {
				//trigger: 'change',
				validators:{
					provePattern: {
						debug: true,
						regex: /^[0-9]+$/,
						message: 'Invalid character.',
					}
				}
			}*/
		}
	};

	// form plugins
	// order does not matter
	form.decorate('bootstrap');
	select.multiselect();
	form.prove(cfg);

	form.on('keyup', '[name="charges"]', function(event){
		var input = $(this);
		var checkbox = input.closest('.input-group').find('input[type="checkbox"]');
		//console.log('checkbox', checkbox);
		//checkbox.trigger('valdate.field.prove');
		checkbox.trigger('change');
	});

	form.on('change', '[name="checkboxes"]', function(event){
		var checkbox = $(this);
		var checked = checkbox.is(':checked');

		console.log('checkbox change', checked);
	});

})();