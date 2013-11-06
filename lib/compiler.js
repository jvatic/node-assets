        var fs = require('fs'),
        __bind = require('./helpers').bindFunctionToScope,
AssetDirectory = require('./asset_directory');

/*
 * @class Compiler
 */
exports.Compiler = (function () {

  function Compiler ( config ) {

    /*
     * Initialize instance variables
     */

    if ( !config.output_dir ) {
      throw new Error( "Invalid output_dir: " + JSON.stringify( config.output_dir ) );
    }

    if ( !config.asset_dirs || typeof config.asset_dirs !== 'object' || !config.asset_dirs.length ) {
      throw new Error( "Invalid asset_dirs: " + JSON.stringify( config.asset_dirs ) );
    }

    this.config = config;

    /*
     * Bind scope of instance methods
     */


    /*
     * Return instance
     */

    return this;

  }

  Compiler.prototype.compileAssets = function () { } // TODO

  return Compiler;

})();
