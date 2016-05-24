(function() {
	var form = $('form');
	var cfg = {
		fields: {
			comment: {
				//trigger: 'keyup',
				throttle: 250,
				validators: {
					proveRequired: {
						message: 'Your comment is required.',
					},
					provePattern: {
						debug: true,
						regex: '[A-Za-z0-9._%+- ]{1,255}',
						message: 'Invalid comment.' //optional, passed to decorator
					}
				}
			}
		}
	};

	//form plugins
	form.prove(cfg);
	form.decorate('bootstrap');

})();