'use strict';

module.exports = function(grunt) {

	// setup
	grunt.initConfig({
		pkg: require('./package.json')
	});

	// load grunt tasks
	grunt.loadTasks('./grunts');

	// register tasks
	grunt.registerTask('lint', ['eslint']);
	grunt.registerTask('build', ['concat:js']);
	grunt.registerTask('default', ['check']);
};
