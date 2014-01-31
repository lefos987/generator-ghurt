'use strict';

/**
 * util-base
 * package of tools for util generators
 * file manipulation, templating, inserting..
 * 
 */


var utilBase = {

	/**
	 * Constants
	 * ------------------------------------------------------------------
	 */

	/**
	 * Prefix for template marker
	 * @type {String}
	 */
	tplMarker: '//mk:',

	/**
	 * File content caching system
	 * ready to be saved
	 * Need to be created in the init
	 * @type {Object}
	 */
	fileCache: null,


	/**
	 * Utils
	 * ------------------------------------------------------------------
	 */

	/**
	 * insert
	 * insert rendered templates into a file
	 * config parameter is an array of object which contain
	 * the config for each marker
	 * 
	 * @param  {[string]} filePath  Path of the file to update
	 * @param  {[array]}  config    Array of object {tpl, marker}
	 */
	insert: function (filePath, config) {
		var content, currentConf;
		content = (!!this.fileCache[filePath]) ? this.fileCache[filePath] : this.generator.readFileAsString(filePath);
		
		for (var i in config) {
			currentConf = config[i];
			content = this.insertTemplate(content, currentConf.tpl, currentConf.marker);
		}
		
		this.fileCache[filePath] = content;
	},

	/**
	 * insertTemplate
	 * insert content into the module
	 * if the file does not exists, the script generate it
	 * 
	 * @param		String	contentToInsert		Content to add in the module
	 */
	insertTemplate: function (content, tplLink, marker) {
		var contentToInsert = this.engineFromTpl(tplLink);
		var newContent = content.replace(new RegExp(' *' + this.tplMarker + marker), contentToInsert + '$&');

		// Might give troubles if a template is used more than once
		if (newContent.length !== content.length + contentToInsert.length) {
			throw 'Marker "' + marker + '" not found';
		}
		return newContent;
	},

	/**
	 * engineFromTpl
	 * use the template engine to render any template
	 * from his lin, relative to the generator path.
	 * the data used to render is this.generator
	 * @example
	 * .engineFromTpl('/_module.js')
	 * 
	 * @param  {string} tplLink Link to the template
	 * @return {string}         Content of the template rendered
	 */
	engineFromTpl: function (tplLink) {
		return this.generator.engine(
			this.generator.readFileAsString(this.generator.src._base + '/' + tplLink),
			this.generator
		);
	},

	/**
	 * template
	 * layer at the top of generator.template
	 * the idea is to use the local file content 
	 * storage instead of writing directly the file
	 * on the repo
	 * 
	 * @param  {[string]} tplLink  Template link
	 * @param  {[string]} filePath Location of the final file
	 */
	template: function (tplLink, filePath) {
		this.fileCache[filePath] = this.engineFromTpl(tplLink);
	},

	/**
	 * writeFiles
	 * use the local storage to write all
	 * the files in the path.
	 * 
	 */
	writeFiles: function () {
		for (var filePath in this.fileCache) {
			this.generator.dest.write(filePath, this.fileCache[filePath]);
		}
	},


	/**
	 * Checking
	 * ------------------------------------------------------------------
	 */

	/**
	 * checkFile
	 * validation method to check if a file exists
	 *
	 * @param		string			filePath		Path to the file
	 * @param		string			errorLabel	Error label in case (if undefined it won't throw any error)
	 * @return	boolean
	 */
	checkFile: function (filePath, errorLabel) {
		var testFile, failCase;
		
		// Test if the file is already in the cache
		if (!!this.fileCache[filePath]) {
			return true;
		}

		failCase = function () {
			if (!!errorLabel) {
				throw errorLabel;
			}
			return false;
		};
		try {
			testFile = this.generator.readFileAsString(filePath);
			return (!testFile || testFile === '') ? failCase() : true;
		}
		catch (error) {
			return failCase();
		}
	},

};

module.exports = utilBase;