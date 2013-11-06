      var fs = require('fs'),
      __bind = require('./helpers').bindFunctionToScope,
extendsClass = require('./helpers').extendsClass,
  fsEachLine = require('./helpers').fsEachLine,
 fsJoinPaths = require('./helpers').fsJoinPaths;

/*
 * @class AssetDirectives
 */
var AssetDirectives = (function () {

  function AssetDirectives ( asset ) {

    /*
     * Initialize instance variables
     */

    this.asset = asset;

    /*
     * Bind scope of instance methods
     */

    this.parseDirectives = __bind( this.parseDirectives, this );

    this.directives = __bind( this.directives, this );

    this.assetFragments = __bind( this.assetFragments, this );

    /*
     * Return instance
     */

    return this;

  }

  AssetDirectives.prototype.parseDirectives = function () {

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

    this._directives = _directives;

    return _directives;

  }

  AssetDirectives.prototype.directives = function () {

    if ( this._directives == null ) {
      this.parseDirectives();
    }

    return this._directives;

  }

  AssetDirectives.prototype.assetFragments = function () { } // TODO

  return AssetDirectives;

})();

exports.AssetDirectives = AssetDirectives;

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

  function AssetDirectiveBase ( asset, directive_meta ) {

    /*
     * Initialize instance variables
     */

    this.asset = asset;

    this.directive_meta = directive_meta;

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

  function AssetRequireDirective ( asset, directive_meta ) {

    var ref = AssetRequireDirective.__super__.constructor.apply( this, arguments );

    ref.path = fsJoinPaths( asset.dir_path, directive_meta.args[0] );

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

  function AssetRequireTreeDirective ( asset, directive_meta ) {

    var ref = AssetRequireDirective.__super__.constructor.apply( this, arguments );

    ref.path = fsJoinPaths( asset.dir_path, directive_meta.args[0] );

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

  function AssetRequireSelfDirective ( asset, directive_meta ) {

    var ref = AssetRequireDirective.__super__.constructor.apply( this, arguments );

    ref.path = asset.path;

    return ref;

  }

  return AssetRequireSelfDirective;

})( AssetDirectiveBase );

exports.AssetRequireSelfDirective = AssetRequireSelfDirective;

