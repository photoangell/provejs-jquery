!function ($) {
	"use strict";

	// Called at setup and while validating entire form.
	$.fn.provables = function(fields, filter) {

		var inputs = $();
		var form = $(this);
		fields = fields || {};

		// build selector
		$.each(fields, function(name, field){

			var found = form.find(field.selector);
			var filtered = (filter)? found.filterables(field) : found;

			filtered.each(function(){
				this.field = name;
				inputs.push(this);
			});
		});
		return inputs;
	};

	// Any field for which you might have multiple inputs of the same name (checkbox, radio, name="fields[]")
	// for which you want to be validated individually, you can set the field.multiple = true.
	$.fn.filterables = function(field){

		var found = $(this);
		var isRadio = found.is(':radio');
		var hasAtLeastOneChecked = (found.filter(':checked').length > 0);

		// determine how to handle multiple found
		var filtered = found.filter(function(index, element){

			if (found.length === 0){
				// No inputs found. Expect this is an unreachable condition, but
				// seems ok to filter out the not found input.
				return false;
			} else if (found.length === 1) {
				// We are only interested in filter multiple inputs,
				// so with a single found input nothing to filter here.
				return true;
			} else if (field.group === false){
				// Field config indicates we should validate these inputs individually.
				return true;
			} else if (field.group === true) {
				// Field config indicates we should validate these inputs as a collection.
				// Therefore, only validate the firsts element.
				return (index === 0);
			} else if (isRadio && hasAtLeastOneChecked){
				if (hasAtLeastOneChecked){
					// Since radio has at least one checked just validate the checked input.
					return $(element).is(':checked');
				} else {
					// Since radio has no checked inputs just validate the first radio input.
					return (index === 0);
				}
			} else {
				return true;
			}
		});

		return filtered;
	};
}(window.jQuery);

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
			var options = this.options;
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

				if (options.debug){
					console.groupCollapsed('Prove.submitInterceptHandler.done()');
						console.log('isValid', isValid);
						console.log('nosubmit', nosubmit);
						console.log('submitSetup', submitSetup);
						console.log('submitStop', submitStop);
					console.groupEnd();
				}

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

!function ($) {
	"use strict";

	//isProved can be true, false, undefined.
	function toggleState(isValid, isProved){
		if (isProved === false) {
			isValid = false;
		} else {
			if (isProved === true && isValid !== false) isValid = true;
		}
		return isValid;
	}

	function evaluate(results){
		var isProved = undefined;
		$.each(results, function(index, result){
			isProved = toggleState(result, isProved);
		});
		return isProved;
	}

	$.fn.proveForm = function() {

		var form = $(this);
		var prove = form.data('prove');
		var states = prove.states;
		var fields = prove.options.fields;
		var filter = true;
		var promises = [];
		var dfd = $.Deferred();
		var combined;

		// Loop inputs and validate them. There may be multiple
		// identical inputs (ie radios) for which we do not want to
		// validate twice. Therefore, $.fn.provables() will filter
		// these multiples for us unless less field.multiple is true.
		form.provables(fields, filter).each(function(){
			var input = $(this);
			var field = fields[this.field];
			var promise = input.proveInput(field, states);
			promises.push(promise);
		});

		// wait for all field promises to resolve
		combined = $.when.apply($, promises);

		combined.done(function() {
			var results = $.makeArray(arguments);
			var valid = evaluate(results);

			if (prove.debug) {
				console.groupCollapsed('Proveform.done()');
				console.log('results', results);
				console.log('valid', valid);
				console.groupEnd();
			}

			// Trigger event indicating validation result
			form.trigger('validated.form.prove', {
				valid: valid
			});

			dfd.resolve(valid);
		});
		combined.fail(function(obj) {
			dfd.reject(obj);
		});
		combined.progress(function(){
			console.log('progress');
		});

		return dfd;
	};
}(window.jQuery);

