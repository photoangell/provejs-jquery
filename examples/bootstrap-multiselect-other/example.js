(function() {

	// check related input has a value
	$.fn.otherDescriptionRequired = function(options){

		var checkbox = $(this);
		var input = checkbox.closest('.input-group').find('input[type="text"]');
		var value = input.val() || '';
		var hasValue = (value !== '');

		if (options.debug){
			console.groupCollapsed('Validators.otherDescriptionRequired()', options.field);
			console.log('options', options);
			console.log('checkbox', checkbox);
			console.log('input', input);
			console.log('value', value);
			console.log('hasValue', hasValue);
			console.groupEnd();
		}

		return hasValue;
	};

	// check related input has a value
	$.fn.otherDescriptionPattern = function(options){

		return;

		var checkbox = $(this);
		var input = checkbox.closest('.input-group').find('input[type="text"]');
		var value = input.val() || '';
		var hasValue = (value !== '');

		if (options.debug){
			console.groupCollapsed('Validators.otherDescriptionPattern()', options.field);
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
						debug: true,
						message: 'Please choose browsers you use for developing.',
					},
					otherDescriptionRequired: {
						debug: true,
						message: 'Please enter the description of the other charge.',
					},
					otherDescriptionPattern: {
						debug: true,
						message: 'Invalid character in the description of the other charge.'
					}
				}
			}
		}
	};

	// form plugins
	// order does not matter
	form.decorate('bootstrap');
	select.multiselect();
	form.prove(cfg);

	form.on('keyup', '[name="charges"]', function(event){
		//console.log('keyup');
		var input = $(this);
		var checkbox = input.closest('.input-group').find('input[type="checkbox"]');
		//console.log('checkbox', checkbox);
		checkbox.trigger('validate.field.prove');
	});

	form.on('change', '[name="checkboxes"]:last', function(event){
		var checkbox = $(this);
		var checked = checkbox.is(':checked');
		var input = checkbox.closest('.input-group').find('input[type="text"]');

		//console.log('checkbox change', checked);
		if (checked) {
			//add addition input group
			console.log('add other');
		} else {
			//remove existing input group
			input.val('');
			console.log('empty value, and if not last other then remove this');
		}
	});

})();