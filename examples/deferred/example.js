(function() {

	//setup
	var form = $('form');
	var cfg = {
		fields: {
			number: {
				validators: {
					proveRequired: {
						message: 'Choose one.',
					}
				}
			},
			discount: {
				trigger: 'keyup',
				throttle: 1000,
				validators: {
					proveRequired: {
						message: 'Discount code is required.',
					},
					proveDeferred: {
						delay: 3000,
						validation: function(value){
							if (value === 'free') {
								return 'success';
							} else {
								return 'danger';
							}
						},
						message: 'Async invalid discount code.'
					}
				}
			}
		}
	};

	form.prove(cfg);
	form.decorate('bootstrap');

})();