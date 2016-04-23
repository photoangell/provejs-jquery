(function() {

	var form = $('form');
	var events = $('#events');
	var all = [
		'setup.field.prove',
		'setup.form.prove',

		'validate.input.prove',
		'validated.input.prove',
		'validated.form.prove',

		'destroyed.field.prove',
		'destroyed.form.prove',
		'submitted.form.prove'
	].join(' ');


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