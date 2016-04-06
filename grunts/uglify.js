'use strict';

module.exports = function(grunt) {

	grunt.config('uglify', {
		options: {
			banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> */'
		},
		prove: {
			options: {
				sourceMap: true,
				sourceMapName: 'dist/prove.map'
			},
			dest: 'dist/prove.min.js',
			src: [
				'dist/prove.js',
			]
		},
		decorator: {
			options: {
				sourceMap: true,
				sourceMapName: 'dist/decorator.map'
			},
			dest: 'dist/decorator.min.js',
			src: [
				'dist/decorator.js',
			]
		}
	});
	grunt.loadNpmTasks('grunt-contrib-uglify');
};
