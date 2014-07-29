/*
 * grunt-glotpress
 * https://github.com/markoheijnen/grunt-glotpress
 *
 * Copyright (c) 2014 Marko Heijnen
 * Licensed under the GPL license.
 */

'use strict';

module.exports = function(grunt) {

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks

	grunt.registerMultiTask('glotpress_download', 'Gets translations from a GlotPress installation', function() {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			domainPath: '/languages',
			url: false,
			slug: false,
			textdomain: false,
		});

		if ( ! options.url || ! options.slug || ! options.textdomain ) {
			grunt.fail.report("All required options aren't filled in.");
			return;
		}

		return true;
	});

};
