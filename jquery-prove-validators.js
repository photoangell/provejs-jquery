!function ($) {
	"use strict";


	/**
	* Required validator.
	* @param {bool} config The validator configuration.
	* @param {string or array} num2 The input value to validate.
	* @param {object} values All input values.
	* @return {bool or null} The result of the validation.
	*/
	$.Prove.addValidator('required', function( config, value, values ) {

		var hasValue = this.hasValue(value);
		var isValid;

		function evalSelector(selector){
			try {
				return !!$(required).length;
			} catch (e) {
				console.error('Invalid `required` jquery selector (`%s`) param for required validator.', selector);
				return false;
			}
		}

		if (hasValue) {
			//if has value it pointless to do anything but return true
			isValid = true;
		} else if (config.state === false) {
			isValid = true;
		} else if (config.state === true){
			isValid = false;
		} else if (typeof config.state === 'string'){
			isValid = evalSelector(config.state);
		} else if (typeof config.state === 'function'){
			isValid = !config.state(value, values);
		} else {
			throw new Error('Invalid `required` param for required validator.');
		}

		console.groupCollapsed('Validator.required()')
			console.log('config', config);
			console.log('value', value);
			console.log('values', values);
			console.log('isValid', isValid);
		console.groupEnd();

		return isValid;
	});

	/**
	* Pattern validator.
	* @param {bool} config The validator configuration.
	* @param {string or array} num2 The input value to validate.
	* @param {object} values All input values.
	* @return {bool or null} The result of the validation.
	*/
	$.Prove.addValidator('pattern', function( config, value, values ) {

		var hasValue = this.hasValue(value);
		var regex = new RegExp( "^(?:" + config.regex + ")$" );
		var isValid;

		if (!hasValue) {
			// all validators should return true (or perhaps null)
			// when there is no value. Otherwise, there is no purpose
			// for the 'required' validator.
			isValid = true;
		} else if(regex instanceof RegExp) {
			isValid = regex.test(value);
		} else {
			isValid = false;
		}

		console.groupCollapsed('Validator.pattern()')
			console.log('config', config);
			console.log('value', value);
			console.log('values', values);
			console.log('isValid', isValid);
		console.groupEnd();

		return isValid;
	});
}(window.jQuery);