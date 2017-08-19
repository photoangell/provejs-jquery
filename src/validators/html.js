!function($) {
	'use strict';

	function uniqify(tags) {
		var uniqs = [];
		$.each(tags, function(i, el) {
			if ($.inArray(el, uniqs) === -1) uniqs.push(el);
		});
		return uniqs;
	}

	function inArray(el, arr) {
		return $.inArray(el, arr) !== -1;
	}

	function clean(name) {
		return name.replace('#', '').toLowerCase();
	}

	function tagNamesRecursive(nodes) {
		var tags = [];
		if (!nodes) return tags;

		$.each(nodes, function(i, node) {
			var name = clean(node.nodeName);
			var kids = tagNamesRecursive(node.childNodes);
			tags.push(name);
			tags = tags.concat(kids);
		});
		return tags;
	}

	function test(nodes, allowed) {
		var valid = true;
		allowed.push('text');

		$.each(nodes, function(index, node) {
			if (!inArray(node, allowed)) {
				valid = false;
			}
		});
		return valid;
	}

	function getNodes(value) {
		var nodes = $.parseHTML(value, document, true);
		var names = tagNamesRecursive(nodes);
		names = uniqify(names);
		names = names.sort();
		return names;
	}

	function cleanClone(arr) {
		return arr.slice(0).map(clean);
	}

	$.fn.proveHtml = function(options) {

		options.tags = options.tags || [];

		var input = $(this);
		var value = input.val();
		var enabled = $('body').booleanator(options.enabled);
		var allowed = cleanClone(options.tags);
		var nodes = (enabled)? getNodes(value) : [];
		var valid = (enabled)? test(nodes, allowed) : undefined;
		var has = valid? 'success' : 'danger';
		var validation = (enabled)? has : 'reset';
		var message = (validation === 'danger') ? options.message : undefined;

		if (options.debug) {
			console.groupCollapsed('Validator.proveTags()', options.field, options.initiator); /* eslint-disable indent */
			//console.log('options', options);
			//console.log('input', input);
			console.log('allowed', allowed);
			console.log('nodes', nodes);
			console.log('validation', validation);
			console.log('enabled', enabled);
			console.log('message', message);
			console.groupEnd(); /* eslint-enable indent */
		}

		return {
			field: options.field,
			validator: options.validator,
			status: 'validated',
			validation: validation,
			message: message
		};
	};
}(window.jQuery);
