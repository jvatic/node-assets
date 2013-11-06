     var fs = require('fs'),
     __bind = require('./helpers').bindFunctionToScope,
fsJoinPaths = require('./helpers').fsJoinPaths,
      Asset = require('./asset').Asset;

/*
 * @class AssetDirectory
 */
exports.AssetDirectory = (function () {

  function AssetDirectory ( dir_path, root_directory ) {

    /*
     * Initialize instance variables
     */

    if ( !fs.existsSync( dir_path ) || !fs.statSync( dir_path ).isDirectory() ) {
      throw new Error( "Invalid directory path: " + JSON.stringify( dir_path ) );
    }

    this.path = dir_path;

    if ( root_directory == null ) {
      this.root = this;
    } else {
      this.root = root_directory;
    }

    /*
     * Bind scope of instance methods
     */

    this.isAssetDirectory = __bind( this.isAssetDirectory, this );

    this.scanDirectory = __bind( this.scanDirectory, this );

    this.assets = __bind( this.assets, this );

    this.directories = __bind( this.directories, this );

    /*
     * Return instance
     */

    return this;

  }

  AssetDirectory.prototype.isAssetDirectory = function () {
    return true;
  }

  AssetDirectory.prototype.scanDirectory = function () {

    var _assets = [];

    var _directories = [];

    var _this = this;

    fs.readdirSync( this.path ).forEach(function ( item ) {

      var path = fsJoinPaths( _this.path, item );

      var stats = fs.statSync( path );

      if ( stats.isDirectory() ) {
        return _directories.push( new AssetDirectory( path, _this.root ) );
      }

      if ( stats.isFile() ) {
        return _assets.push( new Asset( path, _this ) );
      }

    });

    this._assets = _assets;
    this._directories = _directories;

  }

  AssetDirectory.prototype.assets = function () {

    if ( this._assets == null ) {
      this.scanDirectory();
    }

    return this._assets;

  }

  AssetDirectory.prototype.directories = function () {

    if ( this._directories == null ) {
      this.scanDirectory();
    }

    return this._directories;

  }

  return AssetDirectory;

})();
