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

	$.fn.dirty = function(field) {

		field = field || {};

		var el = $(this);
		var val = el.val() || '';
		var hash1 = el.data('prove-hash');
		var hash2 = hashCode(val);
		var dirty = (hash1 !== hash2);

		// override dirty state for inputs which could be grouped
		if (field.group) {
			//groups are already dirty
			return true;
		} else if (el.is(':radio')){
			return true;
		}

		if (dirty) el.data('prove-hash', hash2);
		return dirty;
	};
}(window.jQuery);
