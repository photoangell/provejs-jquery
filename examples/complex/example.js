(function() {

	var form = $('form');
	var cfg = {
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


		//setup
		var radio = form.find('[name="statement_attached_has"]');

		var select1 = panel.find('[name="charge_descriptions"]');
		var monies = form.find('.money');
		var table = form.find('table#itemization');
		var wrapper1 = form.find('#wrapper-statement-attached');
		var wrapper2 = form.find('#wrapper-itemized-amounts');
		var isItemization;


/*		form.validate({
			rules: {
				amount_owed: 'required',
				statement_attached_has: 'required',
				charge_descriptions: {
					required: '#use-statement:checked',
					pattern: '{{patterns.commons.tag.source}}'
				},
				itemized_charges_principle_description: {
					required: '.itemized_charges_principle_description:visible',
					pattern: '{{patterns.commons.tag.source}}'
				},
				itemized_charges_principle_description: {
					required: '.itemized_charges_principle_description:visible',
					pattern: '{{patterns.commons.tag.source}}'
				}
			},
			messages: {
				amount_owed: "Please enter your firstname"
			},
			placements: {
				amount_owed: '.col-sm-4',
				charge_descriptions: '.placement',
				statement_attached_has: '.form-group'
			}
		});*/

/*		var configTagsinput = {
			trimValue: true,
			itemText: toLowerCase,
			tagClass: tagClass
		};
		var configMoneymask = {
			allowZero: true
		};

		//tags
		select1.on('itemAdded', revalidate);
		select1.on('itemRemoved', revalidate);
		select1.tagsinput(configTagsinput);

		select1.parent().find('input').addClass('ignore');
		select1.parent().find('input').attr('name', 'ignore');

		//money mask
		monies.on('change', revalidate);
		monies.maskMoney(configMoneymask);*/

		//seup events
		radio.change(onRadioChange);
		//table.on('change', 'input.amount', onItemizationChange);
		//table.on('click', 'a.add-principle-row', addPrincipleChargeRow);
		//table.on('click', 'a.add-additional-row', addAdditionalChargeRow);
		//table.on('click', 'a.del-principle-row', delChargeRow);
		//table.on('click', 'a.del-additional-row', delChargeRow);


	//radio wrapper
	function onRadioChange(event){
		var val = $(this).val();
		console.log('onRadioChange()', val);
		if (val === '1') {
			isItemization = false;
			wrapper1.show();
			wrapper2.hide();
			resetTable();
		} else {
			isItemization = true;
			wrapper2.show();
			wrapper1.hide();
			resetTags();
		}
	}

	// ui event handlers and modifiers

	function addPrincipleChargeRow(event){
		console.log('addPrincipleChargeRow()');

		event.preventDefault();
		var template = $('#row-principle-charge').text();
		var target = table.find('tr.active').eq(1);
		var html = $(template);
		var input = html.find('input').eq(0);
		var money = html.find('input').eq(1);

		//insert into dom
		target.before(html);

		//setup validation
		//form.formValidation('addField', input);

		//setup money mask
		money.maskMoney(configMoneymask);
	}

	function addAdditionalChargeRow(event){
		console.log('addAdditionalChargeRow()');

		event.preventDefault();
		var template = $('#row-additional-charge').text();
		var rows = table.find('tr')
		var target = rows.eq(rows.length-1);
		var html = $(template);
		var input = html.find('input').eq(0);
		var money = html.find('input').eq(1);

		//insert into dom
		target.before(html);

		//setup validation
		//form.formValidation('addField', input);

		//setup money mask
		money.maskMoney(configMoneymask);
	}

	function delChargeRow(event){
		//console.log('delChargeRow()');
		event.preventDefault();
		var tr = $(event.target).closest('tr');
		var money = tr.find('input.money');
		var input = tr.find('input').eq(0);
		var money = tr.find('input').eq(1);

		console.log('remove input', input);

		//remove validation
		//form.formValidation('removeField', input);

		//remove plugins
		money.maskMoney('destroy');

		tr.remove();

		onItemizationChange();
	}





	function resetTable (){
		table.find('input.money').val('0.00');
	}

	function resetTags() {
		console.log('resetTags()');
		select1.tagsinput('removeAll');
		//form.formValidation('resetField', 'charge_descriptions');
		select1.valid(); //validator.element( "#myselect" );
		//form.valid();
	}

	function sumItemizationValues(){
		//console.log('sumItemizationValues()');
		var monies = table.find('.amount');
		var sum = 0;
		monies.each(function(){
			var money = $(this).val();
			var amount = parseFloat(money);
			sum = sum + amount;
		});
		return sum.toFixed(2);
	}

	function onItemizationChange(){
		var sum = sumItemizationValues();
		var summation = table.find('.summation');
		summation.val(sum);
	}


	function tagClass(item){
		var isValid = window.patterns.commons.tag.test(item);
		return (isValid)? 'label label-default' : 'label label-danger';
	}

	function revalidate(event){
		console.log('revalidate()', event.target.name);
		var element = $(event.target);
		element.valid();
		//form.formValidation('revalidateField', event.target.name);
	}

	function toLowerCase(item){
		return item.toLowerCase();
	}


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