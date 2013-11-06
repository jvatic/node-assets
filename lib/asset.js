         var fs = require('fs'),
         __bind = require('./helpers').bindFunctionToScope,
   escapeRegExp = require('./helpers').escapeRegExp,
AssetDirectives = require('./asset_directives').AssetDirectives;

/*
 * @class Asset
 */
exports.Asset = (function () {

  function Asset ( file_path, directory ) {

    /*
     * Initialize instance variables
     */

    if ( !fs.existsSync( file_path ) || !fs.statSync( file_path ).isFile() ) {
      throw new Error( "Invalid file path: " + JSON.stringify( file_path ) );
    }

    this.directory = directory;

    this.dir_path = directory.path;

    this.path = file_path;

    // `name` is the path relative to the asset root minus the file extension
    relative_path = file_path.replace(new RegExp("^" + escapeRegExp( directory.root.path ) + "/?"), '')
    this.name = relative_path.replace(/(\/?[^.]+)\..*$/, "$1")

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
