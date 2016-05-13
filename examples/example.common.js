(function() {

	var form = $('form');
	var status = $('#form-status');
	var events = $('#events');
	var all = [
		'setup.field.prove',
		'setup.form.prove',

		'validate.input.prove',
		'status.input.prove',
		'validated.form.prove',

		'destroyed.field.prove',
		'destroyed.form.prove',
		'submitted.form.prove'
	].join(' ');

	form.on('validated.form.prove', function(event, data){

		status.removeClass('alert-success');
		status.removeClass('alert-danger');
		status.removeClass('alert-warning');

		if (data.valid === true) {
			status.text('Valid Form');
			status.addClass('alert-success');
		} else if (data.valid === false) {
			status.text('Invalid Form');
			status.addClass('alert-danger');
		} else if (data.valid === undefined) {
			status.text('Reset Form');
			status.addClass('alert-warning');
		}
	});


	// stop form submit
	form.submit(function(event){
		console.log('demo: stopping submit...');
		event.preventDefault();
	});

	if (events.length){
		$('form').on(all, function(event, data){
			data = data || {};
			events.prepend(eventRow(event, data));
		});
	}

	//private function
	function eventRow(event, data){

		var input = $(event.target);
		var ts = new Date(event.timeStamp);
		var tr = $('<tr><td></td><td></td><td></td><td></td></tr>');
		var td = tr.find('td');
		var valid = validDecorator(data.valid);
		td.eq(0).text(event.type + '.' + event.namespace);
		td.eq(1).text(input.attr('name') || 'form');
		td.eq(2).html(valid);
		td.eq(3).text(ts.toISOString().split('T')[1].replace('Z', ''));
		return tr;
	}

	function validDecorator(valid){
		if (valid === true) {
			return '<span class="label label-success">TRUE</span>';
		} else if (valid === false) {
			return '<span class="label label-danger">FALSE</span>';
		} else {
			return '<span class="label label-warning">RESET</span>';
		}
	}

})();