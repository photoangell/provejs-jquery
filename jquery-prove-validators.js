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

		console.groupCollapsed('Validator.required()')
			console.log('required', required);
			console.log('value', value);
			console.log('values', values);
		console.groupEnd();

		var hasValue = this.hasValue(value);

		return (!required)? true : hasValue;
	});

	/**
	* Regex validator.
	* @param {regex} regex The validator configuration.
	* @param {string or array} num2 The input value to validate.
	* @param {object} values All input values.
	* @return {bool or null} The result of the validation.
	*/
	$.Prove.addValidator('pattern', function( parttern, value, values ) {

		console.groupCollapsed('Validator.pattern()')
			console.log('parttern', parttern);
			console.log('value', value);
			console.log('values', values);
		console.groupEnd();

		var hasValue = this.hasValue(value);
		var regex = new RegExp( "^(?:" + parttern + ")$" );

		if (!hasValue) {
			return true;
		} else if(regex instanceof RegExp) {
			console.log('testing regex')
			return regex.test(value);
		} else {
			console.log('skipping regex')
			return false;
		}
	});
}(window.jQuery);