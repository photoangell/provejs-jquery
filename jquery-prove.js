/**
 * jQuery Prove (https://github.com/dhollenbeck/jquery-prove)
 */
!function ($) {
	"use strict";

	var _validators = {
		required: function( param, value, values) {

			console.log('required()', param, value, values);

			return false;

			if (param === false) {

			}
			// Check if dependency is met
			if ( !this.depend( param, element ) ) {
				return "dependency-mismatch";
			}
			if ( element.nodeName.toLowerCase() === "select" ) {

				// Could be an array for select-multiple or a string, both are fine this way
				var val = $( element ).val();
				return val && val.length > 0;
			}
			if ( this.checkable( element ) ) {
				return this.getLength( value, element ) > 0;
			}
			return value.length > 0;
		},

	};

	// Prove constructor
	function Prove(form, options) {

		this.$form = $(form);

		this.options = this.mergeOptions($.extend({}, options, this.$form.data()));

		console.log('Prove()');

		this.setupFields();
	}

	//add public method to constructor
	Prove.addValidator = function(name, method){
		console.log('existing validators', _validators);
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
		//delegate DOM events to form
		bindDomEvent: function(name, field){

			var el = this.$form;
			var events = this.domEvents(name, field);
			var selector = this.domSelector(name, field);
			var handler = $.proxy(this.validateFieldHandler, this);

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
		validateFieldHandler: function(event){

			var that = this;
			var input = $(event.target);
			//var value = input.val();
			var field = event.data;
			var validators = field.validators || {};
			var values = this.serializeObject(); //get all values a single time

			console.log('validateFieldHandler()', field);

			$.each(validators, function(name, param){
				that.checkValidator(input, name, param, values);
			});
		},
		checkValidator: function(input, name, param, values){

			console.log('checkValidator()', name, param, values);

			// setup
			var validator = $.proxy(_validators[name], this) || function(){
				console.warn("Validator '%s' not found. Please use $.Prove.addValidator().", name);
			};
			var value = values[name]; //todo: not sure how this will work with checkboxes, radio, and select (multiple)
			var isValid = validator(param, value, values);
			var data = {
				input: input,
				validator:{
					name: name,
					config: param,
					state: isValid
				}
			};

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