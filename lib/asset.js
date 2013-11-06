         var fs = require('fs'),
         __bind = require('./helpers').bindFunctionToScope,
AssetDirectives = require('./asset_directives').AssetDirectives;

/*
 * @class Asset
 */
exports.Asset = (function () {

  function Asset ( file_path ) {

    /*
     * Initialize instance variables
     */

    if ( !fs.existsSync( file_path ) || !fs.statSync( file_path ).isFile() ) {
      throw new Error( "Invalid file path: " + JSON.stringify( file_path ) );
    }

    this.path = file_path;

    this.dir_path = file_path.split('/').slice(0,-1).join('/');

    this.directives = new AssetDirectives( this );

    /*
     * Bind scope of instance methods
     */

    this.isAssetDirectory = __bind( this.isAssetDirectory, this );

    /*
     * Return instance
     */

    return this;

  }

  Asset.prototype.isAssetDirectory = function () {
    return false;
  }

  return Asset;

})();
