/*
 * grunt-glotpress
 * https://github.com/markoheijnen/grunt-glotpress
 *
 * Copyright (c) 2014 Marko Heijnen
 * Licensed under the GPL license.
 */

'use strict';

var request = require( 'request' );

module.exports = function(grunt) {
	function download_file( url, file ) {
		request( url, function(error, response, body) {
			if ( ! error && response.statusCode === 200 ) {
				var feedback = grunt.file.write( process.cwd() + '/' + file, body );
			}
		});
	}

	grunt.registerMultiTask('glotpress_download', 'Gets translations from a GlotPress installation', function() {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			domainPath: 'languages',
			url: false,
			slug: false,
			textdomain: false,
			formats: [
				'po',
				'mo'
			]
		});

		if ( ! options.url || ! options.slug || ! options.textdomain ) {
			grunt.fail.report("All required options aren't filled in.");
			return;
		}

		var project_url = options.url + '/api/projects/' + options.slug;

		request( project_url, function(error, response, body) {
			if ( ! error && response.statusCode === 200 ) {
				var data = JSON.parse( body );
				var set, index, format, url;

				for ( index in data.translation_sets ) {
					set = data.translation_sets[ index ];

					for( format in options.formats ) {
						url = project_url + '/' + set.locale + '/' + set.slug + '/export-translations?format=' + options.formats[ format ];

						download_file( url, options.domainPath + '/' + options.textdomain + '-' + set.locale + '.' + options.formats[ format ] );
					}
				}
			}
		});

		return true;
	});

};
