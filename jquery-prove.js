/**
 * jQuery Prove (https://github.com/dhollenbeck/jquery-prove)
 */
!function ($) {
	"use strict";

	 // Constructor
	//$.Prove = function(element, options){
	function Prove(form, options) {

		this.$form = $(form);

		this.options = this.mergeOptions($.extend({}, options, this.$form.data()));

		console.log('Prove()', this.options);

		this.setupFields();
	}

	$.Prove = Prove;
	$.Prove.prototype.addValidator = function(name, method){
		this._validators[ name ] = method;
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

		_validators: {},

/*		addValidator: function(name, method){
			_validators[ name ] = method;
		},*/

		destroy: function() {
			console.log('destroy()');
			//this.$container.remove();
			//this.$form.show();
			//this.$form.data('prove', null);

			var el = this.$form;
			el.data('prove', false);

			this.teardownFields();

			el.trigger('prove.destroyed');
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
			return 'change keyup click blur';
		},
		setupFields: function(options){

			var opts = options || this.options;
			var fields = opts.fields || {};
			var that = this;

			console.log('setupFields()');

			$.each(fields, function(name, field){
				that.bindDomEvent(name, field);
			});
		},
		teardownFields: function(options){

			var opts = options || this.options;
			var fields = opts.fields || {};
			var that = this;

			console.log('teardownFields()');

			$.each(fields, function(name, field){
				that.unbindDomEvent(name, field);
			});
		},
		//delagate events on form form for specific field
		bindDomEvent: function(name, field){

			var el = this.$form;
			var events = this.domEvents(name, field);
			var selector = this.domSelector(name, field);
			var handler = $.proxy(this.validateFieldHandler, this); //todo: do in constructor?

			console.log('bindDomEvents()', events, selector);

			// http://api.jquery.com/on/
			el.on(events, selector, field, handler);
		},
		unbindDomEvent: function(name, field){
			var el = this.$form;
			var events = this.domEvents(name, field);
			var selector = this.domSelector(name, field);

			console.log('unbindDomEvents()', events, selector);

			// http://api.jquery.com/off/
			el.off(events, selector);
		},
		validateFieldHandler: function(event){

			var that = this;
			var input = $(event.target);
			var value = input.val();
			var field = event.data;
			var validators = field.validators || {};

			console.log('validateFieldHandler()', field);

			$.each(validators, function(name, param){
				that.checkValidator(name, param, value);
			});
		},
		checkValidator: function(name, param, value){
			var validator = this._validators[name];

			// return early with warning
			if (!validator) return console.warn("Validator '%s' not found. Please use $.Prove.addValidator().", name);

			console.log('checkValidator()', name, param, value);

			//change the scope of this inside the validator
			validator = $.proxy(validator, this);

			validator(value, element, param);
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
				el.trigger('prove.initialized');
			} else if (typeof option === 'string') {
				// call public method
				data[option](parameter, extraOptions);
			} else {
				throw new Error('invalid invocation.');
			}
		});
	};

	$.fn.prove.Constructor = Prove;

}(window.jQuery);