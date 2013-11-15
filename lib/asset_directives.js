      var fs = require('fs'),
      __bind = require('./helpers').bindFunctionToScope,
extendsClass = require('./helpers').extendsClass,
  fsEachLine = require('./helpers').fsEachLine,
 fsJoinPaths = require('./helpers').fsJoinPaths;

/*
 * @class AssetDirectiveMapping
 */
var AssetDirectiveMapping = (function () {

  function AssetDirectiveMapping ( asset ) {

    /*
     * Initialize instance variables
     */

    this.asset = asset;

    /*
     * Bind scope of instance methods
     */

    this.parseDirectives = __bind( this.parseDirectives, this );

    this.directives = __bind( this.directives, this );

    this.compile = __bind( this.compile, this );

    /*
     * Return instance
     */

    return this;

  }

  AssetDirectiveMapping.prototype.parseDirectives = function () {

    var _directives = [];

    var DIRECTIVE_REGEX = /^[#\/]{1,2}=\s*(\S+)\s*(.*)$/;

    var _this = this;

    fsEachLine( this.asset.path, function ( line, stop ) {

      var m;

      // Ignore empty lines
      if ( line == null || line.match(/^\s*$/) ) return;

      // Directives must be the first thing in the file
      // Stop reading once the line isn't a directive
      if ( !( m = line.match( DIRECTIVE_REGEX ) ) ) return stop();

      var name = m[1];
      var args = m[2].split(' ');

      _directives.push( new AssetDirective( _this.asset, { name: name, args: args } ) );

    });

    // Add require_self directive at the end if none exist
    var _directive, _self_directive;
    for ( var i = 0, _len = _directives.length; i < _len; i++ ) {
      _directive = _directives[i];

      if ( this.asset === _directive.item ) {
        _self_directive = _directive;
        break;
      }
    }

    if ( _self_directive == null ) {
      _directives.push( new AssetRequireSelfDirective( this.asset ) );
    }

    this._directives = _directives;

    return _directives;

  }

  AssetDirectiveMapping.prototype.directives = function () {

    if ( this._directives == null ) {
      this.parseDirectives();
    }

    return this._directives;

  }

  AssetDirectiveMapping.prototype.compile = function () {

    // Compile all directives
    // Output data

  }

  return AssetDirectiveMapping;

})();

exports.AssetDirectiveMapping = AssetDirectiveMapping;

/*
 * @class AssetDirective
 */
var AssetDirective = (function () {

  function AssetDirective ( asset, directive_meta ) {

    var ref;

    switch ( directive_meta.name ) {

      case "require":
        ref = new AssetRequireDirective( asset, directive_meta );
        break;

      case "require_tree":
        ref = new AssetRequireTreeDirective( asset, directive_meta );
        break;

      case "require_self":
        ref = new AssetRequireSelfDirective( asset, directive_meta );
        break;

    }

    return ref;

  }

  return AssetDirective;

})();

exports.AssetDirective = AssetDirective;

/*
 * @class AssetDirectiveBase
 */
var AssetDirectiveBase = (function () {

  function AssetDirectiveBase ( reference_asset, directive_meta ) {

    /*
     * Initialize instance variables
     */

    this.reference_asset = reference_asset;

    this.directive_meta = directive_meta;

    this.mapping = reference_asset.mapping;

    /*
     * Bind scope of instance methods
     */

    /*
     * Return instance
     */

    return this;

  }

  return AssetDirectiveBase;

})();

exports.AssetDirectiveBase = AssetDirectiveBase;

/*
 * @class AssetRequireDirective
 * @extends AssetDirectiveBase
 */
var AssetRequireDirective = (function ( _super ) {

  extendsClass( AssetRequireDirective, _super );

  function AssetRequireDirective ( reference_asset, directive_meta ) {

    var ref = AssetRequireDirective.__super__.constructor.apply( this, arguments );

    var name_or_path = directive_meta.args[0];

    var relative_path = fsJoinPaths( reference_asset.dir_path, directive_meta.args[0] );

    ref.item = ref.mapping.lookupAsset( relative_path ) || ref.mapping.lookupAsset( name_or_path );

    if ( ref.item == null ) {
      throw new Error( "Invalid directive: " + directive_meta.name + " " + directive_meta.args.join(' ') );
    }

    return ref;

  }

  return AssetRequireDirective;

})( AssetDirectiveBase );

exports.AssetRequireDirective = AssetRequireDirective;

/*
 * @class AssetRequireTreeDirective
 * @extends AssetDirectiveBase
 */
var AssetRequireTreeDirective = (function ( _super ) {

  extendsClass( AssetRequireTreeDirective, _super );

  function AssetRequireTreeDirective ( reference_asset, directive_meta ) {

    var ref = AssetRequireDirective.__super__.constructor.apply( this, arguments );

    var name_or_path = directive_meta.args[ 0 ];

    var relative_path = fsJoinPaths( reference_asset.dir_path, name_or_path );

    ref.item = ref.mapping.lookupDirectory( relative_path ) || ref.mapping.lookupDirectory( name_or_path );

    if ( ref.item == null ) {
      throw new Error( "Invalid directive: " + directive_meta.name + " " + directive_meta.args.join(' ') );
    }

    return ref;

  }

  return AssetRequireTreeDirective;

})( AssetDirectiveBase );

exports.AssetRequireTreeDirective = AssetRequireTreeDirective;

/*
 * @class AssetRequireSelfDirective
 * @extends AssetDirectiveBase
 */
var AssetRequireSelfDirective = (function ( _super ) {

  extendsClass( AssetRequireSelfDirective, _super );

  function AssetRequireSelfDirective ( reference_asset, directive_meta ) {

    var ref = AssetRequireDirective.__super__.constructor.apply( this, arguments );

    ref.item = reference_asset;

    return ref;

  }

  return AssetRequireSelfDirective;

})( AssetDirectiveBase );

exports.AssetRequireSelfDirective = AssetRequireSelfDirective;

