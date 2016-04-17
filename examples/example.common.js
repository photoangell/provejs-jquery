(function() {

	var form = $('form');
	var events = $('#events');
	var all = [
		'setup.field.prove',
		'setup.form.prove',

		'validate.input.prove',
		'validated.field.prove',
		'validated.form.prove',

		'destroyed.field.prove',
		'destroyed.form.prove',
		'submitted.form.prove'
	].join(' ');


	// stop form submit
	form.submit(function(event){
		console.log('stopping submit because only a demo');
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