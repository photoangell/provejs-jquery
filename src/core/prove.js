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
		setupSubmitIntercept: function(){
			var selector = this.options.submit.button;
			var handler = $.proxy(this.submitInterceptHandler, this);
			// we intercept the submit by bind `click` rather than ':submit'
			this.$form.on('click', selector, handler);
		},
		submitInterceptHandler: function(event){

			var shouldValidate = this.$form.booleanator(this.options.submit.validate);
			var preventSubmit = this.$form.booleanator(this.options.submit.prevent);
			var isValid = (shouldValidate)? this.validate() : undefined;
			var nosubmit = !!this.$form.attr('nosubmit');

			var submitSetup = (isValid && !nosubmit);
			var submitStop = (isValid === false || preventSubmit || nosubmit);

			/*
				Of note, the following things did not work to stop double submits.
				If you add the 'disabled' attribute to the button then the next
				submit handler will not be invoked and the form will not be sumitted
				either via ajax or traditional.

				todo: will adding the disabled attr stop double submits on on IE?
				http://stackoverflow.com/a/17107357/2620505

				If you add the bootstrap `disabled` class the button still invokes
				the this intercept handler.
			*/

/*			console.groupCollapsed('submitInterceptHandler()');
			console.log('shouldValidate', shouldValidate);
			console.log('preventSubmit', preventSubmit);
			console.log('nosubmit', nosubmit);
			console.log('isValid', isValid);
			console.groupEnd();*/

			if (submitSetup) {

				// Add attribute to disable double form submissions.
				this.$form.attr('nosubmit', true);

				// trigger event - for decorator
				this.$form.trigger('submitted.form.prove', {
					validated: shouldValidate
				});
			}

			// stop form submit
			if (submitStop) event.preventDefault();
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

		isPlugin: function(plugin){
			var exist = (typeof $.fn[plugin] === 'function');
			if (!exist) console.error('Missing validator plugin "%s".', plugin);
			return exist;
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

				var selector = that.domSelector(field, name);
				var input = that.$form.find(selector);

				//copy field name inside field config
				field.name = name;
				field.selector = selector;

				that.bindDomFieldEvents(field);
				that.bindFieldProveEvent(field);

				input.trigger('setup.field.prove');
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

			this.checkField(field, input);
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
			this.validate();
		},
		/**
			Bind Event 'validate.field.prove'
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
			the field name: input.trigger('validate', {field: 'fieldName'})

		*/
		bindFieldProveEvent: function(field){

			var handler = $.proxy(this.proveEventHandler2, this);
			var data = clone(field);

			this.$form.on('validate.field.prove', field.selector, data, handler);
		},
		unbindFieldProveEvent: function(field){
			this.$form.off('validate.field.prove', field.selector);
		},
		proveEventHandler2: function(event){

			event.preventDefault();
			var input = $(event.target);
			var field = event.data;

			this.checkField(field, input);
		},

		//todo: make this a plugin
		checkField: function(field, input){ //todo: rename proveInput

			var data, isValid;
			var that = this;
			var fieldName = field.name;
			var validators = field.validators || {};
			var isEnabled = input.booleanator(field.enabled);

			// return early if nothing to do
			if (!isEnabled) {
				// trigger event indicating validation state
				input.trigger('validated.field.prove', data);
				return isValid;
			}

			// loop each validator
			$.each(validators, function(validatorName, config){

				config.field = fieldName;

				// invoke validator plugin
				if (!that.isPlugin(validatorName)) return false;
				var result = input[validatorName](config);

				//todo: warn if result is not an object with the required properties

				// Compose data the decorator will be interested in
				data = {
					field: result.field,
					state: result.state,
					message: config.message,
					validator: {
						name: result.validator,
						config: clone(config)
					}
				};

				isValid = result.state;

				// return of false to break loop
				return isValid;
			});

			//trigger event indicating validation state
			input.trigger('validated.field.prove', data);

			return isValid;
		},

		//validate entire form
		validate: function(){

			var form = this.$form;
			var fields = this.options.fields;
			var checkField = $.proxy(this.checkField, this);
			var isValid = true;
			var completed = [];

			//loop inputs
			form.provables().each(function(){
				var isProved;
				var input = $(this);
				var field = fields[this.field];
				var isCompleted = ($.inArray(this.field, completed) > -1);
				var isMultiple = field.multiple;

				if (!field) {
					//skip inputs with no field config
				} else if (!isCompleted) {
					isProved = checkField(field, input);
					//todo: isProved = input.proveField(field);
				} else if (isMultiple) {
					// Any field for which you might have multiple inputs of the same name (checkbox, radio, name="fields[]")
					// for which you want to be validated individually, you can set the field.multiple = true.
					isProved = checkField(field, input);
					//todo: isProved = input.proveField(field);
				}
				isValid = toggleState(isValid, isProved);
				completed.push(field.name);
			});

			//trigger event indicating validation state
			// todo: return validators (state and messages)
			form.trigger('validated.form.prove', {
				state: isValid
			});
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

	function toggleState(isValid, isProved){
		if (isProved === false) {
			isValid = false;
		} else {
			if (isProved === true && isValid !== false) isValid = true;
		}
		return isValid;
	}

}(window.jQuery);
