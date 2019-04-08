'use strict';

const request = require( 'request-promise-native' );
const grunt = require( 'grunt' );

module.exports = {
	download_translations : async function( options ) {
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
			},
			batchSize: -1,
		});

		if ( ! options.url || ! options.slug ) {
			return { success: false, message: "All required options aren't filled in." };
		}

		options.url        = this.strip_trailing_slash( options.url );
		options.domainPath = this.strip_trailing_slash( options.domainPath );

		if ( ! options.textdomain ) {
			options.textdomain = options.slug;
		}

		const success = await this.get_project_data( options );
		return { success };
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

	get_api_url : function( options ) {
		return options.url + '/api/projects/' + options.slug;
	},

	get_project_data : async function( options ) {
		try {
			const data = await request( this.get_api_url( options ), { json: true } );
			const translation_sets = data.translation_sets.filter( set => {
				const percent_translated = parseInt( set.percent_translated );

				return set.current_count > 0 &&
					percent_translated >= options.filter.minimum_percentage &&
					percent_translated <= options.filter.maximum_percentage;
			} );

			let downloads = [];
			for ( const set of translation_sets ) {
				for ( const format of options.formats ) {
					const download = this.download_translations_from_set( set, format, options );
					downloads.push( download );

					if ( options.batchSize !== -1 && downloads.length >= options.batchSize ) {
						await Promise.all( downloads );
						downloads = [];
					}
				}
			}

			await Promise.all( downloads );

			return true;
		} catch( error ) {
			console.error( "An error occured downloading project data.", error );

			return false;
		}
	},

	download_translations_from_set : async function( set, format, options ) {
		let url = this.get_api_url( options ) + '/' + set.locale + '/' + set.slug + '/export-translations?format=' + format;

		if ( options.filter.waiting_strings ) {
			url += '&filters[status]=all';
		}

		const info = {
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

		return this.download_file( url, this.build_filename( options.file_format, info ) );
	},

	build_filename : function( format, data ) {
		return format.replace( /%(\w*)%/g, function(m,key) {
			return data.hasOwnProperty( key ) ? data[key] : '';
		});
	},

	download_file : async function( url, file ) {
		try {
			const body = await request( { url, encoding: null } );
			grunt.file.write( process.cwd() + '/' + file, body );

			return true;
		} catch( error ) {
			console.error( "An error occured downloading translation files.", error );

			return false;
		}
	}
};