!function ($) {
	"use strict";

	function clone(obj){
		return $.extend({}, obj);
	}

	function last(arr){
		return arr[arr.length - 1];
	}

	// pick validation result to return:
	// - the first result where result.valid === false
	// - or the last result in array
	function pickResult(results){
		var pick = clone(last(results));
		$.each(results, function(index, result){
			warnIncorrectResult(result);
			if (result.valid === false) pick = clone(result);
		});
		return pick;
	}

	function isPlugin (plugin){
		var exist = ($.isFunction($.fn[plugin]));
		if (!exist) console.error('Missing validator plugin "%s".', plugin);
		return exist;
	}

	function warnIncorrectResult(result){
		if (!('valid' in result)) console.warn('Missing `valid` property in validator ($.fn.' + result.validator + ') result.');
		if (!('field' in result)) console.warn('Missing `field` property in validator ($.fn.' + result.validator + ') result.');
		if (!('validator' in result)) console.warn('Missing `validator` property in validator ($.fn.' + result.validator + ') result.');
		if (!('message' in result)) console.warn('Missing `message` property in validator ($.fn.' + result.validator + ') result.');
	}

	// validate a single input
	$.fn.proveInput = function(field, states) {

		var validators = field.validators || {};
		var input = $(this);
		var enabled = input.booleanator(field.enabled);
		var stateful = input.booleanator(field.stateful);
		var dirty = input.dirty(field.group);
		var uuid = input.uuid();
		var state = states[uuid];
		var result = {
			field: field.name,
			validator: undefined,
			valid: undefined,
			message: undefined
		};
		var dfd = $.Deferred();
		var promises = [];
		var combined;

		if (field.debug){
			console.groupCollapsed('proveInput()', field.name);
			console.log('enabled', enabled);
			console.log('state', state);
			console.log('dirty', dirty);
			console.groupEnd();
		}

		// return early
		if (!enabled) {
			input.trigger('validated.input.prove', result);
			states[uuid] = false;
			dfd.resolve(undefined);
			return dfd;
		} else if (stateful && state && !dirty) {
			input.trigger('validated.input.prove', state); //clone here?
			dfd.resolve(state.valid);
			return dfd;
		} else {

			// loop validators
			$.each(validators, function(validator, config){

				config.field = field.name;
				config.validator = validator;

				// invoke validator plugin
				if (!isPlugin(validator)) return false;
				var promise = input[validator](config);
				promises.push(promise);

				// break loop at first (non-promise) result.valid === false
				return promise.valid;
			});

			// wait for the validator promises to resolve
			combined = $.when.apply($, promises);

			combined.done(function() {
				var results = $.makeArray(arguments);
				var result = pickResult(results);

				dfd.resolve(result.valid);

				//save state
				if (stateful) states[uuid] = result;

				// Trigger event indicating validation result
				input.trigger('validated.input.prove', result);
			});
			combined.fail(function(obj) {
				dfd.reject(obj);
			});
			combined.progress(function(){
				console.log('progress');
			});

			return dfd;
		}
	};
}(window.jQuery);

!function ($) {
	"use strict";

	$.fn.validate = function() {

		// Currently, it is not possible nor practical to have $.fn.validate()
		// work on a colleciton of elements. The reason is that $.fn.validate()
		// needs to return the form validation status or a (future) deferred.

		var el = $(this);
		var isForm = el.is(':prove-form');
		var isInput = el.is(':prove-input');

		// We trigger events here because the event
		// handlers bound to the form already have the
		// field data bound to the event handlers. These
		// event handlers will call the $.fn.proveForm()
		// or $.fn.proveInput() with the correct field data.
		if (isForm) {
			//el.trigger('validate.form.prove');
			return el.proveForm();
		} else if (isInput) {
			el.trigger('validate.input.prove');
			return this;
		} else {
			// An input could be dynamically inserted and therefore, it will not pass
			// the is(':prove-input') or is(':prove-form'). Therefore, we need to assume
			// here that it is an input.
			el.trigger('validate.input.prove');
			return this;
		}

	};
}(window.jQuery);

