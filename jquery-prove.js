/**
 * jQuery Prove (https://github.com/dhollenbecl/jquery-prove)
 */
!function ($) {
	"use strict";

	/**
	 * Constructor to create a new instance using the given element.
	 *
	 * @param {jQuery} element
	 * @param {Object} options
	 * @returns {Prove}
	 */
	function Prove(element, options) {

		this.$element = $(element);

		this.options = this.mergeOptions($.extend({}, options, this.$element.data()));

		// Initialization.
		// We have to clone to create a new reference.
		this.originalOptions = this.$element.clone()[0].options; //todo: why?
		this.options.onChange = $.proxy(this.options.onChange, this);
		this.options.onInitialized = $.proxy(this.options.onInitialized, this);

		// modify DOM
		//this.buildContainer();
		//this.updateButtonText();

		//this.$element.hide().after(this.$container);
		//this.options.onInitialized(this.$element, this.$container);
	}

	Prove.prototype = {

		defaults: {
			/**
			 * Triggered on change of the prove.
			 *
			 * Not triggered when selecting/deselecting options manually.
			 *
			 * @param {jQuery} option
			 * @param {Boolean} checked
			 */
			onChange : function(option, checked) {

			},
			/**
			 * Triggered after initializing.
			 *
			 * @param {jQuery} $select
			 * @param {jQuery} $container
			 */
			onInitialized: function($select, $container) {

			},
			option1: false,
			option2: 'btn btn-default',
			templates: {
				button: '<button type="button" class="prove dropdown-toggle" data-toggle="dropdown"><span class="prove-selected-text"></span> <b class="caret"></b></button>',
				liGroup: '<li class="prove-item prove-group"><label></label></li>'
			}
		},

		constructor: Prove,

		/**
		 * Builds the container of the prove.
		 */
		buildContainer: function() {
			//this.$container = $(this.options.buttonContainer);
			//this.$container.on('show.bs.dropdown', this.options.onDropdownShow);
			//this.$container.on('hide.bs.dropdown', this.options.onDropdownHide);
			//this.$container.on('shown.bs.dropdown', this.options.onDropdownShown);
			//this.$container.on('hidden.bs.dropdown', this.options.onDropdownHidden);
		},

		/**
		 * Unbinds the whole plugin.
		 */
		destroy: function() {
			//this.$container.remove();
			//this.$element.show();
			//this.$element.data('prove', null);
		},

		/**
		 * Refreshs the prove based on the selected options of the select.
		 */
		refresh: function () {

		},

		/**
		 * Select all options of the given values.
		 *
		 * If triggerOnChange is set to true, the on change event is triggered if
		 * and only if one value is passed.
		 *
		 * @param {Array} selectValues
		 * @param {Boolean} triggerOnChange
		 */
		select: function(selectValues, triggerOnChange) {

		},

		/**
		 * Clears all selected items.
		 */
		clearSelection: function () {
			//this.deselectAll(false);
			//this.updateButtonText();
			//this.updateSelectAll();
		},

		/**
		 * Deselects all options of the given values.
		 *
		 * If triggerOnChange is set to true, the on change event is triggered, if
		 * and only if one value is passed.
		 *
		 * @param {Array} deselectValues
		 * @param {Boolean} triggerOnChange
		 */
		deselect: function(deselectValues, triggerOnChange) {

		},

		/**
		 * Rebuild the plugin.
		 *
		 * Rebuilds the dropdown, the filter and the select all option.
		 */
		rebuild: function() {

		},

		/**
		 * Enable the prove.
		 */
		enable: function() {
			//this.$element.prop('disabled', false);
			//this.$button.prop('disabled', false)
			//	.removeClass('disabled');
		},

		/**
		 * Disable the prove.
		 */
		disable: function() {
			//this.$element.prop('disabled', true);
			//this.$button.prop('disabled', true)
			//	.addClass('disabled');
		},

		/**
		 * Set the options.
		 *
		 * @param {Array} options
		 */
		setOptions: function(options) {
			this.options = this.mergeOptions(options);
		},

		/**
		 * Merges the given options with the default options.
		 *
		 * @param {Array} options
		 * @returns {Array}
		 */
		mergeOptions: function(options) {
			return $.extend(true, {}, this.defaults, this.options, options);
		},

		/**
		 * Get all selected options.
		 *
		 * @returns {jQUery}
		 */
		getSelected: function() {

		}
	};

	$.fn.prove = function(option, parameter, extraOptions) {

		return this.each(function() {
			var data = $(this).data('prove');
			var options = typeof option === 'object' && option;

			// Initialize the prove.
			if (!data) {
				data = new Prove(this, options);
				$(this).data('prove', data);
			}

			// Call public methods.
			if (typeof option === 'string') {
				data[option](parameter, extraOptions);

				if (option === 'destroy') {
					$(this).data('prove', false);
				}
			}
		});
	};

	$.fn.prove.Constructor = Prove;

}(window.jQuery);