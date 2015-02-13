'use strict';

var request = require( 'request' );
var api_url;
var current_requests = 0;
var is_done;

module.exports = {

	get_project_data: function( api_url, options ) {
		var request_options = {
			url: api_url,
			encoding: null
		};

		request( request_options, function(error, response, body) {
			if ( ! error && response.statusCode === 200 ) {
				var data = JSON.parse( body );
				var set, index, format;

				for ( index in data.translation_sets ) {
					set = data.translation_sets[ index ];

					if ( 0 === set.current_count ) {
						continue;
					}

					if ( options.filter.minimum_percentage > parseInt( set.percent_translated ) ) {
						continue;
					}

					for ( format in options.formats ) {
						download_translations( set, options.formats[ format ], options );
					}
				}
			}
			else {
				is_done(false);
			}
		});
	},

	strip_trailing_slash : function( str ) {
		if ( str.substr(-1) === '/' ) {
			return str.substr( 0, str.length - 1 );
		}

		return str;
	},

	download_translations : function( set, format, options ) {
		var url = api_url + '/' + set.locale + '/' + set.slug + '/export-translations?format=' + format;

		if ( options.filter.waiting_strings ) {
			url += '&filters[status]=all';
		}

		var info = {
			domainPath: options.domainPath,
			textdomain: options.textdomain,
			locale: set.locale,
			wp_locale: set.wp_locale,
			format: format
		};

		if ( ! info.wp_locale ) {
			info.wp_locale = info.locale;

			if ( format.indexOf('%wp_locale%') > -1 ) {
				grunt.log.writeln( "Locale " + set.locale + " doesn't have a wp_locale set." );
			}
		}

		download_file( url, build_filename( options.file_format, info ) );
	},

	uild_filename : function( format, data ) {
		return format.replace( /%(\w*)%/g, function(m,key) {
			return data.hasOwnProperty( key ) ? data[key] : '';
		});
	},

	download_file : function( url, file ) {
		current_requests++;

		request( url, function(error, response, body) {
			if ( ! error && response.statusCode === 200 ) {
				var feedback = grunt.file.write( process.cwd() + '/' + file, body );
			}

			current_requests--;

			if ( current_requests === 0 ) {
				is_done();
			}
		});
	}

}