!function ($) {
	"use strict";

	// Custom selectors
	$.extend( $.expr[":"], {

		// http://jqueryvalidation.org/blank-selector/
		blank: function( a ) {
			return !$.trim( "" + $( a ).val() );
		},

		// http://jqueryvalidation.org/filled-selector/
		filled: function( a ) {
			var val = $( a ).val();
			return val !== null && !!$.trim( "" + val );
		},

		// http://jqueryvalidation.org/unchecked-selector/
		unchecked: function( a ) {
			return !$( a ).prop( "checked" );
		},

		//http://www.sitepoint.com/make-your-own-custom-jquery-selector/
		inview: function(el) {
			if ($(el).offset().top > $(window).scrollTop() - $(el).outerHeight(true) && $(el).offset().top < $(window).scrollTop() + $(el).outerHeight(true) + $(window).height()) {
				return true;
			}
			return false;
		},

		multiple: function(el) {
			var name = $(el).attr('name') || '';
			return (name.charAt(name.length - 1) === ']');
		},

		'prove-form': function(el) {
			return ($(el).data('prove'))? true : false;
		},
		'prove-input': function(el) {
			return ($(el).data('prove-uuid'))? true : false;
		}

	});
}(window.jQuery);

!function ($) {
	"use strict";

	//todo: support a `this` context and also a passed in context
	$.fn.booleanator = function(param) {

		var state;

		function evalSelector(selector){
			try {
				return !!$(selector).length;
			} catch (e) {
				console.warn('Invalid jquery selector (`%s`) param for booleanator plugin.', selector);
				return false;
			}
		}

		function evalIs(selector, context){
			try {
				return $(context).is(selector);
			} catch (e) {
				console.warn('Invalid jquery pseudo selector (`%s`) param for booleanator plugin.', selector);
				return false;
			}
		}

		if (typeof param === 'undefined'){
			state = true;
		} else if (typeof param === 'boolean') {
			state = param;
		} else if (typeof param === 'string'){
			state = (param.charAt(0) === ':')
				? evalIs(param, this)
				: evalSelector(param);
		} else if (typeof param === 'function'){
			state = param();
		} else {
			throw new Error('Invalid param for booleanator plugin.');
		}

		return state;
	};
}(window.jQuery);

!function ($) {
	"use strict";

	//http://stackoverflow.com/a/26057776/2620505
	function hashCode (str){
		var hash = 0;
		var i, char;
		if (str.length == 0) return hash;
		for (i = 0; i < str.length; i++) {
			char = str.charCodeAt(i);
			hash = ((hash<<5)-hash)+char;
			hash = hash & hash; // Convert to 32bit integer
		}
		return hash;
	}

	$.fn.dirty = function(makeDirty) {

		var el = $(this);
		var val = el.val() || '';
		var hash1, hash2, dirty;

		if ($.isArray(val)) val = val.toString();

		hash1 = el.data('prove-hash');
		hash2 = hashCode(val);
		dirty = (hash1 !== hash2);

		// override dirty state
		if (makeDirty) {
			el.data('prove-hash', false);
			return true;
		} else if (el.is(':radio')){
			return true;
		}

		if (dirty) el.data('prove-hash', hash2);
		return dirty;
	};
}(window.jQuery);

!function ($) {
	"use strict";

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
}(window.jQuery);

!function ($) {
	"use strict";

	$.fn.huntout = function(selector){
		var el = $(this);
		var container;

		if (typeof selector === 'string') {
			container = el.closest(selector);
		} else if ($.isArray(selector)){

			// test each array item until we find one
			// loop selectors in array of selectors until
			// we find the closests.
			for (var i = 0; i < selector.length; i++) {
				container = el.closest(selector[i]);
				if (container.length > 0) break;
			}
		} else if (typeof selector === 'function') {
			container = el.parents().filter(selector());
		} else {
			throw new Error('Invalid selector ("%s") param in huntout plugin.', selector);
		}

		return container;
	};

}(window.jQuery);

