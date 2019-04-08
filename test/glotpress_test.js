'use strict';

const glotpress_downloader = require('../lib/downloader');

exports.test_glotpress_download = {
	setUp: function(callback) {
		// setup here if necessary
		callback();
	},
	tearDown: function (callback) {
		// clean up
		callback();
	},


	download_translations_test_empty_options: function(test) {
		const options = {};

		glotpress_downloader.download_translations( options ).then( function( { success, message } ) {
			test.equal( success, false );
			test.done();
		} );
	},

	download_translations_test_callback: function(test) {
		const options = {
			domainPath: 'tmp',
			url: 'http://wp-translate.org',
			slug: 'tabify-edit-screen',
			textdomain: 'tabify-edit-screen',
		};

		glotpress_downloader.download_translations( options ).then( function( { success, message } ) {
			test.equal( success, true);
			test.done();
		} );
	},


	merge_defaults_test_default: function(test) {
		const defaults = { test: '1' };
		const options  = glotpress_downloader.merge_defaults( {}, defaults );

		test.equal( options.test, '1' );

		test.done();
	},

	merge_defaults_test_overwrite: function(test) {
		const defaults = { test: '1' };
		const options  = glotpress_downloader.merge_defaults( { test: '2' }, defaults );

		test.equal( options.test, '2' );

		test.done();
	},

	strip_trailing_slash_without_slash: function(test) {
		test.equal( glotpress_downloader.strip_trailing_slash( 'http://google.nl'), 'http://google.nl', 'Should return url without trailing slash');

		test.done();
	},

	strip_trailing_slash_with_slash: function(test) {
		test.equal( glotpress_downloader.strip_trailing_slash( 'http://google.nl/'), 'http://google.nl', 'Should return url without trailing slash');

		test.done();
	}

};
