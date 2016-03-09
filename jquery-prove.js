/**
 * jQuery Prove (https://github.com/dhollenbeck/jquery-prove)
 */
!function ($) {
	"use strict";

	var _validators = {};

	// Prove constructor
	function Prove(form, options) {

		this.$form = $(form);

		//todo: clean this up
		this.options = $.extend(this.defaults, options);

		console.groupCollapsed('Prove()');
		console.log('options', options);
		console.groupEnd();

		this.setupFields();
	}

	//add public method to constructor
	Prove.addValidator = function(name, method){
		_validators[ name ] = method;
	};

	//$.Prove.prototype.defaults = {
	Prove.prototype = {

		defaults: {},
		constructor: Prove,

		hasValue: function(value){
			var isString, isArray, hasValue;

			isString = (typeof value === 'string');
			isArray = $.isArray(value);
			value = (isString)? $.trim(value) : value;
			hasValue = ((isString && !!value.length) || (isArray && !!value.length && !!value[0].length));
			return hasValue;
		},
		destroy: function() {
			console.log('destroy()');
			//this.$container.remove();
			//this.$form.show();
			//this.$form.data('prove', null);

			var el = this.$form;
			el.data('prove', false);

			this.teardownFields();

			el.trigger('destroyed.prove');
		},
		//return jquery selector that represents the element in the DOM
		domSelector: function(name, field){
			return (field.selector)
				? field.selector
				: '[name="' + name + '"]';
		},
		//return string of space seperated events used to detect change to the DOM element
		domEvents: function(name, field){
			var events = field.trigger || 'change keyup click blur';
			return events;
		},
		setupFields: function(options){

			var opts = options || this.options;
			var fields = opts.fields || {};
			var that = this;

			//console.log('setupFields()');

			$.each(fields, function(name, field){
				that.bindDomEvent(name, field);
				that.html5NoValidate(true);
			});
		},
		teardownFields: function(options){

			var opts = options || this.options;
			var fields = opts.fields || {};
			var that = this;

			//console.log('teardownFields()');

			$.each(fields, function(name, field){
				that.unbindDomEvent(name, field);
				this.html5NoValidate(false);
			});
		},
		html5NoValidate: function(state){
			this.$form.attr("novalidate", state);
		},
		//delegate DOM events to form
		bindDomEvent: function(name, field){

			var el = this.$form;
			var events = this.domEvents(name, field);
			var selector = this.domSelector(name, field);
			var handler = $.proxy(this.checkHandler, this);

			//console.log('bindDomEvents()', events, selector);

			// http://api.jquery.com/on/
			el.on(events, selector, field, handler);
		},
		unbindDomEvent: function(name, field){
			var el = this.$form;
			var events = this.domEvents(name, field);
			var selector = this.domSelector(name, field);

			//console.log('unbindDomEvents()', events, selector);

			// http://api.jquery.com/off/
			el.off(events, selector);
		},
		checkHandler: function(event){

			var input = $(event.target);
			var field = event.data;
			var values = this.serializeObject(); //get all values

			this.checkValidators(field, input, values);
		},
		checkValidators: function(field, input, values){

			var data, isValid = true, state;
			var validators = field.validators || {};
			var value = input.val(); //todo: will this work on checkboxes, etc
			var checkValidator = $.proxy(this.checkValidator, this);

			$.each(validators, function(validatorName, config){

				// only check next validator if there was not
				// a problem with the previous validator
				if (isValid !== false) {
					state = checkValidator(validatorName, config, value, values);

					// Compose data the decorator will be interested in
					data = {
						input: input,
						validator: {
							name: validatorName,
							state: state,
							config: $.extend({},config), //clone
							message: config.message
						}
					}

					// setup for next loop
					if (state === false) isValid = false;
				}
			});

			//trigger event indicating validation state
			this.$form.trigger('field.prove', data);

			return isValid;
		},
		checkValidator: function(validator, config, value, values){

/*			console.groupCollapsed('Prove.checkValidator()');
			console.log('validator', validator);
			console.log('config', config);
			console.log('value', value);
			console.log('values', values);
			console.groupEnd();*/

			// setup
			var validator = $.proxy(_validators[validator], this) || function(){
				console.warn("Validator '%s' not found. Please use $.Prove.addValidator().", validator);
			};

			var isValid = validator(config, value, values);
			return isValid;
		},
		isSelector: function(str){
			return
		},
		serializeObject: function(){
			//https://raw.githubusercontent.com/cowboy/jquery-misc/master/jquery.ba-serializeobject.js
			var obj = {};

			$.each( this.$form.serializeArray(), function(i,o){
				var n = o.name;
				var v = o.value;

				obj[n] = obj[n] === undefined ? v
					: $.isArray( obj[n] ) ? obj[n].concat( v )
					: [ obj[n], v ];
			});

			return obj;
		},

		//validate entire form
		valid: function(){
			console.log('Prove.valid()');

			var fields = this.options.fields;
			var checkValidators = $.proxy(this.checkValidators, this);
			var values = this.serializeObject();
			var isValid = true;
			var that = this;

			$.each(fields, function(fieldName, fieldConfig){

				//todo: encapsulate
				var selector = '[name="' + fieldName + '"]';
				var input = that.$form.find(selector);


				var isValidField = checkValidators(fieldConfig, input, values);

				console.log('isValidField', isValidField);
				if (!isValidField) isValid = false;
			});

			return isValid;
		}
	};

	$.fn.prove = function(option, parameter, extraOptions) {
		//console.log('prove()', option);

		return this.each(function() {

			var el = $(this);
			var data = el.data('prove');
			var options = typeof option === 'object' && option;
			var isInitialized = (data);
			var Prove = $.Prove;

			// either initialize or call public method
			if (!isInitialized) {
				// initialize new instance
				data = new Prove(this, options);
				el.data('prove', data);
				el.trigger('initialized.prove');
			} else if (typeof option === 'string') {
				// call public method
				// todo: warn if public method does not exist
				data[option](parameter, extraOptions);
			} else {
				throw new Error('invalid invocation.');
			}
		});
	};

	$.Prove = Prove;
	$.fn.prove.Constructor = Prove;

}(window.jQuery);