!function ($) {
	"use strict";

	/**
	* Fast UUID generator, RFC4122 version 4 compliant.
	* @author Jeff Ward (jcward.com).
	* @license MIT license
	* @link http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
	**/
	var UUID = (function() {
	var self = {};
	var lut = []; for (var i=0; i<256; i++) { lut[i] = (i<16?'0':'')+(i).toString(16); }
	self.generate = function() {
		var d0 = Math.random()*0xffffffff|0;
		var d1 = Math.random()*0xffffffff|0;
		var d2 = Math.random()*0xffffffff|0;
		var d3 = Math.random()*0xffffffff|0;
		return lut[d0&0xff]+lut[d0>>8&0xff]+lut[d0>>16&0xff]+lut[d0>>24&0xff]+'-'+
			lut[d1&0xff]+lut[d1>>8&0xff]+'-'+lut[d1>>16&0x0f|0x40]+lut[d1>>24&0xff]+'-'+
			lut[d2&0x3f|0x80]+lut[d2>>8&0xff]+'-'+lut[d2>>16&0xff]+lut[d2>>24&0xff]+
			lut[d3&0xff]+lut[d3>>8&0xff]+lut[d3>>16&0xff]+lut[d3>>24&0xff];
		};
		return self;
	})();


	$.fn.uuid = function() {

		//todo: handle array elements

		var el = $(this);
		var uuid = el.data('prove-uuid');
		if (!uuid) {
			uuid = UUID.generate();
			el.data('prove-uuid', uuid);
		}
		return uuid;
	};
}(window.jQuery);

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
		var name = input.attr('name');
		var val, idx, selector;

		//todo: why are we not handling multiple values here?

		if (isSelect){
			val = input.val();
		} else if ( isRadio ) {
			// single selection model
			val = input.filter(':checked').val();
		} else if ( isCheckbox){
			// multiple selection model
			selector = '[name="' + name + '"]:checked';
			val = input.closest('form').find(selector).val();
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

		return val;
	};
}(window.jQuery);

!function ($) {
	"use strict";

	$.fn.proveCompareTo = function( options ) {

		var input = $(this);
		var other = $(options.compareTo);
		var form = input.closest('form');
		var value1 = input.val();
		var value2 = other.val();
		var hasValue = input.hasValue();
		var isSetup = input.hasClass('validator-equalto-setup');
		var isEnabled = $('body').booleanator(options.enabled);
		var valid;

		if (!isEnabled) {
			valid = undefined;
		} else if (!hasValue){
			valid = true;
		} else if (value1 === options.ignore) {
			valid = true;
		} else if (value2 === options.ignore) {
			valid = true;
		} else if (options.comparison === '=') {
			valid = (value1 === value2);
		} else if (options.comparison === '!=') {
			valid = (value1 !== value2);
		} else if (options.comparison === '>=') {
			valid = (value1 >= value2);
		} else if (options.comparison === '>') {
			valid = (value1 > value2);
		} else if (options.comparison === '<=') {
			valid = (value1 <= value2);
		} else if (options.comparison === '<') {
			valid = (value1 < value2);
		} else {
			//
		}

		//setup event to validate this input when other input value changes
		if (!isSetup){
			input.addClass('validator-equalto-setup');
			//on blur of other input
			form.on('focusout', options.equalTo, function(){
				input.validate();
			});
		}

		//return validation result
		return {
			field: options.field,
			validator: options.validator,
			valid: valid,
			//value1: value1,
			message: options.message
		};
	};
}(window.jQuery);

