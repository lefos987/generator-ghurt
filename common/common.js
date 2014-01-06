
'use strict';

var common = {
	/**
 * _checkVersion
 * validation method to check if the string given
 * in param is a valid number
 * 
 * @param	string			version		Value to test
 * @return	boolean/string
 */
	checkVersion: function (version) {
		version = version.toLowerCase();
		var pass = version.match(/^[0-9]+(\.[0-9]+)+$/);
		if (pass || (version === 'latest')) {
			return true;
		}
		else {
			return 'Please enter a valid version number';
		}
	},
	/**
	 * _checkProjectVersion
	 * validation method to check if the string given
	 * in param is a valid number for versionning in
	 * package.json
	 * 
	 * @param	string			version		Value to test
	 * @return	boolean/string
	 */
	checkProjectVersion: function (version) {
		if (version.match(/^[0-9]+\.[0-9]+\.[0-9]+$/)) {
			return true;
		}
		else {
			return 'Please enter a valid version number in the format of X.Y.Z (X,Y,Z are integers)';
		}
	},

	/**
	 * _checkRequired
	 * validation method to check if a string is not empty
	 * 
	 * @param		string			opt		Value to test
	 * @return	boolean/string
	 */
	checkRequired: function (opt) {
		if (opt.length > 0) {
			return true;
		}
		else {
			return 'This option is required';
		}
	},

	/**
	 * _checkPort
	 * validation method to check if a number is a valid
	 * and usable port
	 * 
	 * @param		string			opt		Value to test
	 * @return	boolean/string
	 */
	checkPort: function (opt) {
		var port = parseInt(opt, 10);
		if (!!port && port > 0 && port < 65536) {
			return true;
		}
		else {
			return 'This port is not valid';
		}
	}
};

module.exports = common;