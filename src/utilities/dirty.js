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

/*	//https://github.com/darkskyapp/string-hash/blob/master/index.js
	function hashCode2(str) {

		var hash = 5381;
		var i = str.length;

		while(i) {
			var code = str.charCodeAt(--i);
			hash = (hash * 33) ^ code;
		}

		return hash >>> 0;
	}*/


	$.fn.dirty = function(field) {

		field = field || {};

		var el = $(this);
		var val = el.val() || '';
		var hash1, hash2, dirty;

		if ($.isArray(val)) val = val.toString();

		hash1 = el.data('prove-hash');
		hash2 = hashCode(val);
		dirty = (hash1 !== hash2);

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