!function ($) {
	"use strict";

	$.fn.proveDeferred = function(options){

		var input = $(this);
		var value = input.vals();
		var hasValue = input.hasValue();
		//var valid = input.hasValue();
		var isEnabled = $('body').booleanator(options.enabled);
		var dfd = $.Deferred();
		var result = {
			field: options.field,
			validator: options.validator,
			message: options.message
		};

		if (!isEnabled){
			result.valid = undefined;
			dfd.resolve(result);
		} else if (!hasValue) {
			// All validators are optional except for `required` validator.
			result.valid = true;
			dfd.resolve(result);
		} else {

			//issue progress
			dfd.notify({
				foo: 'bar'
			});

			result.valid = options.valid;
			setTimeout(function(){
				dfd.resolve(result);
			}, options.delay);
		}

		if (options.debug){
			console.groupCollapsed('Validator.proveDeferred()', options.field);
				console.log('options', options);
				console.log('input', input);
				console.log('value', value);
				console.log('isEnabled', isEnabled);
				console.log('valid', result.valid);
			console.groupEnd();
		}

		return dfd;
	};
}(window.jQuery);

!function ($) {
	"use strict";

	$.fn.proveEqualTo = function( options ) {

		var input = $(this);
		var other = $(options.equalTo);
		var form = input.closest('form');
		var value = input.val();
		var isSetup = input.hasClass('validator-equalto-setup');
		var isEnabled = $('body').booleanator(options.enabled);
		var isValid = (isEnabled)? (value === other.val()) : undefined;

		//setup event to validate this input when other input value changes
		if (!isSetup){
			input.addClass('validator-equalto-setup');
			//on blur of other input
			form.on('focusout', options.equalTo, function(){
				input.validate();
			});
		}

		//return validation result
		return {
			field: options.field,
			validator: options.validator,
			valid: isValid,
			//value: value,
			message: options.message
		};
	};
}(window.jQuery);

!function ($) {
	"use strict";

	$.fn.proveLength = function(options){

		var input = $(this);
		var value = input.vals();
		var hasValue = input.hasValue();
		var isValid = input.hasValue();
		var isEnabled = $('body').booleanator(options.enabled);
		var okMin = (typeof options.min !== 'undefined')? (value.length >= options.min) : true;
		var okMax = (typeof options.max !== 'undefined')? (value.length <= options.max) : true;

		if (!isEnabled){
			isEnabled = undefined;
		} else if (!hasValue) {
			// All validators are optional except of `required` validator.
			isValid = true;
		} else if (okMin && okMax) {
			isValid = true;
		} else {
			isValid = false;
		}

		if (options.debug){
			console.groupCollapsed('Validator.proveLength()', options.field);
				console.log('options', options);
				console.log('input', input);
				console.log('value', value);
				console.log('isEnabled', isEnabled);
				console.log('isValid', isValid);
			console.groupEnd();
		}

		return {
			field: options.field,
			validator: options.validator,
			valid: isValid,
			message: options.message
		};
	};
}(window.jQuery);

!function ($) {
	"use strict";

	$.fn.proveMin = function(options){

		var input = $(this);
		var value = input.vals();
		var isEnabled = $('body').booleanator(options.enabled);
		var isValid = (isEnabled)? value <= options.max : undefined;

		if (options.debug){
			console.groupCollapsed('Validator.proveMin()', options.field);
				console.log('options', options);
				console.log('input', input);
				console.log('value', value);
				console.log('isEnabled', isEnabled);
				console.log('isValid', isValid);
			console.groupEnd();
		}

		return {
			field: options.field,
			validator: options.validator,
			valid: isValid,
			message: options.message
		};
	};
}(window.jQuery);

!function ($) {
	"use strict";

	$.fn.proveMin = function(options){

		var input = $(this);
		var value = input.vals();
		var isEnabled = $('body').booleanator(options.enabled);
		var isValid = (isEnabled)? value >= options.min : undefined;

		if (options.debug){
			console.groupCollapsed('Validator.proveMin()', options.field);
				console.log('options', options);
				console.log('input', input);
				console.log('value', value);
				console.log('isEnabled', isEnabled);
				console.log('isValid', isValid);
			console.groupEnd();
		}

		return {
			field: options.field,
			validator: options.validator,
			valid: isValid,
			message: options.message
		};
	};
}(window.jQuery);

