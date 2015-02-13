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
		is_done = downloader.is_done = this.async();

		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			domainPath: 'languages',
			url: false,
			slug: false,
			textdomain: false,
			file_format: '%domainPath%/%textdomain%-%wp_locale%.%format%',
			formats: [
				'po',
				'mo'
			],
			filter: {
				translation_sets: false,
				minimum_percentage: 30,
				waiting_strings: false
			}
		});

		if ( ! options.url || ! options.slug ) {
			grunt.fail.report("All required options aren't filled in.");
			is_done(false);
		}

		options.url        = downloader.strip_trailing_slash( options.url );
		options.domainPath = downloader.strip_trailing_slash( options.domainPath );

		if ( ! options.textdomain ) {
			options.textdomain = options.slug;
		}

		var api_url = options.url + '/api/projects/' + options.slug;

		downloader.get_project_data( api_url, options );
	});

};