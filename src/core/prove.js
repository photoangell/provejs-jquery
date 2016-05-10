/**
 * jQuery Prove (https://github.com/dhollenbeck/jquery-prove)
 */
!function ($) {
	"use strict";

	// Prove constructor
	function Prove(form, options) {

		this.$form = $(form);

		// multiple instances requires extending from {}
		this.options = $.extend({}, this.defaults, options);

		if (options.debug){
			console.groupCollapsed('Prove()');
			console.log('options', options);
			console.groupEnd();
		}

		this.checkOptions();
		this.setupFields();
		this.setupInputs();
		this.setupForm();
		this.setupSubmitIntercept();

		this.$form.trigger('setup.form.prove');
	}

	//$.Prove.prototype.defaults = {
	Prove.prototype = {

		defaults: {
			//control how prove should handle submit button clicks
			submit: {
				button: 'button:submit', //submit button selector
				validate: 'button:submit:not(.skip-validation)',//booleanator, validate on submit, but not if element has class `skip-validation`
				// validate: '#skip-validation:checked',
				prevent: false, //booleanator
				twice: false //todo: allow some forms to submit twice
			}
		},
		states: {},
		constructor: Prove,
		destroy: function() {
			this.teardownFields();
			this.teardownForm();
			this.$form.data('prove', false);
			this.$form.trigger('destroyed.form.prove');
		},
		checkOptions: function(){

			//return early
			//if (!this.options.debug) return;

			//check prove options here
			if (!this.options.fields) console.warn('Missing fields option.');

			$.each(this.options.fields, function(index, field){

				if (!field.validators) console.warn('Missing validators option for field "%s".', index);
			});
		},
		//todo: $.fn.proveIntercept()
		setupSubmitIntercept: function(){
			var selector = this.options.submit.button;
			var handler = $.proxy(this.submitInterceptHandler, this);
			// we intercept the submit by bind `click` rather than ':submit'
			this.$form.on('click', selector, handler);
		},
		submitInterceptHandler: function(event){

			var form = this.$form;
			var shouldValidate = form.booleanator(this.options.submit.validate);
			var preventSubmit = form.booleanator(this.options.submit.prevent);
			//var isValid = (shouldValidate)? form.proveForm() : undefined;
			var validation = (shouldValidate)? form.proveForm() : $.when();
			var nosubmit = !!form.attr('nosubmit');

			validation.done(function(isValid){

				// The combined deferred returned from $.fn.proveForm() has resolved.
				// The resolved value `isValid` will be either true, false, undefined.
				var submitSetup = (isValid && !nosubmit);
				var submitStop = (isValid === false || preventSubmit || nosubmit);

				if (submitSetup) {

					// Add attribute to disable double form submissions.
					form.attr('nosubmit', true);

					// trigger event - for decorator
					form.trigger('submitted.form.prove', {
						validated: shouldValidate
					});
				}

				// submit the form
				if (!submitStop) form.submit();
			});

			validation.fail(function(){
			});

			validation.progress(function(){
			});

			// Stop form submit event because we need
			// to wait for the deferreds to resolve.
			event.preventDefault();
		},
		//return jquery selector that represents the element in the DOM
		domSelector: function(field, name){
			return (field.selector)
				? field.selector
				: '[name="' + name + '"]';
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

			$.each(fields, function(name, field){

				// augment field
				field.name = name;
				field.selector = that.domSelector(field, name);

				that.bindDomFieldEvents(field);
				that.bindFieldProveEvent(field);
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

				that.$form.find(field.selector).trigger('destroyed.field.prove');
			});
		},
		html5NoValidate: function(state){
			this.$form.attr("novalidate", state);
		},
		setupInputs: function(){ // todo: perhas setupState()?

			var form = this.$form;
			//var states = this.states;

			form.provables(this.options.fields).each(function(){
				var input = $(this);

				input.uuid();
				input.trigger('setup.field.prove');
			});
		},
		/**
		* DOM Input Events Listener
		*/
		bindDomFieldEvents: function(field){

			var el = this.$form;
			var domEvents = this.fieldDomEvents(field);
			var handler = $.proxy(this.domFieldEventsHandler, this);
			var data = clone(field);

			// honor request to disable live validation
			if (field.trigger === false) return;

			// http://api.jquery.com/on/
			el.on(domEvents, field.selector, data, handler);
		},
		unbindDomFieldEvents: function(field){

			var el = this.$form;
			var domEvents = this.fieldDomEvents(field);

			// http://api.jquery.com/off/
			el.off(domEvents, field.selector);
		},
		domFieldEventsHandler: function(event){
			var input = $(event.target);
			var field = event.data;
			input.proveInput(field, this.states);
		},
		/**
		* DOM Form Events Listener
		*/
		bindDomFormEvents: function(){
			var handler = $.proxy(this.proveEventHandler1, this);
			this.$form.on('validate.form.prove', handler);
		},
		unbindDomFormEvents: function(){
			this.$form.off('validate.form.prove');
		},
		proveEventHandler1: function(event){
			event.preventDefault();
			this.$form.proveForm();
		},
		/**
			Bind Event 'validate.input.prove'
			https://github.com/dhollenbeck/jquery-prove#event-validatefieldprove

			The concern with this code is that for every prove field we bind a new
			event handler on the form container. The reason we do this because we
			also bind the field config (as event data) to the event so the event handler
			knows the field. Could the event handler determine the field config another way?

			Option 1: Can we determine from event target which field config to use?
			1. try the input.attr('name') to match field name.
			2. does any of the field config selectors match this input?
				var name = input.attr('name');
				$.each(fields, function(field, config){
					if (name === field || input.is(config.selector)) // found correct field
				})
			option 2: require the code that triggers the validate event to pass in
			the field name: input.trigger('validate.input.prove', {field: 'fieldName'})

		*/
		bindFieldProveEvent: function(field){

			var handler = $.proxy(this.proveEventHandler2, this);
			var data = clone(field);

			this.$form.on('validate.input.prove', field.selector, data, handler);
		},
		unbindFieldProveEvent: function(field){
			this.$form.off('validate.input.prove', field.selector);
		},
		proveEventHandler2: function(event){
			event.preventDefault();
			var input = $(event.target);
			var field = event.data;
			input.proveInput(field, this.states);
		}
	};

	$.fn.prove = function(option, parameter, extraOptions) {

		return this.each(function() {

			var form = $(this);
			var prove = form.data('prove');
			var options = typeof option === 'object' && option;
			var isInitialized = !!prove;

			// either initialize or call public method
			if (!isInitialized) {
				// initialize new instance
				prove = new Prove(this, options);
				form.data('prove', prove);
				form.trigger('initialized.prove');
			} else if (typeof option === 'string') {
				// call public method
				// todo: warn if public method does not exist
				prove[option](parameter, extraOptions);
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
