      var fs = require('fs'),
      __bind = require('./helpers').bindFunctionToScope,
extendsClass = require('./helpers').extendsClass;

var AssetCompiler = (function () {

  function AssetCompiler ( asset ) {

    // Find a compiler to handle asset
    var _ref = this.constructor.__children__,
    _last_ext = asset.file_extensions.slice( -1 )[0],
    _compiler;
    for ( var i = 0, _len = _ref.length; i < _len; i++ ) {

      if ( _last_ext === _ref.input_extension ) {
        _compiler = _ref;
        break;
      }

    }

    if ( _compiler ) {

      // Compiles asset into specified output format
      return new _compiler( asset );

    } else {

      // Doesn't process asset at all
      return new AssetCompilerBase( asset );

    }

  }

  return AssetCompiler;

})();

exports.AssetCompiler = AssetCompiler;

exports.AssetCompilerBase = (function () {

  function AssetCompilerBase ( asset ) {

    /*
     * Initialize instance variables
     */

    this.asset = asset;

    /*
     * Bind scope of instance methods
     */

    /*
     * Return instance
     */

    return this;

  }

  AssetCompilerBase.prototype.compile = function () {
    // default behavior is to do nothing
  }

  return AssetCompilerBase;

})();

var AssetCoffeeScriptCompiler = (function (_super) {

  extendsClass( AssetCoffeeScriptCompiler, _super );

  function AssetCoffeeScriptCompiler ( asset ) {

    var ref = AssetCoffeeScriptCompiler.__super__.constructor.apply( this, arguments );

    /*
     * Initialize instance variables
     */

    this.input_extension = 'coffee';

    this.output_extension = 'js';

    /*
     * Bind scope of instance methods
     */

    /*
     * Return instance
     */

    this.compile = __bind( this.compile, this );

    return ref;

  }

  AssetCoffeeScriptCompiler.prototype.compile = function () {
    // TODO:
    //  - compile asset data into js from coffeescript
    //  - pop coffee file extension from assets file extensions
    //  - push js file extension if it's not there
  }

  return AssetCoffeeScriptCompiler;

})( AssetCompilerBase );

exports.AssetCoffeeScriptCompiler = AssetCoffeeScriptCompiler;

