/**
 * jQuery Prove (https://github.com/dhollenbeck/jquery-prove)
 */
!function ($) {
	"use strict";

	var _validators = {};

	// Prove constructor
	function Prove(form, options) {

		this.$form = $(form);

		this.options = this.mergeOptions($.extend({}, options, this.$form.data()));

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

		defaults: {
			option1: false,
			option2: 'btn btn-default',
			templates: {
				button: '<button type="button" class="prove dropdown-toggle" data-toggle="dropdown"><span class="prove-selected-text"></span> <b class="caret"></b></button>',
				liGroup: '<li class="prove-item prove-group"><label></label></li>'
			}
		},

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
		setOptions: function(options) {
			this.options = this.mergeOptions(options);
		},
		mergeOptions: function(options) {
			return $.extend(true, {}, this.defaults, this.options, options);
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
			var handler = $.proxy(this.checkValidators, this);

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
		checkValidators: function(event){

			var that = this;
			var input = $(event.target);
			var field = event.data;
			var validators = field.validators || {};
			var values = this.serializeObject(); //get all values a single time
			var value = input.val(); //todo: will this work on checkboxes, etc
			var data, isValid, state;

/*			console.groupCollapsed('Prove.checkValidators()');
			console.log('value', value);
			console.groupEnd();*/

			$.each(validators, function(validatorName, config){

				// only check next validator if there was not
				// a problem with the previous validator
				if (isValid !== false) {
					state = that.checkValidator(validatorName, config, value, values);

					// Compose data the decorator will be interested in
					data = {
						input: input,
						validator: {
							name: validatorName,
							state: state,
							config: config,
							message: config.message
						}
					}

					// setup for next loop
					if (state === false) isValid = false;
				}
			});

			//trigger event indicating validation state
			if (isValid === true) {
				this.$form.trigger('valid.field.prove', data);
			} else if (isValid === false) {
				this.$form.trigger('invalid.field.prove', data);
			} else {
				this.$form.trigger('reset.field.prove', data);
			}
			this.$form.trigger('field.prove', data);
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