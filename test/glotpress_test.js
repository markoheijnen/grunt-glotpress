'use strict';

var 
	glotpress_downloader = require('../lib/downloader');
;

exports.test_glotpress_download = {
	setUp: function(callback) {
		// setup here if necessary
		callback();
	},
	tearDown: function (callback) {
		// clean up
		callback();
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
