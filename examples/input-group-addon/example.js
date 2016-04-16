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
			console.log('isValid', hasValue);
			console.groupEnd();
		}

		return {
			validator: 'otherDescriptionRequired',
			field: options.field,
			state: hasValue
		};
	};

	// check related input has a value
	$.fn.otherDescriptionPattern = function(options){

		var checkbox = $(this);
		var input = checkbox.closest('.input-group').find('input[type="text"]');
		var val = input.val();

		var isValid = (/^[a-zA-z0-9]+$/).test(val);

		if (options.debug){
			console.groupCollapsed('Validators.otherDescriptionPattern()', options.field);
			console.log('options', options);
			console.log('checkbox', checkbox);
			console.log('input', input);
			console.log('value', val);
			console.log('isValid', isValid);
			console.groupEnd();
		}

		return {
			validator: 'otherDescriptionRequired',
			field: options.field,
			state: isValid
		};
	};


	//setup
	var form = $('form');
	var select = form.find('select');
	var inputs = form.find('input[name="charges"]');
	var cfg = {
		fields: {
			checkboxes: {
				multiple: false,
				validators:{
					proveRequired: {
						//debug: true,
						message: 'Please choose browsers you use for developing.',
					},
					otherDescriptionRequired: {
						//debug: true,
						message: 'Please enter the description of the other charge.',
					},
					otherDescriptionPattern: {
						//debug: true,
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

		checkbox.validate();
	});

	form.on('change', '[name="checkboxes"]', function(event){
		var checkbox = $(this);
		var checked = checkbox.is(':checked');
		var input = checkbox.closest('.input-group').find('input[type="text"]');
		var readonly = !!input.attr('readonly');

		if (!checked && !readonly) {
			//remove existing input group
			input.val('');
		}
	});

	// remove input group
	form.on('click', '.del-input-group', function(event){
		$(this).closest('.input-group').remove();
		$('form').find('[name="checkboxes"]:first').validate();
	});

	// insert input group
	form.on('click', '.add-input-group', function(event){
		var html = $('script#row').text();
		var group = $(this).closest('.form-group');
		var target = group.find('.input-group:last');
		target.after(html);
	});


})();