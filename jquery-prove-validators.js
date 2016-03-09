!function ($) {
	"use strict";


	/**
	* Required validator.
	* @param {bool} required The validator configuration.
	* @param {string or array} num2 The input value to validate.
	* @param {object} values All input values.
	* @return {bool or null} The result of the validation.
	*/
	$.Prove.addValidator('required', function( required, value, values ) {

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
			isValid = true;
		} else if (required === false) {
			isValid = true;
		} else if (required === true){
			isValid = false;
		} else if (typeof required === 'string'){
			isValid = evalSelector(required);
		} else if (typeof required === 'function'){
			isValid = !required(value, values);
		} else {
			throw new Error('Invalid `required` param for required validator.');
		}

		console.groupCollapsed('Validator.required()')
			console.log('required', required);
			console.log('value', value);
			console.log('values', values);
			console.log('isValid', isValid);
		console.groupEnd();

		return isValid;
	});

	/**
	* Regex validator.
	* @param {regex} regex The validator configuration.
	* @param {string or array} num2 The input value to validate.
	* @param {object} values All input values.
	* @return {bool or null} The result of the validation.
	*/
	$.Prove.addValidator('pattern', function( parttern, value, values ) {

		var hasValue = this.hasValue(value);
		var regex = new RegExp( "^(?:" + parttern + ")$" );
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
			console.log('parttern', parttern);
			console.log('value', value);
			console.log('values', values);
			console.log('isValid', isValid);
		console.groupEnd();

		return isValid;
	});
}(window.jQuery);