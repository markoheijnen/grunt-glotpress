'use strict';

var request = require( 'request' );
var grunt = require( 'grunt' );

var api_url;
var current_requests = 0;
var callback;

module.exports = {

	download_translations : function( options, callback ) {
		this.callback = callback

		options = this.merge_defaults( options, {
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
				maximum_percentage: 100,
				waiting_strings: false
			}
		});

		if ( ! options.url || ! options.slug ) {
			this.callback( false, "All required options aren't filled in." );
			return;
		}

		options.url        = this.strip_trailing_slash( options.url );
		options.domainPath = this.strip_trailing_slash( options.domainPath );

		if ( ! options.textdomain ) {
			options.textdomain = options.slug;
		}

		api_url = options.url + '/api/projects/' + options.slug;

		this.get_project_data( api_url, options );
	},

	merge_defaults : function( options, defaults ) {
		Object.keys(options).forEach(function(name) {
			defaults[name] = options[name];
		}.bind());

		return defaults;
	},

	strip_trailing_slash : function( str ) {
		if ( str.substr(-1) === '/' ) {
			return str.substr( 0, str.length - 1 );
		}

		return str;
	},

	get_project_data : function( api_url, options ) {
		var self = this;

		request( api_url, function(error, response, body) {
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

					if ( options.filter.maximum_percentage < parseInt( set.percent_translated ) ) {
						continue;
					}

					for ( format in options.formats ) {
						self.download_translations_from_set( set, options.formats[ format ], options );
					}
				}
			}
			else {
				self.callback(false);
			}
		});
	},

	download_translations_from_set : function( set, format, options ) {
		var url = api_url + '/' + set.locale + '/' + set.slug + '/export-translations?format=' + format;

		if ( options.filter.waiting_strings ) {
			url += '&filters[status]=all';
		}

		var info = {
			domainPath: options.domainPath,
			textdomain: options.textdomain,
			locale: set.locale,
			wp_locale: set.wp_locale,
			slug: set.slug,
			slugSuffix: ( set.slug === "default" ) ? "" : "-" + set.slug,
			format: format,
		};

		if ( ! info.wp_locale ) {
			info.wp_locale = info.locale;

			if ( format.indexOf('%wp_locale%') > -1 ) {
				grunt.log.writeln( "Locale " + set.locale + " doesn't have a wp_locale set." );
			}
		}

		this.download_file( url, this.build_filename( options.file_format, info ) );
	},

	build_filename : function( format, data ) {
		return format.replace( /%(\w*)%/g, function(m,key) {
			return data.hasOwnProperty( key ) ? data[key] : '';
		});
	},

	download_file : function( url, file ) {
		var self = this;

		current_requests++;

		var request_options = {
			url: url,
			encoding: null
		};

		request( request_options, function(error, response, body) {
			if ( ! error && response.statusCode === 200 ) {
				var feedback = grunt.file.write( process.cwd() + '/' + file, body );
			}

			current_requests--;

			if ( current_requests === 0 ) {
				self.callback(true);
			}
		});
	}

}
