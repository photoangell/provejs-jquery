/**
 * jQuery Prove (https://github.com/dhollenbeck/jquery-prove)
 */
!function ($) {
	"use strict";

	// Prove constructor
	function Prove(form, options) {

		this.$form = $(form);

		//todo: clean this up
		this.options = $.extend(this.defaults, options);

		if (options.debug){
			console.groupCollapsed('Prove()');
			console.log('options', options);
			console.groupEnd();
		}

		this.setupFields();
		this.setupForm();

		this.$form.trigger('setup.form.prove');
	}

	//$.Prove.prototype.defaults = {
	Prove.prototype = {

		defaults: {},
		constructor: Prove,

		destroy: function() {
			console.log('destroy()');
			//this.$container.remove();
			//this.$form.show();
			//this.$form.data('prove', null);

			var el = this.$form;
			el.data('prove', false);

			this.teardownFields();
			this.teardownForm();

			el.trigger('destroyed.form.prove');
		},
		//return jquery selector that represents the element in the DOM
		domSelector: function(field){
			return (field.selector)
				? field.selector
				: '[name="' + field.name + '"]';
		},
		//return string of space seperated events used to detect change to the DOM element
		fieldDomEvents: function(field){
			var events = field.trigger || 'change keyup click blur';
			return events;
		},

		setupForm: function(){
			this.html5NoValidate(true);
			this.bindDomFormEvents();
		},
		teardownForm: function(){
			this.html5NoValidate(false);
			this.unbindDomFormEvents();
		},
		setupFields: function(options){

			var opts = options || this.options;
			var fields = opts.fields || {};
			var that = this;

			//console.log('setupFields()');

			$.each(fields, function(name, field){

				//copy field name inside field config
				field.name = name;

				that.bindDomFieldEvents(field);
				that.bindFieldProveEvent(field);

				var selector = that.domSelector(field);
				that.$form.find(selector).trigger('setup.field.prove');
			});
		},
		teardownFields: function(options){

			var opts = options || this.options;
			var fields = opts.fields || {};
			var that = this;

			//console.log('teardownFields()');

			$.each(fields, function(name, field){
				that.unbindDomFieldEvents(field);
				that.unbindFieldProveEvent(field);

				var selector = that.domSelector(field);
				that.$form.find(selector).trigger('destroyed.field.prove');
			});
		},
		html5NoValidate: function(state){
			this.$form.attr("novalidate", state);
		},
		/**
		* DOM Input Events Listener
		*/
		bindDomFieldEvents: function(field){

			var el = this.$form;
			var domEvents = this.fieldDomEvents(field);
			var selector = this.domSelector(field);
			var handler = $.proxy(this.domFieldEventsHandler, this);
			var data = clone(field);

			// http://api.jquery.com/on/
			el.on(domEvents, selector, data, handler);
		},
		unbindDomFieldEvents: function(field){

			var el = this.$form;
			var domEvents = this.fieldDomEvents(field);
			var selector = this.domSelector(field);

			// http://api.jquery.com/off/
			el.off(domEvents, selector);
		},
		domFieldEventsHandler: function(event){

			var input = $(event.target);
			var field = event.data;

			this.checkField(field, input);
		},
		/**
		* DOM Form Events Listener
		*/
		bindDomFormEvents: function(){

			var el = this.$form;
			var domEvents = 'validate.form.prove';
			var handler = $.proxy(this.validate, this);

			// http://api.jquery.com/on/
			el.on(domEvents, handler);
		},
		unbindDomFormEvents: function(){

			var el = this.$form;
			var domEvents = 'validate.form.prove';

			// http://api.jquery.com/off/
			el.off(domEvents);
		},

		/**
		* Bind Event 'validate.field.prove'
		* https://github.com/dhollenbeck/jquery-prove#event-validatefieldprove
		*/
		bindFieldProveEvent: function(field){

			var el = this.$form;
			var proveEvents = 'validate.field.prove';
			var selector = this.domSelector(field);
			var handler = $.proxy(this.proveInputEventHandler, this);
			var data = clone(field);

			// http://api.jquery.com/on/
			el.on(proveEvents, selector, data, handler);
		},
		unbindFieldProveEvent: function(field){

			var el = this.$form;
			var proveEvent = 'validate.field.prove';
			var selector = this.domSelector(field);

			// http://api.jquery.com/off/
			el.off(domEvent, selector);
		},
		proveInputEventHandler: function(event){

			var input = $(event.target);
			var field = event.data;

			this.checkField(field, input);
		},

		/**
		* Required validator.
		* @param {object} options The validator configuration.
		* @option {string or array} state The input value to validate.
		* @option {object} values All input values.
		* @return {bool or null} The result of the validation.
		*/
		checkField: function(field, input){

			var data, isValid = true, state;
			var fieldName = field.name;
			var validators = field.validators || {};

			$.each(validators, function(validatorName, validatorConfig){

				validatorConfig.field = fieldName;

				// Only check next validator if there was
				// not a problem with the previous one.
				if (isValid !== false) {

					//todo: show warning if validator plugin is not defined
					//invoke validator plugin
					state = input[validatorName](validatorConfig);

					// Compose data the decorator will be interested in
					data = {
						field: field.name,
						state: state,
						message: validatorConfig.message,
						// todo: do we return an array of validators and their data?
						// We would need to do this on the `validated.form.prove` event.
						validator: {
							name: validatorName,
							config: clone(validatorConfig)
						}
					}

					// setup for next loop
					if (state === false) isValid = false;
				}
			});

			//trigger event indicating validation state
			input.trigger('validated.field.prove', data);

			return isValid;
		},

		//validate entire form
		validate: function(){
			//console.log('Prove.validate()');

			var fields = this.options.fields;
			var checkField = $.proxy(this.checkField, this);
			var isValid = true;
			var that = this;

			$.each(fields, function(index, field){

				//todo: encapsulate?
				var selector = '[name="' + field.name + '"]';
				var input = that.$form.find(selector);


				var isValidField = checkField(field, input);

				if (!isValidField) isValid = false;
			});

			//trigger event indicating validation state
			// todo: return validators (state and messages)
			this.$form.trigger('validated.form.prove', {
				state: isValid
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

	$.fn.prove.Constructor = Prove;

	function clone(obj){
		return $.extend({}, obj);
	}

}(window.jQuery);