!function ($) {
	"use strict";

	$.fn.proveMissing = function( options ) {

		//return validation result
		return {
			field: options.field,
			validator: options.validator,
			valid: false,
			message: 'Prove validator "' + options.validator+ '" not found.'
		};
	};
}(window.jQuery);

!function ($) {
	"use strict";

	$.fn.provePattern = function(options){

		var input = $(this);
		var value = input.val();
		var hasValue = input.hasValue();
		var isEnabled = $('body').booleanator(options.enabled);
		var regex = (options.regex instanceof RegExp)
			? options.regex
			: new RegExp( "^(?:" + options.regex + ")$" );
		var isValid;

		if (!isEnabled){
			// Validators should return undefined when there is no value.
			// Decoraters will teardown any decoration when they receive an `undefined` validation result.
			isValid = undefined;
		} else if (!hasValue) {
			// All validators (except proveRequired) should return undefined when there is no value.
			// Decoraters will teardown any decoration when they receive an `undefined` validation result.
			isValid = undefined;
		} else if (regex instanceof RegExp) {
			isValid = regex.test(value);
		} else {
			isValid = false;
		}

		if (options.debug){
			console.groupCollapsed('Validator.provePattern()', options.field);
				console.log('options', options);
				console.log('isValid', isValid);
			console.groupEnd();
		}

		return {
			field: options.field,
			validator: options.validator,
			valid: isValid,
			message: options.message
		};
	};

}(window.jQuery);

!function ($) {
	"use strict";

	$.fn.provePrecision = function(options){

		var regex = /^(.)*(\.[0-9]{1,2})?$/;
		var input = $(this);
		var value = input.vals();
		var isEnabled = $('body').booleanator(options.enabled);
		var isValid = (isEnabled)? regex.test(value) : undefined;

		if (options.debug){
			console.groupCollapsed('Validator.provePrecision()', options.field);
				console.log('options', options);
				console.log('input', input);
				console.log('value', value);
				console.log('isEnabled', isEnabled);
				console.log('isValid', isValid);
			console.groupEnd();
		}

		return {
			field: options.field,
			validator: options.validator,
			valid: isValid,
			message: options.message
		};
	};
}(window.jQuery);

!function ($) {
	"use strict";

	$.fn.proveRequired = function(options){

		var input = $(this);
		var value = input.vals();
		var isEnabled = $('body').booleanator(options.enabled);
		var isValid = (isEnabled)? input.hasValue() : undefined;

		if (options.debug){
			console.groupCollapsed('Validator.proveRequired()', options.field);
				console.log('options', options);
				console.log('input', input);
				console.log('value', value);
				console.log('isEnabled', isEnabled);
				console.log('isValid', isValid);
			console.groupEnd();
		}

		return {
			field: options.field,
			validator: options.validator,
			valid: isValid,
			message: options.message
		};
	};
}(window.jQuery);

!function ($) {
	"use strict";

	$.fn.proveUnique = function(options){

		var input = $(this);
		var value = input.val();
		var hasValue = input.hasValue();
		var isEnabled = $('body').booleanator(options.enabled);
		var others = $(options.uniqueTo).not(input);
		var valid = true;

		if (!isEnabled){
			// Validators should return undefined when there is no value.
			// Decoraters will teardown any decoration when they receive an `undefined` validation result.
			valid = undefined;
		} else if (!hasValue) {
			// All validators (except proveRequired) should return undefined when there is no value.
			// Decoraters will teardown any decoration when they receive an `undefined` validation result.
			valid = undefined;
		} else {
			// compare against other input values
			others.each(function(){
				var other = $(this);
				if (other.hasValue() && other.val() === value) valid = false;
			});
		}

		if (options.debug){
			console.groupCollapsed('Validator.proveUnique()', options.field);
				console.log('options', options);
				console.log('value', value);
				console.log('valid', valid);
			console.groupEnd();
		}

		return {
			field: options.field,
			validator: options.validator,
			valid: valid,
			message: options.message
		};
	};
}(window.jQuery);
