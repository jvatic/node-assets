        __bind = require('./helpers').bindFunctionToScope,
AssetDirectory = require('./asset_directory').AssetDirectory;

/*
 * @class AssetMapping
 */
exports.AssetMapping = (function () {

  function AssetMapping ( dir_paths ) {

    /*
     * Initialize instance variables
     */

    this.dir_paths = dir_paths;

    this.mapping = {};

    this.asset_name_mapping = {};

    /*
     * Bind scope of instance methods
     */

    this.recursiveScan = __bind( this.recursiveScan, this );

    this.directories = __bind( this.directories, this );

    this.assets = __bind( this.assets, this );

    /*
     * Return instance
     */

    return this;

  }

  AssetMapping.prototype.recursiveScan = function () {

    var _this = this;

    var scanAssetDirectory = function ( asset_directory ) {

      _this.mapping[ asset_directory.path ] = asset_directory;

      // Recurse through directories
      asset_directory.directories().forEach(function ( item ) {
        scanAssetDirectory( item );
      });

      asset_directory.assets().forEach(function ( item ) {
        _this.mapping[ item.path ] = item;

        _this.asset_name_mapping[ item.name ] = item;
      });

    }

    for ( var i = 0, _len = this.dir_paths.length; i < _len; i++ ) {
      scanAssetDirectory( new AssetDirectory( this.dir_paths[i] ) );
    }

    return this.mapping;
  }

  AssetMapping.prototype.directories = function () {

    if ( this._directories != null ) return this._directories;

    var _directories = [];

    if ( !Object.keys( this.mapping ).length ) {
      this.recursiveScan();
    }

    var item;
    for ( var path in this.mapping ) {
      item = this.mapping[path];

      if ( !item.isAssetDirectory() ) continue;

      _directories.push( item );
    }

    this._directories = _directories;

    return _directories;

  }

  AssetMapping.prototype.assets = function () {

    if ( this._assets != null ) return this._assets;

    var _assets = [];

    if ( !Object.keys( this.mapping ).length ) {
      this.recursiveScan();
    }

    var item;
    for ( var path in this.mapping ) {
      item = this.mapping[path];

      if ( item.isAssetDirectory() ) continue;

      _assets.push( item );
    }

    this._assets = _assets;

    return _assets;

  }

  return AssetMapping;

})();
