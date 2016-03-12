!function ($) {
	"use strict";

	$.fn.vals = function(options) {

		options = options || {};

		var input = $(this);
		var type = input.attr('type');
		var isSelect = input.is('select');
		var isCheckbox = (type === 'checkbox');
		var isRadio = (type === 'radio');
		var isNumber = (type === 'number');
		var isFile = (type === 'file');
		var val, idx;



		if (isSelect){
			val = input.val();
		} else if ( isRadio || isCheckbox ) {
			val = input.filter(':checked').val();
		} else if ( isNumber && typeof input.validity !== 'undefined' ) {
			val = input.validity.badInput ? NaN : input.val();
		} else if ( isFile ) {

			val = input.val();

			// Modern browser (chrome & safari)
			if ( val.substr( 0, 12 ) === 'C:\\fakepath\\' ) val = val.substr( 12 );

			// Legacy browsers, unix-based path
			idx = val.lastIndexOf( '/' );
			if ( idx >= 0 ) val = val.substr( idx + 1 );

			// Windows-based path
			idx = val.lastIndexOf( '\\' );
			if ( idx >= 0 ) val = val.substr( idx + 1 );
		} else if ( input.attr('contenteditable') ) {
			val = input.text();
		} else {
			val = input.val();
		}

		if ( typeof val === 'string' ) return val.replace( /\r/g, '' );

		if (options.debug) {
			console.groupCollapsed('Validator.vals()');
			console.log('input', input);
			console.log('type', type);
			console.log('val', val);
			console.groupEnd();
		}

		return val;
	};

	$.fn.hasValue = function(){

		var input = $(this);
		var value = input.vals();
		var isString, isArray, hasValue;

		isString = (typeof value === 'string');
		isArray = $.isArray(value);
		value = (isString)? $.trim(value) : value;
		hasValue = ((isString && !!value.length) || (isArray && !!value.length && !!value[0].length));
		return hasValue;
	};

	$.fn.proveEqualTo = function( options ) {

		var input = $(this);
		var other = $(options.equalTo);
		var form = input.closest('form');
		var isSetup = input.hasClass('validator-equalto-setup');
		var isValid = (input.val() === other.val());

		//setup event to validate this input when other input value changes
		if (!isSetup){
			input.addClass('validator-equalto-setup');
			//on blur of other input
			form.on('focusout', options.equalTo, function(event){
				//trigger validation of this input
				input.trigger('validate.field.prove');
			});
		}

		//return current validation state
		return isValid;
	};

	/**
	* Required validator.
	* @param {object} options The validator configuration.
	* @option {string or array} state The input value to validate.
	* @option {object} values All input values.
	* @return {bool or null} The result of the validation.
	*/
	$.fn.proveRequired = function(options){

		var input = $(this);
		var value = input.vals({
			//debug: options.debug
		});
		var hasValue = input.hasValue();
		var isValid;

		function evalSelector(selector){
			try {
				return !!$(selector).length;
			} catch (e) {
				console.error('Invalid `required` jquery selector (`%s`) param for required validator.', selector);
				return false;
			}
		}

		if (hasValue) {
			//if has value it pointless to do anything but return true
			isValid = true;
		} else if (options.state === false) {
			isValid = true;
		} else if (options.state === true){
			isValid = false;
		} else if (typeof options.state === 'string'){
			isValid = evalSelector(options.state);
		} else if (typeof options.state === 'function'){
			isValid = !options.state(value, values);
		} else {
			throw new Error('Invalid `required` param for required validator.');
		}

		if (options.debug){
			console.groupCollapsed('Validator.required()', options.field)
				console.log('options', options);
				console.log('value', value);
				console.log('isValid', isValid);
			console.groupEnd();
		}

		return isValid;
	};

	/**
	* Pattern validator.
	* @param {bool} config The validator configuration.
	* @param {string or array} num2 The input value to validate.
	* @param {object} values All input values.
	* @return {bool or null} The result of the validation.
	*/
	$.fn.provePattern = function(options){

		var input = $(this);
		var value = input.val();
		var hasValue = input.hasValue();
		var regex = new RegExp( "^(?:" + options.regex + ")$" );
		var isValid;

		if (!hasValue) {
			// all validators should return true (or perhaps null)
			// when there is no value. Otherwise, there is no purpose
			// for the 'proveRequired' validator.
			isValid = true;
		} else if(regex instanceof RegExp) {
			isValid = regex.test(value);
		} else {
			isValid = false;
		}
		if (options.debug){
			console.groupCollapsed('Validator.pattern()')
				console.log('options', options);
				console.log('isValid', isValid);
			console.groupEnd();
		}

		return isValid;
	};

}(window.jQuery);
