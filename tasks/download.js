/*
 * grunt-glotpress
 * https://github.com/markoheijnen/grunt-glotpress
 *
 * Copyright (c) 2014 Marko Heijnen
 * Licensed under the GPL license.
 */

'use strict';


module.exports = function(grunt) {
	var downloader = require( '../lib/downloader' );
	var is_done;

	grunt.registerMultiTask('glotpress_download', 'Gets translations from a GlotPress installation', function() {
		is_done = this.async();

		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options();

		downloader.download_translations( options, function(success, message) {
			if ( message && ! success ) {
				grunt.fail.report("All required options aren't filled in.");
			}

			is_done(success);
		} );
	});

};