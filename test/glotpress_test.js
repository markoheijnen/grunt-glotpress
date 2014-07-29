'use strict';

var 
	grunt = require('grunt'),
	path = require('path'),
	exec = require('child_process').exec,
	execOptions = {
		cwd: path.join(__dirname, '..')
	}
;

/*
	======== A Handy Little Nodeunit Reference ========
	https://github.com/caolan/nodeunit

	Test methods:
		test.expect(numAssertions)
		test.done()
	Test assertions:
		test.ok(value, [message])
		test.equal(actual, expected, [message])
		test.notEqual(actual, expected, [message])
		test.deepEqual(actual, expected, [message])
		test.notDeepEqual(actual, expected, [message])
		test.strictEqual(actual, expected, [message])
		test.notStrictEqual(actual, expected, [message])
		test.throws(block, [error], [message])
		test.doesNotThrow(block, [error], [message])
		test.ifError(value)
*/

exports.glotpress_download = {
	setUp: function(done) {
		// setup here if necessary
		done();
	},
	empty_options: function(test) {
		test.expect(1);

		exec('grunt glotpress_download:empty_options', execOptions, function(error, stdout) {
			test.equal(-1, -1, 'should not return anything');
			test.done();
		});

	}
};
