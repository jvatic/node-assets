var fs = require('fs');

var __bind = function (fn, me) {
  return function () {
    return fn.apply(me, arguments);
  }
}

var DIRECTIVE_REGEX = /^[#\/]{1,2}=\s*(\S+)\s*(.*)$/

exports.Compiler = (function () {

  function Compiler( config ) {

    // Instance variables

    if (!config.output_dir) {
      throw new Error("Invalid output_dir: " + JSON.stringify(config.output_dir));
    }

    if (!config.asset_dirs || typeof config.asset_dirs !== 'object' || !config.asset_dirs.length) {
      throw new Error("Invalid asset_dirs: " + JSON.stringify(config.asset_dirs));
    }

    this.config = config;

    // Instance methods

    this.buildFileList = __bind( this.buildFileList, this );

    this.files = __bind( this.files, this );

    this.buildFilesDirectives = __bind( this.buildFilesDirectives, this );

    this.filesDirectives = __bind( this.filesDirectives, this );

    this.compiledAsset = __bind( this.compiledAsset, this );

    this.valueForDirective = __bind( this.valueForDirective, this );

    this.compileAssets = __bind( this.compileAssets, this );

    return this;

  }

  Compiler.prototype.buildFileList = function buildFileList () {

    var _files = [];

    this.config.asset_dirs.forEach(function ( dir_path ) {

      enumerateFilesRecursive( dir_path, function ( file_path ) {

        _files.push( file_path );

      });

    });

    this._files = _files;

    return _files;

  }

  Compiler.prototype.files = function files () {
    if (this._files) return this._files;

    return this.buildFileList();
  }

  Compiler.prototype.buildFilesDirectives = function buildFilesDirectives () {

    var _files_directives = {};

    this.files().forEach(function ( file_path ) {

      // TODO: Only read until no directives are found

      var lines = fs.readFileSync( file_path ).toString().split("\n");

      var _directives = [];

      var line, m;
      for (var i = 0, _len = lines.length; i < _len; i++) {
        line = lines[i];

        // ignore empty lines
        if ((line === "") || (line && line.match(/^s*$/))) continue;

        m = line.match(DIRECTIVE_REGEX);

        // we've hit the end of the directives
        if (!m) break;

        _directives.push({
          directive: m[1],
          value: m[2],
          line_index: i
        });
      }

      _files_directives[file_path] = _directives;

    });

    this._files_directives = _files_directives;

    return this._files_directives;

  }

  Compiler.prototype.filesDirectives = function filesDirectives () {
    if (this._files_directives) return this._files_directives;

    return this.buildFilesDirectives();
  }

  Compiler.prototype.compiledAsset = function compileAsset( file_path ) {
    compiled_assets = this.compiled_assets || (this.compiled_assets = {})

    // Don't compile the same asset more than once
    if (compiled_assets[file_path]) return compiled_assets[file_path];

    var lines = fs.readFileSync( file_path ).toString().split("\n"); // TODO: only load needed lines

    var _this = this;

    (this.filesDirectives()[file_path] || []).forEach(function ( file_directive ) {
      lines[file_directive.line_index] = _this.valueForDirective( file_path, file_directive );
    });

    var output = lines.join("\n")

    compiled_assets[file_path] = output;

    return output;
  }

  Compiler.prototype.valueForDirective = function valueForDirective ( file_path, item ) {

    var output = [];

    var dir_path = file_path.split('/').slice(0,-1).join('/');

    console.log( 'valueForDirective', item.directive, item.value );

    switch (item.directive) {
      case "require":

        output.push(
          fs.readFileSync( dir_path + '/' + item.value ).toString()
        );

        break;

      case "require_tree":

        var _this = this;

        enumerateFilesRecursive( dir_path + '/' + item.value, function ( _path) {

          output.push( _this.compiledAsset( _path ) );

        });

        break;

      case "require_self": // TODO
        break;
    }

    return output.join("\n");
  }

  Compiler.prototype.compileAssets = function compileAssets () {

    var _this = this;

    this.files().forEach(function ( file_path ) {
      _this.compiledAsset( file_path );
    });

    // TODO: compile CoffeeScript files

    return this.compiled_assets;
  }

  return Compiler;

})();

var enumerateFilesRecursive = function enumerateFilesRecursive ( dir_path, callback ) {
  fs.readdirSync( dir_path ).forEach(function (item) {

    var item_path = dir_path + '/' + item;

    var item_stats = fs.statSync(item_path);

    // it's a directory, recurse
    if ( item_stats.isDirectory() ) {
      return enumerateFilesRecursive( item_path, callback );
    }

    // it's a file, let the caller know
    if ( item_stats.isFile() ) {
      return callback( item_path );
    }

  });
}

