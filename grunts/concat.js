'use strict';

module.exports = function(grunt) {

	grunt.config('concat', {
		options: {
			nonull: true,
			// stripBanners: {
			// 	block: true
			// },
			process: function(src) {
				return src.replace(/\/.*sourceMappingURL.*/g, '');
			}
		},
		js: {
			dest: 'dist/jquery-prove.js',
			src: [
				'src/**/*.js',
			]
		}
	});
	grunt.loadNpmTasks('grunt-contrib-concat');
};
