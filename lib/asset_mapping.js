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

    this.path_mapping = {};

    this.name_mapping = {};

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

      _this.path_mapping[ asset_directory.path ] = asset_directory;

      if ( _this.name_mapping[ asset_directory.name ] == null ) {
        _this.name_mapping[ asset_directory.name ] = {};
      }

      _this.name_mapping[ asset_directory.name ].directory = asset_directory;

      asset_directory.mapping = _this;

      // Recurse through directories
      asset_directory.directories().forEach(function ( item ) {
        scanAssetDirectory( item );
      });

      asset_directory.assets().forEach(function ( item ) {
        _this.path_mapping[ item.path ] = item;

        if ( _this.name_mapping[ item.name ] == null ) {
          _this.name_mapping[ item.name ] = {};
        }

        _this.name_mapping[ item.name ].asset = item;
      });

    }

    for ( var i = 0, _len = this.dir_paths.length; i < _len; i++ ) {
      scanAssetDirectory( new AssetDirectory( this.dir_paths[i] ) );
    }

    return this.path_mapping;
  }

  AssetMapping.prototype.directories = function () {

    if ( this._directories != null ) return this._directories;

    var _directories = [];

    if ( !Object.keys( this.path_mapping ).length ) {
      this.recursiveScan();
    }

    var item;
    for ( var path in this.path_mapping ) {
      item = this.path_mapping[path];

      if ( !item.isAssetDirectory() ) continue;

      _directories.push( item );
    }

    this._directories = _directories;

    return _directories;

  }

  AssetMapping.prototype.assets = function () {

    if ( this._assets != null ) return this._assets;

    var _assets = [];

    if ( !Object.keys( this.path_mapping ).length ) {
      this.recursiveScan();
    }

    var item;
    for ( var path in this.path_mapping ) {
      item = this.path_mapping[path];

      if ( item.isAssetDirectory() ) continue;

      _assets.push( item );
    }

    this._assets = _assets;

    return _assets;

  }

  return AssetMapping;

})();
